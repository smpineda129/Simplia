import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const email = 'vanessatb0119@gmail.com';
    const newPassword = 'password123';

    console.log(`🔍 Buscando usuario: ${email}...`);

    const user = await prisma.user.findFirst({
      where: { 
        email: email,
        deletedAt: null
      }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Rol: ${user.role}`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('\n✅ Contraseña actualizada exitosamente!');
    console.log('\n🔑 Nuevas credenciales:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

resetPassword()
  .catch((e) => {
    console.error('❌ Error reseteando contraseña:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
