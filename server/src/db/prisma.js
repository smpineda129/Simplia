import { PrismaClient } from '@prisma/client';
import { createPrismaAudit } from '../middlewares/prismaAudit.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Register Audit Middleware
prisma.$use(createPrismaAudit(prisma));

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
