import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seedCompanies } from './seeds/companies.seed.js';
import { seedAreas } from './seeds/areas.seed.js';
import { seedRoles } from './seeds/roles.seed.js';
import { seedPermissions } from './seeds/permissions.seed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Seed companies first
  await seedCompanies();

  // Seed areas
  await seedAreas();

  // Seed roles
  await seedRoles();

  // Seed permissions
  await seedPermissions();

  // Crear usuarios
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gdi.com' },
    update: {},
    create: {
      email: 'admin@gdi.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✅ Usuario administrador creado:', admin.email);

  // Asignar rol Owner al administrador
  const ownerRole = await prisma.role.findFirst({
    where: { name: 'Owner', guardName: 'web' }
  });

  if (ownerRole) {
    const hasRole = await prisma.modelHasRole.findUnique({
      where: {
        roleId_modelId_modelType: {
          roleId: ownerRole.id,
          modelId: admin.id,
          modelType: 'App\\Models\\User'
        }
      }
    });

    if (!hasRole) {
      await prisma.modelHasRole.create({
        data: {
          roleId: ownerRole.id,
          modelId: admin.id,
          modelType: 'App\\Models\\User'
        }
      });
      console.log('👑 Rol Owner asignado al administrador.');
    }
  }

  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@gdi.com' },
    update: {},
    create: {
      email: 'user@gdi.com',
      password: userPassword,
      name: 'Usuario de Prueba',
      role: 'USER',
    },
  });
  console.log('✅ Usuario de prueba creado:', user.email);

  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@gdi.com' },
    update: {},
    create: {
      email: 'manager@gdi.com',
      password: managerPassword,
      name: 'Gerente',
      role: 'MANAGER',
    },
  });
  console.log('✅ Usuario gerente creado:', manager.email);

  console.log('🎉 Seed completado exitosamente');
  console.log('\n📊 Resumen:');
  console.log(`   - ${await prisma.user.count()} usuarios`);
  console.log('\n🔑 Credenciales de acceso:');
  console.log('   Admin: admin@gdi.com / admin123');
  console.log('   Manager: manager@gdi.com / manager123');
  console.log('   User: user@gdi.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
