export const errorHandler = (err, req, res, next) => {
  // No imprimir errores esperados durante los tests para mantener la consola limpia
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
