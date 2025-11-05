import { error, redirect, fail } from '@sveltejs/kit';
import type { Database } from '$lib/database/database.types';
import { env } from '$env/dynamic/private';
import { isEventAccessible } from '$lib/utils/event-utils';
import { handleDuplicateGuestNames } from '$lib/utils/guest-utils';
import { tryParseCSV, isSimpleCSV } from '$lib/utils/csv-parser';
import * as XLSX from 'xlsx';

type Event = Database['public']['Tables']['events']['Row'];

export const load = async ({ params, locals: { supabase, safeGetSession } }: any) => {
    const { session } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/auth');
    }

    const { id } = params;

    // Get the event
    const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('owner_id', session.user.id)
        .single();

    if (fetchError || !event) {
        throw error(404, 'Événement non trouvé');
    }

    return {
        event: event as Event,
        isEventAccessible: isEventAccessible(event.event_date)
    };
};

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
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
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

    // Limit content size
    const MAX_LINES = 1000;
    const MAX_CHARS = MAX_LINES * 50;

    let limitedContent = fileContent;

    // 1️⃣ Check if text is too long
    if (fileContent.length > MAX_CHARS) {
        console.warn(`⚠️ Le fichier dépasse ${MAX_LINES} lignes estimées (${MAX_CHARS} caractères). Il sera tronqué.`);
        limitedContent = fileContent.substring(0, MAX_CHARS);
    }

    // 2️⃣ Send to GPT
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
                    Return a JSON object with a "guests" array containing objects with the format:
                    {"guests": [{"guest_name": "Name", "table_number": "Table"}]}`
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
    console.log('📦 OpenAI API response:', JSON.stringify(data).substring(0, 200));

    const content = data.choices[0].message.content;
    console.log('📄 Response content length:', content.length);
    console.log('📄 Full response content:', content);

    // Try to parse as JSON object first
    let guests;
    try {
        console.log('🔍 Parsing JSON response...');
        guests = JSON.parse(content);
        console.log('✅ JSON parsed successfully, initial guests object:', JSON.stringify(guests));
        // If it's a JSON object with a key, extract the array
        if (typeof guests === 'object' && !Array.isArray(guests)) {
            console.log('🔍 Looking for guests array in object keys:', Object.keys(guests));
            // Try to find the array in the object
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
        console.error('Response content:', content);
        throw new Error('Invalid JSON response from AI');
    }

    const finalGuests = Array.isArray(guests) ? guests : [];
    console.log('🎉 Final guests extracted:', finalGuests.length, 'guests');

    return finalGuests;
}

export const actions = {
    upload: async ({ request, params, locals: { supabase, safeGetSession } }: any) => {
        const { session } = await safeGetSession();

        if (!session) {
            throw redirect(303, '/auth');
        }

        console.log('📥 Upload action received');

        // Check if event is still accessible (5 days after event_date)
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('event_date')
            .eq('id', params.id)
            .eq('owner_id', session.user.id)
            .single();

        if (eventError || !event) {
            return fail(404, { error: 'Événement non trouvé' });
        }

        if (!isEventAccessible(event.event_date)) {
            return fail(410, { error: 'Impossible d\'importer des invités : cet événement n\'est plus accessible (5 jours après la date de l\'événement)' });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('❌ No file provided');
            return fail(400, { error: 'Aucun fichier fourni' });
        }

        console.log('📄 File received:', file.name, 'Size:', file.size);

        // Check file extension (more flexible)
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
            return fail(400, {
                error: 'Type de fichier non autorisé. Formats acceptés: CSV, Excel (tous formats), TXT, Sheets.'
            });
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
                return fail(400, { error: 'Aucun invité trouvé dans le fichier' });
            }

            console.log('📋 Sample guest data:', guests[0]);

            // Get existing guest names
            if (existingGuestsResult.error) {
                console.error('Error fetching existing guests:', existingGuestsResult.error);
            }

            const existingNames = existingGuestsResult.data?.map(g => g.guest_name) || [];

            // Prepare guests data
            const guestsPrepared = guests.map((guest: any) => ({
                guest_name: guest.guest_name || guest.name || '',
                table_number: guest.table_number?.toString() || guest.table?.toString() || '',
                seat_number: guest.seat_number?.toString() || guest.seat?.toString() || null
            }));

            // Handle duplicate names (adds 1, 2, 3, etc. to duplicates)
            const guestsWithDuplicatesHandled = handleDuplicateGuestNames(
                guestsPrepared,
                existingNames
            );

            // Insert guests into database
            const guestsToInsert = guestsWithDuplicatesHandled.map((guest) => ({
                event_id: params.id,
                ...guest
            }));

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
                    return fail(500, { error: 'Erreur lors de l\'insertion des invités' });
                }

                insertedCount += batch.length;
                console.log(`✅ Inserted batch: ${insertedCount}/${guestsToInsert.length} guests`);
            }

            console.log('✅ All guests inserted successfully!');

            const response = {
                success: true,
                guestsCount: guests.length
            };

            console.log('📤 Sending response:', JSON.stringify(response));
            console.log('📊 Guests length used:', guests.length);

            return response;
        } catch (err) {
            console.error('Error processing file:', err);
            return fail(500, {
                error: 'Erreur lors du traitement du fichier',
                details: err instanceof Error ? err.message : 'Unknown error'
            });
        }
    }
};
