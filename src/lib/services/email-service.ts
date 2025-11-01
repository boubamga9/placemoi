import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

// Templates d'emails
import { ContactConfirmationEmail } from '$lib/emails/contact-confirmation';
import { ContactNotificationEmail } from '$lib/emails/contact-notification';
import { PaymentConfirmationEmail } from '$lib/emails/payment-confirmation';
import {
    generateQRCodePNG,
    generateQRCodePNGBuffer,
    generateQRCodeSVGString
} from '$lib/utils/qr-code-generator';

// Initialisation de Resend
const resend = new Resend(env.RESEND_API_KEY);

export class EmailService {
    /**
     * Envoie une confirmation de contact au client
     */
    static async sendContactConfirmation({
        customerName,
        customerEmail,
        message,
        subject
    }: {
        customerEmail: string;
        customerName: string;
        message: string;
        subject: string;
    }) {
        try {
            const { data, error } = await resend.emails.send({
                from: 'PLACEMOI <noreply@placemoi.com>',
                to: customerEmail,
                subject: `PLACEMOI - Message reçu`,
                html: ContactConfirmationEmail({
                    name: customerName,
                    subject,
                    message,
                })
            });

            if (error) {
                console.error('Erreur envoi confirmation contact:', error);
                throw error;
            }

            return { success: true, messageId: data?.id };
        } catch (error) {
            console.error('Erreur EmailService.sendContactConfirmation:', error);
            throw error;
        }
    }

    /**
     * Envoie une notification de contact à PLACEMOI
     */
    static async sendContactNotification({
        customerName,
        customerEmail,
        subject,
        message,
        date,
    }: {
        customerName: string;
        customerEmail: string;
        subject: string;
        message: string;
        date: string;
    }) {
        try {
            const { data, error } = await resend.emails.send({
                from: 'PLACEMOI <noreply@placemoi.com>',
                to: "contact@placemoi.com",
                subject: `Nouveau message - ${customerEmail}`,
                html: ContactNotificationEmail({
                    name: customerName,
                    email: customerEmail,
                    subject,
                    message,
                    date,
                })
            });

            if (error) {
                console.error('Erreur envoi notification contact:', error);
                throw error;
            }

            return { success: true, messageId: data?.id };
        } catch (error) {
            console.error('Erreur EmailService.sendContactNotification:', error);
            throw error;
        }
    }

    /**
     * Envoie une confirmation de paiement avec les détails de l'événement et les QR codes
     */
    static async sendPaymentConfirmation({
        customerEmail,
        eventName,
        eventDate,
        amount,
        currency,
        slug
    }: {
        customerEmail: string;
        eventName: string;
        eventDate: string;
        amount: number;
        currency: string;
        slug: string;
    }) {
        try {
            // Generate QR codes in parallel (both for inline display and attachments)
            // Note: We generate SVG once then convert it to both base64 and Buffer
            const [qrCodePngBase64, qrCodeSvgString, qrCodePngBuffer] = await Promise.all([
                generateQRCodePNG(slug),
                generateQRCodeSVGString(slug),
                generateQRCodePNGBuffer(slug)
            ]);

            // Convert SVG string to base64 for inline display
            const qrCodeSvgBase64 = Buffer.from(qrCodeSvgString).toString('base64');
            // Convert SVG string to Buffer for attachment
            const qrCodeSvgBuffer = Buffer.from(qrCodeSvgString);

            // Send email with attachments
            const { data, error } = await resend.emails.send({
                from: 'PLACEMOI <noreply@placemoi.com>',
                to: customerEmail,
                subject: `PLACEMOI - Confirmation de paiement : ${eventName}`,
                html: PaymentConfirmationEmail({
                    eventName,
                    eventDate,
                    amount,
                    currency,
                    slug,
                    qrCodePngBase64,
                    qrCodeSvgBase64
                }),
                attachments: [
                    {
                        filename: `qr-code-${slug}.png`,
                        content: qrCodePngBuffer
                    },
                    {
                        filename: `qr-code-${slug}.svg`,
                        content: qrCodeSvgBuffer
                    }
                ]
            });

            if (error) {
                console.error('Erreur envoi confirmation paiement:', error);
                throw error;
            }

            return { success: true, messageId: data?.id };
        } catch (error) {
            console.error('Erreur EmailService.sendPaymentConfirmation:', error);
            throw error;
        }
    }
}
