import { Resend } from 'resend';

let resendClient = null;

function getResendClient() {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[EmailService] RESEND_API_KEY not configured.');
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

const emailService = {
  /**
   * Send an email using Resend.
   * @param {Object} options
   * @param {string|string[]} options.to - Recipient(s)
   * @param {string} options.subject - Email subject
   * @param {string} [options.html] - HTML body
   * @param {string} [options.text] - Plain text body (fallback if no HTML)
   * @param {string|string[]} [options.cc] - CC recipients
   * @param {string|string[]} [options.bcc] - BCC recipients
   * @param {string} [options.replyTo] - Reply-to address
   */
  async send({ to, subject, html, text, cc, bcc, replyTo } = {}) {
    const client = getResendClient();
    if (!client) {
      console.warn('[EmailService] Resend not configured, skipping email send.');
      return null;
    }

    const fromName = process.env.MAIL_FROM_NAME || 'Simplia';
    const fromEmail = process.env.MAIL_FROM_EMAIL || 'onboarding@resend.dev';

    try {
      const emailData = {
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: html || text,
        ...(text && html && { text }),
        ...(cc && { cc: Array.isArray(cc) ? cc : [cc] }),
        ...(bcc && { bcc: Array.isArray(bcc) ? bcc : [bcc] }),
        ...(replyTo && { reply_to: replyTo }),
      };

      const data = await client.emails.send(emailData);
      console.log('[EmailService] Email sent successfully:', data.id);
      return data;
    } catch (err) {
      console.error('[EmailService] Error sending email:', err.message);
      return null;
    }
  },
};

export default emailService;
