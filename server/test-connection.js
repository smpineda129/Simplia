import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...\n');
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    // Intentar conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa!\n');
    
    // Ejecutar una consulta simple
    const result = await prisma.$queryRaw`SELECT version() as version, current_database() as database, current_user as user`;
    console.log('📊 Información de la base de datos:');
    console.log(result[0]);
    
    // Listar todas las tablas
    console.log('\n📋 Verificando el esquema de Prisma...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log(`\n✅ Tablas encontradas (${tables.length}):`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    if (error.meta) {
      console.error('Meta:', error.meta);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Desconectado de la base de datos.');
  }
}

testConnection();
