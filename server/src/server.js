import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB, prisma } from './db/prisma.js';
import { connectMongoDB, disconnectMongoDB } from './db/mongoose.js';

const cleanupOldEvents = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const result = await prisma.action_events.deleteMany({
      where: { created_at: { lt: oneMonthAgo } },
    });
    if (result.count > 0) {
      console.log(`🧹 Limpieza de eventos: ${result.count} registros eliminados (> 1 mes)`);
    }
  } catch (err) {
    console.error('⚠️ Error en limpieza de eventos:', err.message);
  }
};

// Serializar BigInt a String en JSON
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const startServer = async () => {
  try {
    // Conectar a las bases de datos
    await connectDB();
    await connectMongoDB();

    // Limpieza inicial + programar cada 24h
    await cleanupOldEvents();
    setInterval(cleanupOldEvents, 24 * 60 * 60 * 1000);

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
        await disconnectMongoDB();
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
