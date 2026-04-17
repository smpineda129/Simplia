export const otpCodeEmailTemplate = ({
  userName = 'Usuario',
  otpCode,
  companyName = 'Simplia',
  logoUrl = '',
}) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Código de Acceso</title>
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

              <!-- Notification badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 28px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 20px; padding: 6px 16px;">
                    <p style="margin: 0; color: #4F46E5; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                      🔐&nbsp;&nbsp;Código de Acceso
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <h1 style="margin: 0 0 8px; color: #1E293B; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
                Tu código de acceso
              </h1>
              <p style="margin: 0 0 32px; color: #94A3B8; font-size: 13px; text-align: center;">
                Portal de Expedientes
              </p>

              <!-- Greeting -->
              <p style="margin: 0 0 12px; color: #334155; font-size: 15px; line-height: 1.6;">
                Hola <strong style="color: #1E293B;">${userName}</strong>,
              </p>
              <p style="margin: 0 0 28px; color: #334155; font-size: 15px; line-height: 1.7;">
                Has solicitado acceso al portal de expedientes. Utiliza el siguiente código para continuar:
              </p>

              <!-- OTP Code Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 12px; padding: 24px;">
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 8px; color: #4F46E5; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            Tu Código
                          </p>
                          <p style="margin: 0; color: #1E293B; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otpCode}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Expiration notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color: #FEF3C7; border-radius: 8px; border-left: 3px solid #F59E0B; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 6px; color: #92400E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                      ⏱️ Importante
                    </p>
                    <p style="margin: 0; color: #78350F; font-size: 14px; line-height: 1.6;">
                      Este código expira en <strong>10 minutos</strong>. Si no lo solicitaste, puedes ignorar este mensaje.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color: #EFF6FF; border-radius: 8px; border: 1px solid #BFDBFE;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <p style="margin: 0; color: #1E40AF; font-size: 13px; line-height: 1.6;">
                      🛡️ Por tu seguridad, nunca compartas este código con nadie. Nuestro equipo nunca te lo solicitará.
                    </p>
                  </td>
                </tr>
              </table>

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
