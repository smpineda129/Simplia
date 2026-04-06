export const proceedingSharedEmailTemplate = ({ 
  userName, 
  proceedingName, 
  proceedingCode, 
  proceedingUrl,
  companyName = 'Simplia'
}) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expediente Compartido</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ${companyName}
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                Sistema de Gestión Documental
              </p>
            </td>
          </tr>

          <!-- Icon Section -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="white"/>
                </svg>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center;">
                Expediente Compartido
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hola <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Se te ha concedido acceso al siguiente expediente:
              </p>

              <!-- Proceeding Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #1976d2; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Expediente
                    </p>
                    <p style="margin: 0 0 12px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                      ${proceedingName}
                    </p>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      <strong>Código:</strong> ${proceedingCode}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Ahora puedes acceder a toda la información, documentos y detalles relacionados con este expediente.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${proceedingUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);">
                      Ver Expediente
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e3f2fd; border-radius: 6px; margin-top: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #1565c0; font-size: 14px; line-height: 1.5;">
                      <strong>💡 Nota:</strong> Este acceso te permite visualizar toda la información del expediente. Si tienes alguna pregunta, contacta con el administrador del sistema.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
