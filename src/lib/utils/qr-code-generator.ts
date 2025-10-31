import QRCode from 'qrcode';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { QRCodeOptions } from './qr-code-config';
import { mergeQROptions } from './qr-code-config';

/**
 * Generate QR code URL for an event slug
 */
export function getQRCodeUrl(slug: string): string {
    return `${PUBLIC_SITE_URL}/${slug}`;
}

/**
 * Generate QR code as PNG and return as base64 string
 */
export async function generateQRCodePNG(
    slug: string,
    options: QRCodeOptions = {}
): Promise<string> {
    const url = getQRCodeUrl(slug);
    const opts = mergeQROptions(options);

    try {
        // Generate high resolution PNG (4x for better quality)
        const dataUrl = await QRCode.toDataURL(url, {
            width: opts.width * 4,
            margin: opts.margin,
            errorCorrectionLevel: opts.errorCorrectionLevel,
            color: opts.color
        });

        // Extract base64 from data URL (remove data:image/png;base64, prefix)
        const base64 = dataUrl.split(',')[1];
        return base64;
    } catch (error) {
        console.error('Error generating QR code PNG:', error);
        throw error;
    }
}

/**
 * Generate QR code as SVG and return as base64 string
 */
export async function generateQRCodeSVG(
    slug: string,
    options: QRCodeOptions = {}
): Promise<string> {
    const url = getQRCodeUrl(slug);
    const opts = mergeQROptions(options);

    try {
        // Generate SVG string
        const svgString = await QRCode.toString(url, {
            type: 'svg',
            width: opts.width,
            margin: opts.margin,
            errorCorrectionLevel: opts.errorCorrectionLevel,
            color: opts.color
        });

        // Convert SVG string to base64
        const base64 = Buffer.from(svgString).toString('base64');
        return base64;
    } catch (error) {
        console.error('Error generating QR code SVG:', error);
        throw error;
    }
}

/**
 * Generate QR code as Buffer (for attachments)
 */
export async function generateQRCodePNGBuffer(
    slug: string,
    options: QRCodeOptions = {}
): Promise<Buffer> {
    const url = getQRCodeUrl(slug);
    const opts = mergeQROptions(options);

    try {
        const buffer = await QRCode.toBuffer(url, {
            width: opts.width * 4,
            margin: opts.margin,
            errorCorrectionLevel: opts.errorCorrectionLevel,
            color: opts.color,
            type: 'png'
        });

        return buffer;
    } catch (error) {
        console.error('Error generating QR code PNG buffer:', error);
        throw error;
    }
}

/**
 * Generate QR code as SVG string (for attachments)
 */
export async function generateQRCodeSVGString(
    slug: string,
    options: QRCodeOptions = {}
): Promise<string> {
    const url = getQRCodeUrl(slug);
    const opts = mergeQROptions(options);

    try {
        const svgString = await QRCode.toString(url, {
            type: 'svg',
            width: opts.width,
            margin: opts.margin,
            errorCorrectionLevel: opts.errorCorrectionLevel,
            color: opts.color
        });

        return svgString;
    } catch (error) {
        console.error('Error generating QR code SVG string:', error);
        throw error;
    }
}

