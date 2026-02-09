import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAvatarColumn() {
  try {
    console.log('Verificando si la columna avatar existe...');
    
    // Intentar agregar la columna (si ya existe, no hará nada)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar VARCHAR(50);
    `);
    
    console.log('✅ Columna avatar agregada exitosamente (o ya existía)');
    console.log('✅ No se eliminó ningún dato de la base de datos');
    
  } catch (error) {
    console.error('❌ Error al agregar la columna:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addAvatarColumn()
  .then(() => {
    console.log('\n🎉 Migración completada con éxito');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en la migración:', error);
    process.exit(1);
  });
