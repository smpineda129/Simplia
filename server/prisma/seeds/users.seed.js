import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Obtener empresas existentes
  const companies = await prisma.company.findMany({
    take: 3,
  });

  if (companies.length === 0) {
    console.log('⚠️  No hay empresas disponibles. Crea empresas primero.');
    return;
  }

  const users = [
    // SUPER ADMIN - Acceso a todas las empresas
    {
      name: 'Super Administrador',
      email: 'superadmin@gdi.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      companyId: null, // Sin empresa específica, acceso a todas
      phone: '+57 300 123 4567',
      locale: 'es',
      signature: 'Super Administrador\nSistema GDI\nAcceso Total',
    },

    // ADMIN - Empresa 1
    {
      name: 'Admin Empresa 1',
      email: 'admin1@empresa1.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: companies[0]?.id,
      phone: '+57 300 111 1111',
      locale: 'es',
      signature: `Administrador\n${companies[0]?.name || 'Empresa 1'}`,
    },

    // USUARIOS - Empresa 1
    {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa1.com',
      password: hashedPassword,
      role: 'USER',
      companyId: companies[0]?.id,
      phone: '+57 300 222 2222',
      locale: 'es',
      signature: 'Juan Pérez\nUsuario',
    },
    {
      name: 'María García',
      email: 'maria.garcia@empresa1.com',
      password: hashedPassword,
      role: 'USER',
      companyId: companies[0]?.id,
      phone: '+57 300 333 3333',
      locale: 'es',
      signature: 'María García\nUsuario',
    },

    // ADMIN - Empresa 2 (si existe)
    ...(companies[1] ? [{
      name: 'Admin Empresa 2',
      email: 'admin2@empresa2.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: companies[1].id,
      phone: '+57 300 444 4444',
      locale: 'es',
      signature: `Administrador\n${companies[1].name}`,
    }] : []),

    // USUARIOS - Empresa 2
    ...(companies[1] ? [
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa2.com',
        password: hashedPassword,
        role: 'USER',
        companyId: companies[1].id,
        phone: '+57 300 555 5555',
        locale: 'es',
        signature: 'Carlos Rodríguez\nUsuario',
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@empresa2.com',
        password: hashedPassword,
        role: 'USER',
        companyId: companies[1].id,
        phone: '+57 300 666 6666',
        locale: 'es',
        signature: 'Ana Martínez\nUsuario',
      },
    ] : []),

    // ADMIN - Empresa 3 (si existe)
    ...(companies[2] ? [{
      name: 'Admin Empresa 3',
      email: 'admin3@empresa3.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: companies[2].id,
      phone: '+57 300 777 7777',
      locale: 'es',
      signature: `Administrador\n${companies[2].name}`,
    }] : []),

    // USUARIOS - Empresa 3
    ...(companies[2] ? [
      {
        name: 'Luis Fernández',
        email: 'luis.fernandez@empresa3.com',
        password: hashedPassword,
        role: 'USER',
        companyId: companies[2].id,
        phone: '+57 300 888 8888',
        locale: 'es',
        signature: 'Luis Fernández\nUsuario',
      },
      {
        name: 'Laura Sánchez',
        email: 'laura.sanchez@empresa3.com',
        password: hashedPassword,
        role: 'USER',
        companyId: companies[2].id,
        phone: '+57 300 999 9999',
        locale: 'es',
        signature: 'Laura Sánchez\nUsuario',
      },
    ] : []),
  ];

  for (const userData of users) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⏭️  Usuario ${userData.email} ya existe, saltando...`);
        continue;
      }

      const user = await prisma.user.create({
        data: userData,
      });

      console.log(`✅ Usuario creado: ${user.name} (${user.email}) - Rol: ${user.role}`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
    }
  }

  console.log('✅ Seed de usuarios completado!');
}

seedUsers()
  .catch((e) => {
    console.error('❌ Error en seed de usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
