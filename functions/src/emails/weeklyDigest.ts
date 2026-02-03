import { generateUnsubscribeToken } from "./unsubscribeToken";
import { UNSUBSCRIBE_BASE_URL } from "../lib/resend";

interface WeeklyDigestData {
  userId: string;
  username: string;
  email: string;
  // Stats
  currentStreak: number;
  level: number;
  rank: string;
  totalXP: number;
  // Weekly activity
  journalEntriesThisWeek: number;
  habitsCompletedThisWeek: number;
  tasksCompletedThisWeek: number;
  xpEarnedThisWeek: number;
  // Achievements
  newAchievements: string[];
}

/**
 * Generate weekly digest email HTML
 */
export function generateWeeklyDigestEmail(data: WeeklyDigestData): {
  subject: string;
  html: string;
} {
  const unsubscribeToken = generateUnsubscribeToken(data.userId, "weeklyDigest");
  const unsubscribeUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsubscribeToken}`;
  const unsubscribeAllToken = generateUnsubscribeToken(data.userId, "all");
  const unsubscribeAllUrl = `${UNSUBSCRIBE_BASE_URL}?token=${unsubscribeAllToken}`;

  // Determine encouragement message based on activity
  let encouragement = "";
  if (data.currentStreak >= 7) {
    encouragement = `Amazing! You're on a ${data.currentStreak}-day streak. Keep the momentum going!`;
  } else if (data.journalEntriesThisWeek > 0) {
    encouragement = "Great work journaling this week! Every entry helps you grow.";
  } else {
    encouragement = "A new week is a fresh start. Ready to begin your journaling journey?";
  }

  const subject = data.currentStreak > 0
    ? `Your Week in Review: ${data.currentStreak}-Day Streak!`
    : "Your Weekly JournalXP Summary";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Digest</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">JournalXP</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Your Weekly Summary</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <h2 style="margin: 0; color: #1f2937; font-size: 22px;">Hey ${data.username}!</h2>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 15px; line-height: 1.5;">${encouragement}</p>
            </td>
          </tr>

          <!-- Stats Grid -->
          <tr>
            <td style="padding: 16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding: 8px;">
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Current Streak</p>
                      <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 28px; font-weight: 700;">${data.currentStreak}</p>
                      <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 12px;">days</p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 8px;">
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Level</p>
                      <p style="margin: 4px 0 0 0; color: #1f2937; font-size: 28px; font-weight: 700;">${data.level}</p>
                      <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 12px;">${data.rank}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Weekly Activity -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">This Week's Activity</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border-radius: 8px;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280;">Journal Entries</span>
                    <span style="float: right; color: #1f2937; font-weight: 600;">${data.journalEntriesThisWeek}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280;">Habits Completed</span>
                    <span style="float: right; color: #1f2937; font-weight: 600;">${data.habitsCompletedThisWeek}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280;">Tasks Completed</span>
                    <span style="float: right; color: #1f2937; font-weight: 600;">${data.tasksCompletedThisWeek}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px;">
                    <span style="color: #6b7280;">XP Earned</span>
                    <span style="float: right; color: #6366f1; font-weight: 600;">+${data.xpEarnedThisWeek} XP</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${data.newAchievements.length > 0 ? `
          <!-- Achievements -->
          <tr>
            <td style="padding: 16px 32px;">
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;">New Achievements Unlocked!</h3>
              ${data.newAchievements.map(achievement => `
                <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 16px; font-size: 13px; margin: 4px 4px 4px 0;">
                  🏆 ${achievement}
                </div>
              `).join('')}
            </td>
          </tr>
          ` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; text-align: center;">
              <a href="https://journalxp.app" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Continue Your Journey
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving this because you're subscribed to weekly digests.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe from digests</a>
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
