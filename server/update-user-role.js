import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    const userId = 1212;
    const newRole = 'owner';

    console.log(`🔍 Buscando usuario con ID ${userId}...`);

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) }
    });

    if (!user) {
      console.log(`❌ No se encontró usuario con ID ${userId}`);
      return;
    }

    console.log('📋 Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rol actual: ${user.role || 'sin rol'}`);

    console.log(`\n🔄 Actualizando rol a "${newRole}"...`);

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { role: newRole }
    });

    console.log('✅ Rol actualizado exitosamente!');
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Nombre: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Rol nuevo: ${updatedUser.role}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

updateUserRole()
  .catch((e) => {
    console.error('❌ Error actualizando rol:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
