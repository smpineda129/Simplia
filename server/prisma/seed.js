import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seedCompanies } from './seeds/companies.seed.js';
import { seedAreas } from './seeds/areas.seed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Seed companies first
  await seedCompanies();
  
  // Seed areas
  await seedAreas();

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

  // Crear items de inventario
  const inventoryItems = [
    {
      name: 'Laptop Dell XPS 15',
      quantity: 25,
      category: 'Electrónica',
      price: 1500.00,
    },
    {
      name: 'Mouse Logitech MX Master',
      quantity: 100,
      category: 'Accesorios',
      price: 99.99,
    },
    {
      name: 'Teclado Mecánico',
      quantity: 50,
      category: 'Accesorios',
      price: 150.00,
    },
    {
      name: 'Monitor LG 27"',
      quantity: 30,
      category: 'Electrónica',
      price: 350.00,
    },
    {
      name: 'Webcam Logitech C920',
      quantity: 45,
      category: 'Accesorios',
      price: 79.99,
    },
    {
      name: 'Auriculares Sony WH-1000XM4',
      quantity: 20,
      category: 'Audio',
      price: 349.99,
    },
    {
      name: 'Disco Duro Externo 2TB',
      quantity: 60,
      category: 'Almacenamiento',
      price: 89.99,
    },
    {
      name: 'SSD Samsung 1TB',
      quantity: 40,
      category: 'Almacenamiento',
      price: 120.00,
    },
    {
      name: 'Router WiFi 6',
      quantity: 15,
      category: 'Redes',
      price: 199.99,
    },
    {
      name: 'Impresora HP LaserJet',
      quantity: 8,
      category: 'Oficina',
      price: 299.99,
    },
  ];

  for (const item of inventoryItems) {
    const created = await prisma.inventoryItem.upsert({
      where: { 
        id: `seed-${item.name.toLowerCase().replace(/\s+/g, '-')}` 
      },
      update: {},
      create: {
        ...item,
        id: `seed-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
    });
    console.log('✅ Item creado:', created.name);
  }

  console.log('🎉 Seed completado exitosamente');
  console.log('\n📊 Resumen:');
  console.log(`   - ${await prisma.user.count()} usuarios`);
  console.log(`   - ${await prisma.inventoryItem.count()} items de inventario`);
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
