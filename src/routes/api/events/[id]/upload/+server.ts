import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { isEventAccessible } from '$lib/utils/event-utils';
import { handleDuplicateGuestNames } from '$lib/utils/guest-utils';
import { tryParseCSV, isSimpleCSV } from '$lib/utils/csv-parser';
import * as XLSX from 'xlsx';

/**
 * Processes a file to extract guest information
 * Tries local CSV parsing first, falls back to AI if needed
 */
async function processFile(file: File): Promise<any[]> {
    console.log('📖 Reading file content...');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if it's an Excel file
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ||
        file.name.endsWith('.xlsm') || file.name.endsWith('.xlsb') ||
        file.name.endsWith('.xltx') || file.name.endsWith('.xltm');

    let fileContent = '';

    if (isExcel) {
        console.log('📊 Detected Excel file, parsing...');
        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            // Get the first worksheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // Convert to CSV
            fileContent = XLSX.utils.sheet_to_csv(worksheet);
            console.log('✅ Excel parsed successfully');
        } catch (e) {
            console.error('❌ Error parsing Excel file:', e);
            throw new Error('Impossible de lire le fichier Excel');
        }
    } else {
        // Text file (CSV, TXT)
        fileContent = buffer.toString('utf-8');
    }

    // OPTIMIZATION 1: Try local CSV parsing first (avoids OpenAI call)
    if (isSimpleCSV(file.name, fileContent)) {
        console.log('🔍 Attempting local CSV parsing...');
        const localParsed = tryParseCSV(fileContent);

        if (localParsed && localParsed.length > 0) {
            console.log('✅ Successfully parsed CSV locally!', localParsed.length, 'guests');
            // Convert to format expected by rest of code
            return localParsed.map(g => ({
                guest_name: g.guest_name,
                table_number: g.table_number,
                seat_number: g.seat_number
            }));
        }
        console.log('⚠️ Local parsing failed, falling back to AI...');
    }

    // Fallback to AI processing
    return await processFileWithAI(fileContent);
}

