import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de producción...');

  // Limpiar datos existentes (solo en desarrollo)
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Limpiando datos existentes...');
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
  }

  // Verificar si ya existen datos
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('ℹ️  Los datos ya existen. Saltando seed...');
    console.log('✅ Seed completado (sin cambios)');
    return;
  }

  // Crear empresas
  console.log('📦 Creando empresas...');
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'Empresa Demo 1',
        identifier: 'ED1-2024',
        short: 'ED1',
        email: 'contacto@empresa1.com',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Empresa Demo 2',
        identifier: 'ED2-2024',
        short: 'ED2',
        email: 'contacto@empresa2.com',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Empresa Demo 3',
        identifier: 'ED3-2024',
        short: 'ED3',
        email: 'contacto@empresa3.com',
      },
    }),
  ]);

  console.log(`✅ ${companies.length} empresas creadas`);

  // Crear usuarios
  console.log('👥 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    // Super Admin
    {
      name: 'Super Administrador',
      email: 'superadmin@gdi.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      companyId: null,
      phone: '+57 300 123 4567',
      locale: 'es',
      signature: 'Super Administrador\nSistema GDI\nAcceso Total',
    },
    // Admins
    {
      name: 'Admin Empresa 1',
      email: 'admin1@empresa1.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: companies[0].id,
      phone: '+57 300 111 1111',
      locale: 'es',
      signature: `Administrador\n${companies[0].name}`,
    },
    {
      name: 'Admin Empresa 2',
      email: 'admin2@empresa2.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: companies[1].id,
      phone: '+57 300 444 4444',
      locale: 'es',
      signature: `Administrador\n${companies[1].name}`,
    },
    {
      name: 'Admin Empresa 3',
      email: 'admin3@empresa3.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: companies[2].id,
      phone: '+57 300 777 7777',
      locale: 'es',
      signature: `Administrador\n${companies[2].name}`,
    },
    // Usuarios regulares
    {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa1.com',
      password: hashedPassword,
      role: 'USER',
      companyId: companies[0].id,
      phone: '+57 300 222 2222',
      locale: 'es',
      signature: 'Juan Pérez\nUsuario',
    },
    {
      name: 'María García',
      email: 'maria.garcia@empresa1.com',
      password: hashedPassword,
      role: 'USER',
      companyId: companies[0].id,
      phone: '+57 300 333 3333',
      locale: 'es',
      signature: 'María García\nUsuario',
    },
  ];

  for (const userData of users) {
    await prisma.user.create({ data: userData });
  }

  console.log(`✅ ${users.length} usuarios creados`);
  console.log('✅ Seed de producción completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
