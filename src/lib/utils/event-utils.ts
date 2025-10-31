import { nanoid } from 'nanoid';

/**
 * Generate a random 8-character slug for events
 * Uses nanoid for URL-safe and collision-resistant IDs
 */
export function generateEventSlug(): string {
    return nanoid(8);
}

/**
 * Check if a slug is unique in the database
 */
export async function isSlugUnique(slug: string, supabase: any): Promise<boolean> {
    const { data, error } = await supabase
        .from('events')
        .select('id')
        .eq('slug', slug)
        .single();

    // If no data found, the slug is unique
    if (error && error.code === 'PGRST116') {
        return true;
    }

    // If data exists, slug is not unique
    return !data;
}

/**
 * Generate a unique slug by trying multiple times if needed
 * nanoid has an extremely low collision rate (just 1 in a billion for 8 chars)
 * but we still check for uniqueness to be 100% safe
 */
export async function generateUniqueSlug(supabase: any): Promise<string> {
    let attempts = 0;
    const maxAttempts = 5; // Reduced since nanoid collisions are extremely rare

    while (attempts < maxAttempts) {
        const slug = generateEventSlug();
        const isUnique = await isSlugUnique(slug, supabase);

        if (isUnique) {
            return slug;
        }

        attempts++;
    }

    // Fallback: use longer nanoid if collisions somehow occur
    return nanoid(12);
}

/**
 * Check if an event is still accessible (within 5 days after event_date)
 * @param eventDate - The date of the event (Date string or Date object)
 * @returns true if the event is accessible, false if expired
 */
export function isEventAccessible(eventDate: string | Date | null | undefined): boolean {
    if (!eventDate) {
        return true; // If no date set, assume accessible
    }

    const event = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
    const today = new Date();
    
    // Reset time to midnight for date comparison only
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    // Calculate 5 days after event date
    const expiryDate = new Date(event);
    expiryDate.setDate(expiryDate.getDate() + 5);

    // Event is accessible if today is before or equal to expiry date
    return today <= expiryDate;
}
