import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './db/prisma.js';

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar servidor
    const server = app.listen(config.port, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${config.port}`);
      console.log(`📚 Documentación disponible en http://localhost:${config.port}/api-docs`);
      console.log(`🌍 Entorno: ${config.nodeEnv}`);
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);
      
      server.close(async () => {
        console.log('Servidor HTTP cerrado');
        await disconnectDB();
        console.log('Conexión a base de datos cerrada');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
