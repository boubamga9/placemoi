import { PUBLIC_SITE_URL } from '$env/static/public';

interface PaymentConfirmationProps {
    eventName: string;
    eventDate: string;
    amount: number;
    currency: string;
    slug: string;
}

export function PaymentConfirmationEmail({
    eventName,
    eventDate,
    amount,
    currency,
    slug
}: PaymentConfirmationProps) {
    const formattedDate = new Date(eventDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency.toUpperCase()
    }).format(amount);

    const eventUrl = `${PUBLIC_SITE_URL}/${slug}`;

    return `
        <div style="font-family: Arial, sans-serif; color: #2C3E50; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF9F4;">
            
            <!-- Logo PLACEMOI -->
            <div style="text-align: center; margin-bottom: 30px;">
                <img
                    src="${PUBLIC_SITE_URL}/images/logo_text.svg"
                    alt="PLACEMOI"
                    style="height: 40px; margin-bottom: 10px;"
                />
                <div style="height: 1px; background-color: #E5E5E5; margin: 20px 0;"></div>
            </div>

            <!-- Main Content -->
            <div style="margin-bottom: 24px;">
                <h2 style="color: #D4A574; margin-top: 0; font-size: 20px; font-weight: normal; font-family: 'Playfair Display', 'Georgia', serif;">
                    ✅ Paiement confirmé
                </h2>
                
                <p style="line-height: 1.6; color: #2C3E50;">Bonjour,</p>
                
                <p style="line-height: 1.6; color: #2C3E50;">
                    Votre paiement a été confirmé avec succès ! Votre événement est maintenant actif et vous pouvez partager votre QR code et votre lien avec vos invités.
                </p>
            </div>

            <!-- Payment Details Box -->
            <div style="margin: 24px 0; padding: 20px; background-color: #F5E6D3; border-radius: 8px; border: 1px solid #E5E5E5;">
                <h3 style="margin-top: 0; margin-bottom: 16px; color: #2C3E50; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    📋 Récapitulatif de votre événement
                </h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #E5E5E5;">
                        <td style="padding: 8px 0; color: #2C3E50; font-weight: 600;">Événement :</td>
                        <td style="padding: 8px 0; color: #2C3E50; text-align: right;">${eventName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #E5E5E5;">
                        <td style="padding: 8px 0; color: #2C3E50; font-weight: 600;">Date :</td>
                        <td style="padding: 8px 0; color: #2C3E50; text-align: right;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #2C3E50; font-weight: 600;">Montant :</td>
                        <td style="padding: 8px 0; color: #D4A574; font-weight: bold; text-align: right; font-size: 18px;">${formattedAmount}</td>
                    </tr>
                </table>
            </div>

            <!-- Next Steps -->
            <div style="margin: 24px 0; padding: 20px; background-color: #FFFFFF; border-radius: 8px; border-left: 4px solid #D4A574;">
                <h3 style="margin-top: 0; margin-bottom: 12px; color: #2C3E50; font-size: 16px; font-weight: 600;">
                    🎯 Prochaines étapes
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #2C3E50; line-height: 1.8;">
                    <li>Imprimez et affichez le QR code à l'entrée de votre événement (disponible en pièces jointes)</li>
                    <li>Vos invités pourront scanner le QR code ou suivre le lien <a href="${eventUrl}" style="color: #D4A574; text-decoration: none;">${eventUrl}</a> pour trouver leur place</li>
                </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E5E5;">
                <p style="color: #999; font-size: 12px; line-height: 1.5; margin: 0;">
                    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 8px; margin-bottom: 0;">
                    <a href="${PUBLIC_SITE_URL}" style="color: #D4A574; text-decoration: none;">PLACEMOI</a> - Organisez le placement de vos invités en toute simplicité
                </p>
            </div>
        </div>
    `;
}

