/**
 * Shared QR code configuration
 * Centralized default options for both client and server-side QR code generation
 */

export interface QRCodeOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    color?: {
        dark: string;
        light: string;
    };
}

/**
 * Default QR code options used across the application
 */
export const QR_CODE_DEFAULTS: Required<QRCodeOptions> = {
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
        dark: '#2C3E50',
        light: '#FFFFFF'
    }
};

/**
 * Merge user options with defaults
 */
export function mergeQROptions(options: QRCodeOptions = {}): Required<QRCodeOptions> {
    return {
        width: options.width ?? QR_CODE_DEFAULTS.width,
        margin: options.margin ?? QR_CODE_DEFAULTS.margin,
        errorCorrectionLevel: options.errorCorrectionLevel ?? QR_CODE_DEFAULTS.errorCorrectionLevel,
        color: {
            dark: options.color?.dark ?? QR_CODE_DEFAULTS.color.dark,
            light: options.color?.light ?? QR_CODE_DEFAULTS.color.light
        }
    };
}

