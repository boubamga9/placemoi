/**
 * Utility functions for guest management
 */

/**
 * Handles duplicate guest names by appending numbers (1, 2, 3, etc.)
 * If a name already exists, it will be modified to "Name 1", "Name 2", etc.
 * 
 * @param guestName - The original guest name
 * @param existingGuestNames - Array of existing guest names in the event
 * @returns The modified guest name with number suffix if needed
 */
export function handleDuplicateGuestName(
    guestName: string,
    existingGuestNames: string[]
): string {
    const baseName = guestName.trim();

    // Find all guests that match the base name (exact match or base name + number)
    const matchingNames = existingGuestNames.filter(name => {
        // Exact match
        if (name === baseName) return true;
        // Match base name followed by space and number
        const match = name.match(/^(.+?)\s+(\d+)$/);
        if (match && match[1] === baseName) return true;
        return false;
    });

    if (matchingNames.length === 0) {
        // No duplicates, return original name
        return baseName;
    }

    // Extract numbers from matching names
    const numbers: number[] = [];

    matchingNames.forEach(name => {
        if (name === baseName) {
            numbers.push(0); // Base name counts as 0
        } else {
            const match = name.match(/^.+?\s+(\d+)$/);
            if (match && match[1]) {
                numbers.push(parseInt(match[1], 10));
            }
        }
    });

    // Find the next available number
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;

    return `${baseName} ${nextNumber}`;
}

/**
 * Processes an array of guests to handle duplicate names
 * Handles duplicates both against existing guests and within the batch being added
 * 
 * @param guestsToAdd - Array of guest objects to add
 * @param existingGuestNames - Array of existing guest names in the event
 * @returns Array of guests with duplicate names handled
 */
export function handleDuplicateGuestNames(
    guestsToAdd: Array<{ guest_name: string; [key: string]: any }>,
    existingGuestNames: string[]
): Array<{ guest_name: string; [key: string]: any }> {
    // Combine existing names and names we're processing in this batch
    const allNames = [...existingGuestNames];
    const processedGuests: Array<{ guest_name: string; [key: string]: any }> = [];

    for (const guest of guestsToAdd) {
        // Handle duplicate against all names (existing + already processed in this batch)
        const processedName = handleDuplicateGuestName(guest.guest_name, allNames);
        
        // Add this processed name to the list for next iterations
        allNames.push(processedName);
        
        processedGuests.push({
            ...guest,
            guest_name: processedName
        });
    }

    return processedGuests;
}

