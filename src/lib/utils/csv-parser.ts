/**
 * Local CSV parser for simple guest list files
 * Attempts to extract guest information without AI when format is straightforward
 */

export interface ParsedGuest {
    guest_name: string;
    table_number: string;
    seat_number: string | null;
}

/**
 * Attempts to parse CSV content and extract guest information
 * Returns null if format is too complex (requires AI)
 * 
 * Expected formats:
 * - "Name,Table,Seat" (comma-separated)
 * - "Name;Table;Seat" (semicolon-separated, common in European CSVs)
 * - "Name,Table"
 * - "Nom,Table,Place"
 * - "Name | Table | Seat" (pipe-separated)
 * 
 * Supports both numeric table numbers and named tables (e.g., "Table VIP", "PAIX")
 */
export function tryParseCSV(csvContent: string): ParsedGuest[] | null {
    if (!csvContent || csvContent.trim().length === 0) {
        return null;
    }

    try {
        // Split by lines
        const lines = csvContent
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (lines.length === 0) {
            return null;
        }

        // Detect delimiter (comma, semicolon, or pipe)
        const firstLine = lines[0];
        const hasComma = firstLine.includes(',');
        const hasSemicolon = firstLine.includes(';');
        const hasPipe = firstLine.includes('|');
        
        if (!hasComma && !hasSemicolon && !hasPipe) {
            return null; // Unknown format, use AI
        }

        // Priority: semicolon > comma > pipe (semicolon is common in European CSVs)
        const delimiter = hasSemicolon ? ';' : (hasComma ? ',' : '|');
        
        // Parse header (if exists) or use first line
        const headerLine = lines[0].toLowerCase();
        const isHeader = headerLine.includes('nom') || 
                        headerLine.includes('name') || 
                        headerLine.includes('invité') ||
                        headerLine.includes('guest') ||
                        headerLine.includes('table') ||
                        headerLine.includes('place') ||
                        headerLine.includes('seat');

        const dataLines = isHeader ? lines.slice(1) : lines;
        
        if (dataLines.length === 0) {
            return null;
        }

        // Try to identify column positions
        let nameIndex = -1;
        let tableIndex = -1;
        let seatIndex = -1;

        if (isHeader) {
            const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
            
            // Find name column
            nameIndex = headers.findIndex(h => 
                h.includes('nom') || h.includes('name') || h.includes('invité') || h.includes('guest')
            );
            
            // Find table column (first one that contains 'table' but not 'seat' or 'place')
            tableIndex = headers.findIndex(h => 
                h.includes('table') && !h.includes('seat') && !h.includes('place')
            );
            
            // Find seat column
            seatIndex = headers.findIndex(h => 
                h.includes('place') || h.includes('seat') || h.includes('siège')
            );
        } else {
            // No header, assume standard order: name, table, seat (optional)
            nameIndex = 0;
            tableIndex = 1;
            seatIndex = 2; // Optional
        }

        // Validate we found at least name and table
        if (nameIndex === -1 || tableIndex === -1) {
            return null; // Can't identify columns, use AI
        }

        // Parse data lines
        const guests: ParsedGuest[] = [];
        
        for (const line of dataLines) {
            // Simple CSV parsing - split by delimiter
            // Note: This doesn't handle quoted values with commas, but works for most simple CSVs
            const columns = line.split(delimiter).map(col => col.trim().replace(/^["']|["']$/g, ''));
            
            // Skip if not enough columns
            if (columns.length <= Math.max(nameIndex, tableIndex)) {
                continue;
            }
            
            const name = columns[nameIndex]?.trim();
            const table = columns[tableIndex]?.trim();
            const seat = seatIndex !== -1 && seatIndex < columns.length ? columns[seatIndex]?.trim() || null : null;

            // Validate required fields - accept any non-empty table value (number or name)
            if (!name || name.length === 0) {
                continue; // Skip rows without name
            }
            
            // Accept any non-empty table value (can be number or table name)
            if (!table || table.length === 0) {
                continue; // Skip rows without table
            }

            // For table_number: keep as-is (can be number or table name like "Table VIP")
            // For seat_number: extract number if present, otherwise keep as-is
            const cleanSeatNumber = (value: string): string | null => {
                if (!value || value.trim().length === 0) return null;
                const trimmed = value.trim();
                // Extract number if present, otherwise return the string
                const match = trimmed.match(/\d+/);
                return match ? match[0] : trimmed;
            };

            guests.push({
                guest_name: name,
                table_number: table.trim(), // Keep table name as-is (supports both numbers and names)
                seat_number: seat ? cleanSeatNumber(seat) : null
            });
        }

        // Only return if we found at least 1 guest
        if (guests.length >= 1) {
            return guests;
        }

        return null; // No valid guests found, use AI
    } catch (error) {
        console.error('Error parsing CSV locally:', error);
        return null; // Fallback to AI
    }
}

/**
 * Checks if a file looks like a simple CSV that can be parsed locally
 */
export function isSimpleCSV(fileName: string, content: string): boolean {
    // Must be CSV or TXT
    const extension = fileName.toLowerCase().split('.').pop();
    if (extension !== 'csv' && extension !== 'txt') {
        return false;
    }

    // Must not be too large (simple CSVs are usually small)
    if (content.length > 50000) { // ~50KB
        return false;
    }

    // Must have reasonable line count
    const lineCount = content.split(/\r?\n/).length;
    if (lineCount > 1000) {
        return false; // Too large, might be complex
    }

    return true;
}
