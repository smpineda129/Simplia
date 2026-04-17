import htmlPdf from 'html-pdf-node';

/**
 * Genera un PDF desde contenido HTML
 * @param {string} html - Contenido HTML
 * @param {object} options - Opciones adicionales
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
export async function generatePdfFromHtml(html, options = {}) {
  const file = { content: html };
  
  const pdfOptions = {
    format: 'A4',
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
    printBackground: true,
    ...options,
  };

  try {
    const pdfBuffer = await htmlPdf.generatePdf(file, pdfOptions);
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    throw new Error('No se pudo generar el PDF: ' + error.message);
  }
}
