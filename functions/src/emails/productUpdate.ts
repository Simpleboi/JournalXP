import { generateUnsubscribeToken } from "./unsubscribeToken";
import { UNSUBSCRIBE_BASE_URL } from "../lib/resend";

interface ProductUpdateData {
  userId: string;
  username: string;
  email: string;
  // Update content
  title: string;
  preheader?: string; // Preview text shown in email clients
  heroImageUrl?: string;
  sections: {
    heading: string;
    body: string; // Can include basic HTML
    ctaText?: string;
    ctaUrl?: string;
  }[];
}

/**
 * Generate product update email HTML
 */
export function generateProductUpdateEmail(data: ProductUpdateData): {
  subject: string;
  html: string;
} {
  const unsubscribeToken = generateUnsubscribeToken(data.userId, "productUpdates");
  const unsubscribeUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsubscribeToken}`;
  const unsubscribeAllToken = generateUnsubscribeToken(data.userId, "all");
  const unsubscribeAllUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsubscribeAllToken}`;

  const subject = data.title;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  ${data.preheader ? `<span style="display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">${data.preheader}</span>` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">JournalXP</h1>
            </td>
          </tr>

          ${data.heroImageUrl ? `
          <!-- Hero Image -->
          <tr>
            <td>
              <img src="${data.heroImageUrl}" alt="" style="width: 100%; height: auto; display: block;">
            </td>
          </tr>
          ` : ''}

          <!-- Title -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700; line-height: 1.3;">${data.title}</h2>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <p style="margin: 0; color: #6b7280; font-size: 15px;">Hey ${data.username},</p>
            </td>
          </tr>

          <!-- Content Sections -->
          ${data.sections.map(section => `
          <tr>
            <td style="padding: 0 32px 24px 32px;">
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px; font-weight: 600;">${section.heading}</h3>
              <div style="color: #4b5563; font-size: 15px; line-height: 1.6;">
                ${section.body}
              </div>
              ${section.ctaText && section.ctaUrl ? `
              <div style="margin-top: 16px;">
                <a href="${section.ctaUrl}" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; font-size: 14px;">
                  ${section.ctaText}
                </a>
              </div>
              ` : ''}
            </td>
          </tr>
          `).join('')}

          <!-- Main CTA -->
          <tr>
            <td style="padding: 8px 32px 32px 32px; text-align: center;">
              <a href="https://journalxp.app" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Open JournalXP
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving this because you're subscribed to product updates.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe from updates</a>
                &nbsp;•&nbsp;
                <a href="${unsubscribeAllUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe from all</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #d1d5db; font-size: 11px;">
                JournalXP • Made with care for your mental wellness
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}