async function processFileWithAI(fileContent: string) {

    console.log('📝 File content length:', fileContent.length, 'characters');
    console.log('📄 First 500 characters:', fileContent.substring(0, 500));

    const MAX_LINES = 1000;
    const MAX_CHARS = MAX_LINES * 50;

    let limitedContent = fileContent;
    if (fileContent.length > MAX_CHARS) {
        console.warn(`⚠️ Le fichier dépasse ${MAX_LINES} lignes estimées (${MAX_CHARS} caractères). Il sera tronqué.`);
        limitedContent = fileContent.substring(0, MAX_CHARS);
    }

    console.log('🚀 Sending request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert at extracting guest information from various file formats. 
                    Extract names and table numbers from the following data.
                    
                    Important rules:
                    - For table_number: Keep the value as-is. It can be a number (e.g., "1", "2") or a table name (e.g., "Table VIP", "Table des mariés", "Table 1").
                    - For seat_number: Extract the number if present, otherwise keep as-is
                    - Return a JSON object with a "guests" array containing objects with the format:
                    {"guests": [{"guest_name": "Full Name", "table_number": "1", "seat_number": "1"}]}
                    
                    The table_number can be either numeric or text (table names are allowed).`
                },
                {
                    role: 'user',
                    content: `Extract guest information from this file:\n\n${limitedContent}`
                }
            ],
            response_format: { type: 'json_object' }
        })
    });

    console.log('📡 OpenAI API response status:', response.status);

    if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('📄 Full response content:', content);

    let guests;
    try {
        console.log('🔍 Parsing JSON response...');
        guests = JSON.parse(content);
        console.log('✅ JSON parsed successfully, initial guests object:', JSON.stringify(guests));

        if (typeof guests === 'object' && !Array.isArray(guests)) {
            const possibleKeys = ['guests', 'data', 'results', 'invites', 'list'];
            for (const key of possibleKeys) {
                if (Array.isArray(guests[key])) {
                    console.log(`📋 Found array at key '${key}' with length:`, guests[key].length);
                    guests = guests[key];
                    break;
                }
            }
        }
    } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid JSON response from AI');
    }

    const finalGuests = Array.isArray(guests) ? guests : [];
    console.log('🎉 Final guests extracted:', finalGuests.length, 'guests');

    return finalGuests;
}

export const POST: RequestHandler = async ({ request, params, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    console.log('📥 Upload API received');

    // Check if event is still accessible (5 days after event_date)
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('event_date')
        .eq('id', params.id)
        .single();

    if (eventError || !event) {
        throw error(404, 'Événement non trouvé');
    }

    if (!isEventAccessible(event.event_date)) {
        throw error(410, 'Impossible d\'importer des invités : cet événement n\'est plus accessible (5 jours après la date de l\'événement)');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        console.log('❌ No file provided');
        throw error(400, 'Aucun fichier fourni');
    }

    console.log('📄 File received:', file.name, 'Size:', file.size);

    const allowedExtensions = [
        '.csv',
        '.xlsx',
        '.xls',
        '.xlsm',
        '.xlsb',
        '.xltx',
        '.xltm',
        '.txt'
    ];

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        throw error(400, 'Type de fichier non autorisé');
    }

    try {
        console.log('🤖 Processing file...');

        // OPTIMIZATION 3: Parallelize fetching existing guests with file processing
        const [guests, existingGuestsResult] = await Promise.all([
            processFile(file),
            supabase
                .from('guests')
                .select('guest_name')
                .eq('event_id', params.id)
        ]);

        console.log('✅ File processing complete. Guests extracted:', guests.length);

        if (!Array.isArray(guests) || guests.length === 0) {
            console.log('❌ No guests found in file');
            throw error(400, 'Aucun invité trouvé dans le fichier');
        }

        console.log('📋 Sample guest data:', guests[0]);

        // Get existing guest names
        if (existingGuestsResult.error) {
            console.error('Error fetching existing guests:', existingGuestsResult.error);
        }

        const existingNames = existingGuestsResult.data?.map(g => g.guest_name) || [];

        // Helper function to clean and normalize values
        // For table_number: accept both numbers and text (e.g., "Table VIP", "1", "Table des mariés")
        // For seat_number: extract number if present, otherwise keep as is
        const cleanTableNumber = (value: any): string => {
            if (!value) return '';
            return value.toString().trim();
        };

        const cleanSeatNumber = (value: any): string | null => {
            if (!value) return null;
            const str = value.toString().trim();
            // Extract number if present, otherwise return the string
            const match = str.match(/\d+/);
            return match ? match[0] : str;
        };

        // Prepare guests data
        const guestsPrepared = guests.map((guest: any) => ({
            guest_name: guest.guest_name || guest.name || '',
            table_number: cleanTableNumber(guest.table_number || guest.table || ''),
            seat_number: guest.seat_number || guest.seat ? cleanSeatNumber(guest.seat_number || guest.seat) : null
        }));

        // Handle duplicate names (adds 1, 2, 3, etc. to duplicates)
        const guestsWithDuplicatesHandled = handleDuplicateGuestNames(
            guestsPrepared,
            existingNames
        );

        // Insert guests into database
        const guestsToInsert = guestsWithDuplicatesHandled.map((guest) => ({
            event_id: params.id!,
            ...guest
        }));

        console.log('📊 Cleaned data sample:', guestsToInsert[0]);
        console.log('💾 Inserting guests into database...', guestsToInsert.length, 'guests');

        // OPTIMIZATION 2: Insert by adaptive batches (max 500) for optimal performance
        // If <= 500 guests: single batch (fastest), if > 500: batches of 500
        const BATCH_SIZE = Math.min(500, guestsToInsert.length);
        let insertedCount = 0;

        for (let i = 0; i < guestsToInsert.length; i += BATCH_SIZE) {
            const batch = guestsToInsert.slice(i, i + BATCH_SIZE);
            const { error: insertError } = await supabase
                .from('guests')
                .insert(batch);

            if (insertError) {
                console.error('❌ Error inserting guests batch:', insertError);
                throw error(500, 'Erreur lors de l\'insertion des invités');
            }

            insertedCount += batch.length;
            console.log(`✅ Inserted batch: ${insertedCount}/${guestsToInsert.length} guests`);
        }

        console.log('✅ All guests inserted successfully!');

        return json({
            success: true,
            guestsCount: guests.length
        });
    } catch (err) {
        console.error('Error processing file:', err);
        if (err instanceof Error) {
            throw error(500, err.message);
        }
        throw error(500, 'Erreur lors du traitement du fichier');
    }
};

