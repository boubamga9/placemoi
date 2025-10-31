import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { isEventAccessible } from '$lib/utils/event-utils';
import * as XLSX from 'xlsx';

async function processFileWithAI(file: File) {
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
                    - Extract ONLY the number from table field (e.g., if it says "Table 1" or "table 1", extract just "1")
                    - Extract ONLY the number from seat field if present
                    - Return a JSON object with a "guests" array containing objects with the format:
                    {"guests": [{"guest_name": "Full Name", "table_number": "1", "seat_number": "1"}]}
                    
                    The table_number and seat_number should contain ONLY the numeric value, no text.`
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
        console.log('🤖 Processing file with AI...');
        const guests = await processFileWithAI(file);

        console.log('✅ AI processing complete. Guests extracted:', guests.length);

        if (!Array.isArray(guests) || guests.length === 0) {
            console.log('❌ No guests found in file');
            throw error(400, 'Aucun invité trouvé dans le fichier');
        }

        console.log('📋 Sample guest data:', guests[0]);

        // Helper function to extract numbers from strings
        const extractNumber = (value: any): string => {
            if (!value) return '';
            const str = value.toString();
            // Extract only digits
            const match = str.match(/\d+/);
            return match ? match[0] : str;
        };

        const guestsToInsert = guests.map((guest: any) => ({
            event_id: params.id!,
            guest_name: guest.guest_name || guest.name || '',
            table_number: extractNumber(guest.table_number || guest.table || ''),
            seat_number: guest.seat_number || guest.seat ? extractNumber(guest.seat_number || guest.seat) : null
        }));

        console.log('📊 Cleaned data sample:', guestsToInsert[0]);
        console.log('💾 Inserting guests into database...', guestsToInsert.length, 'guests');

        const { error: insertError } = await supabase
            .from('guests')
            .insert(guestsToInsert);

        if (insertError) {
            console.error('❌ Error inserting guests:', insertError);
            throw error(500, 'Erreur lors de l\'insertion des invités');
        }

        console.log('✅ Guests inserted successfully!');
        console.log('📤 Sending response with guestsCount:', guests.length);

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

