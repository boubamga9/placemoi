
import { z } from 'zod';

// Event type enum schema
export const eventTypeSchema = z.enum(['wedding', 'anniversary', 'baptism', 'other'], {
    errorMap: () => ({ message: 'Type d\'événement invalide' })
});

// Payment status schema
export const paymentStatusSchema = z.enum(['pending', 'succeeded', 'failed']);

// Create event schema
export const createEventSchema = z.object({
    event_name: z
        .string()
        .min(2, 'Le nom doit faire au moins 2 caractères')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .trim(),
    event_date: z
        .string()
        .min(1, 'La date est requise')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD attendu)'),
    event_type: eventTypeSchema
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Update event schema
export const updateEventSchema = z.object({
    event_name: z
        .string()
        .min(2, 'Le nom doit faire au moins 2 caractères')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .trim()
        .optional(),
    event_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD attendu)')
        .optional(),
    event_type: eventTypeSchema.optional()
});

// Guest schema
export const guestSchema = z.object({
    guest_name: z
        .string()
        .min(1, 'Le nom est requis')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .trim(),
    table_number: z
        .string()
        .min(1, 'Le numéro de table est requis')
        .max(20, 'Le numéro de table ne peut pas dépasser 20 caractères')
        .trim(),
    seat_number: z
        .string()
        .max(20, 'Le numéro de place ne peut pas dépasser 20 caractères')
        .trim()
        .optional()
});

// Import guests schema
export const importGuestsSchema = z.object({
    guests: z.array(guestSchema).min(1, 'Au moins un invité est requis').max(500, 'Maximum 500 invités')
});

// Search guest schema
export const searchGuestSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit faire au moins 2 caractères')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères')
        .trim()
});

// Event customization schema
export const eventCustomizationSchema = z.object({
    background_image: z.instanceof(File).optional(),
    background_image_url: z.string().optional(),
    background_color: z
        .union([
            z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide (format: #RRGGBB)'),
            z.literal('')
        ])
        .optional()
        .transform((val) => val === '' ? undefined : val),
    font_color: z
        .union([
            z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide (format: #RRGGBB)'),
            z.literal('')
        ])
        .optional()
        .transform((val) => val === '' ? undefined : val),
    font_family: z.string().max(100).optional(),
    logo: z.instanceof(File).optional(),
    logo_url: z.string().optional(),
    welcome_text: z.string().max(100).nullable().optional(),
    subtitle_text: z.string().max(150).nullable().optional()
});

// Create payment session schema
export const createPaymentSessionSchema = z.object({
    event_id: z.string().uuid('ID d\'événement invalide')
});

// Payment webhook schema
export const paymentWebhookSchema = z.object({
    event_id: z.string().uuid(),
    stripe_payment_intent_id: z.string().min(1),
    stripe_session_id: z.string().optional(),
    amount: z.number().positive('Le montant doit être positif'),
    currency: z.string().default('eur'),
    status: paymentStatusSchema
});
