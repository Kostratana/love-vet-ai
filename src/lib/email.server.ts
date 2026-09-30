/**
 * Booking confirmation email — integration point (Resend).
 * Disabled until a verified sending domain is supplied. Booking never depends on this.
 */
export const EMAIL_ENABLED = false;

export async function sendBookingConfirmation(_to: string, _details: { when: string; type: string; pet?: string }) {
  if (!EMAIL_ENABLED) return { sent: false as const, reason: "Email sending is not configured yet." };
  // Enable once RESEND_API_KEY and a verified sending domain exist.
  return { sent: false as const, reason: "Not implemented." };
}
