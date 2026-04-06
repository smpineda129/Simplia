export const setPasswordEmailTemplate = ({
  userName,
  setPasswordUrl,
  companyName = 'Simplia',
  logoUrl = '',
  expiresInHours = 48,
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
  <title>Establece tu contraseña</title>
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
                      &#128274;&nbsp;&nbsp;Configura tu acceso
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Title + date -->
              <h1 style="margin: 0 0 8px; color: #1E293B; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
                Bienvenido/a a ${companyName}
              </h1>
              <p style="margin: 0 0 32px; color: #94A3B8; font-size: 13px; text-align: center;">
                ${date}
              </p>

              <!-- Greeting -->
              <p style="margin: 0 0 12px; color: #334155; font-size: 15px; line-height: 1.6;">
                Hola <strong style="color: #1E293B;">${userName}</strong>,
              </p>
              <p style="margin: 0 0 28px; color: #334155; font-size: 15px; line-height: 1.7;">
                Tu cuenta ha sido creada en el Sistema de Gestión Documental de <strong>${companyName}</strong>. Para activar tu acceso, haz clic en el botón de abajo y establece tu contraseña personal.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 28px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #2563EB 0%, #6366F1 100%);">
                    <a href="${setPasswordUrl}"
                       style="display: block; padding: 14px 44px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; white-space: nowrap; letter-spacing: 0.2px;">
                      Establecer mi contraseña &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color: #FFF7ED; border-radius: 8px; border: 1px solid #FED7AA; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <p style="margin: 0; color: #9A3412; font-size: 13px; line-height: 1.6;">
                      <strong>&#9888; Enlace temporal:</strong> Este enlace es válido por <strong>${expiresInHours} horas</strong>. Si no lo usas a tiempo, pide al administrador que envíe un nuevo enlace.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback URL -->
              <p style="margin: 0; color: #94A3B8; font-size: 12px; line-height: 1.6; text-align: center;">
                ¿El botón no funciona? Copia y pega este enlace en tu navegador:<br/>
                <span style="color: #2563EB; word-break: break-all;">${setPasswordUrl}</span>
              </p>

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
