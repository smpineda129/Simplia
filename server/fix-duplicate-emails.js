import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDuplicateEmails() {
  try {
    console.log('🔍 Buscando emails duplicados...');

    // Find duplicate emails (including soft-deleted users)
    const duplicates = await prisma.$queryRaw`
      SELECT email, COUNT(*) as count, ARRAY_AGG(id ORDER BY created_at ASC NULLS LAST) as user_ids
      FROM users
      GROUP BY email
      HAVING COUNT(*) > 1
    `;

    if (duplicates.length === 0) {
      console.log('✅ No se encontraron emails duplicados');
      return;
    }

    console.log(`⚠️  Se encontraron ${duplicates.length} emails duplicados`);

    for (const dup of duplicates) {
      const userIds = dup.user_ids;
      const keepUserId = userIds[0]; // Keep the oldest user
      const deleteUserIds = userIds.slice(1); // Delete the rest

      console.log(`\n📧 Email: ${dup.email}`);
      console.log(`   Total de usuarios: ${userIds.length}`);
      console.log(`   Manteniendo usuario ID: ${keepUserId}`);
      console.log(`   Modificando usuarios IDs: ${deleteUserIds.join(', ')}`);

      // Change email of duplicate users to avoid constraint
      for (const userId of deleteUserIds) {
        const timestamp = Date.now();
        await prisma.user.update({
          where: { id: userId },
          data: { 
            deletedAt: new Date(),
            email: `${dup.email}.dup${userId}.${timestamp}@deleted.local`
          }
        });
        console.log(`   ✓ Usuario ${userId} email modificado y marcado como eliminado`);
      }
    }

    console.log('\n✅ Emails duplicados corregidos exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

fixDuplicateEmails()
  .catch((e) => {
    console.error('❌ Error corrigiendo emails duplicados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
