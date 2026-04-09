export const correspondenceResponseEmailTemplate = ({
  recipientName = '',
  correspondenceTitle,
  inSettled,
  outSettled,
  message,
  responderName = '',
  responderSignature = '',
  companyName = 'Simplia',
  logoUrl = '',
  hasAttachment = false,
  attachmentName = '',
}) => {
  const date = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Respuesta a Correspondencia</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 580px;">

          <!-- Gradient accent strip -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #2563EB 0%, #6366F1 100%); border-radius: 12px 12px 0 0; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Logo header -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 28px 40px 24px; text-align: center; border-bottom: 1px solid #E2E8F0;">
              ${logoUrl
                ? `<img src="${logoUrl}" alt="${companyName}" width="160" style="display: block; margin: 0 auto; max-height: 44px; width: auto;" />`
                : `<span style="font-size: 20px; font-weight: 700; color: #2563EB; letter-spacing: -0.3px;">${companyName}</span>`
              }
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 36px 40px 32px;">

              <!-- Badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 28px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-radius: 20px; padding: 6px 16px;">
                    <p style="margin: 0; color: #059669; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                      &#9993;&nbsp;&nbsp;Respuesta a su Correspondencia
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Title + date -->
              <h1 style="margin: 0 0 8px; color: #1E293B; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
                ${correspondenceTitle}
              </h1>
              <p style="margin: 0 0 32px; color: #94A3B8; font-size: 13px; text-align: center;">
                ${date}
              </p>

              <!-- Greeting -->
              ${recipientName ? `<p style="margin: 0 0 12px; color: #334155; font-size: 15px; line-height: 1.6;">Estimado/a <strong style="color: #1E293B;">${recipientName}</strong>,</p>` : ''}

              <!-- Message body -->
              <div style="margin: 0 0 28px; color: #334155; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">
                ${message.replace(/\n/g, '<br>')}
              </div>

              <!-- Radicado info card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color: #F8FAFC; border-radius: 10px; border-left: 4px solid #2563EB; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <p style="margin: 0; color: #64748B; font-size: 13px;">
                            <strong style="color: #475569;">Radicado de entrada:</strong>&nbsp;&nbsp;
                            <span style="background-color: #DBEAFE; color: #1D4ED8; padding: 2px 9px; border-radius: 4px; font-weight: 600; font-size: 12px;">${inSettled || '—'}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0; color: #64748B; font-size: 13px;">
                            <strong style="color: #475569;">Radicado de salida:</strong>&nbsp;&nbsp;
                            <span style="background-color: #DCFCE7; color: #166534; padding: 2px 9px; border-radius: 4px; font-weight: 600; font-size: 12px;">${outSettled || '—'}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${hasAttachment ? `
              <!-- Attachment notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color: #FFF7ED; border-radius: 8px; border: 1px solid #FED7AA; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <p style="margin: 0; color: #9A3412; font-size: 13px; line-height: 1.6;">
                      &#128206;&nbsp;<strong>Documento adjunto:</strong>&nbsp;${attachmentName}
                    </p>
                  </td>
                </tr>
              </table>` : ''}

              ${responderSignature
                ? `<div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                    <img src="${responderSignature}" alt="Firma" style="max-height: 80px; max-width: 200px;" />
                  </div>`
                : responderName
                  ? `<p style="margin: 24px 0 0; padding-top: 20px; border-top: 1px solid #E2E8F0; color: #475569; font-size: 14px; font-weight: 600;">${responderName}</p>`
                  : ''
              }

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; border-top: 1px solid #E2E8F0; padding: 20px 40px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 4px; color: #94A3B8; font-size: 12px;">
                Correo automático — no respondas a este mensaje.
              </p>
              <p style="margin: 0; color: #CBD5E1; font-size: 11px;">
                &copy; ${new Date().getFullYear()} ${companyName} &middot; Sistema de Gestión Documental
              </p>
            </td>
          </tr>

          <!-- Bottom accent -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563EB 0%, #6366F1 100%); border-radius: 0 0 12px 12px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};
