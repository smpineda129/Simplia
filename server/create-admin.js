import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔍 Verificando usuario administrador...');

    // Buscar si existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        email: 'superadmin@gdi.com'
      }
    });

    if (existingAdmin) {
      console.log('✅ Usuario Super Admin ya existe:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Nombre: ${existingAdmin.name}`);
      console.log(`   Rol: ${existingAdmin.role}`);
      console.log('\n🔑 Credenciales:');
      console.log('   Email: superadmin@gdi.com');
      console.log('   Password: password123');
      return;
    }

    // Crear nuevo admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await prisma.user.create({
      data: {
        name: 'Super Administrador',
        email: 'superadmin@gdi.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        companyId: null, // Acceso a todas las empresas
        phone: '+57 300 123 4567',
        locale: 'es',
        signature: 'Super Administrador\nSistema GDI\nAcceso Total',
      }
    });

    console.log('✅ Usuario Super Admin creado exitosamente!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nombre: ${admin.name}`);
    console.log(`   Rol: ${admin.role}`);
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Email: superadmin@gdi.com');
    console.log('   Password: password123');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

createAdmin()
  .catch((e) => {
    console.error('❌ Error creando administrador:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
