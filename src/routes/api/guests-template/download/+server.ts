import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as XLSX from 'xlsx';

/**
 * Generates and downloads an Excel template file for guest list uploads
 */
export const GET: RequestHandler = async () => {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Sample data with headers
    const data = [
        ['Nom', 'Table', 'Place'], // Headers
        ['Jean Dupont', '1', '1'], // Example row 1
        ['Marie Martin', '1', '2'], // Example row 2
        ['Pierre Durand', '2', '1'], // Example row 3
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths for better readability
    worksheet['!cols'] = [
        { wch: 20 }, // Nom
        { wch: 10 }, // Table
        { wch: 10 }, // Place
    ];
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invités');
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: 'xlsx',
        cellStyles: true
    });
    
    // Return as downloadable file
    return new Response(excelBuffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="modele-invites.xlsx"',
        },
    });
};

