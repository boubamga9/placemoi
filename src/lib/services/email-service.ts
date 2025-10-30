import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

// Templates d'emails
import { ContactConfirmationEmail } from '$lib/emails/contact-confirmation';
import { ContactNotificationEmail } from '$lib/emails/contact-notification';

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
}
