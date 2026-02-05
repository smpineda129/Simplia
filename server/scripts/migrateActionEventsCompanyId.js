import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting migration of company_id for action_events...');

  const batchSize = 100;
  let processed = 0;
  let updated = 0;

  while (true) {
    // Find events without company_id
    const events = await prisma.action_events.findMany({
      where: {
        companyId: null,
      },
      take: batchSize,
    });

    if (events.length === 0) {
      break;
    }

    console.log(`Processing batch of ${events.length} events...`);

    for (const event of events) {
      if (!event.user_id) {
        continue;
      }

      // Find the user to get their company_id
      const user = await prisma.user.findUnique({
        where: { id: event.user_id },
        select: { companyId: true },
      });

      if (user && user.companyId) {
        await prisma.action_events.update({
          where: { id: event.id },
          data: { companyId: user.companyId },
        });
        updated++;
      }
    }

    processed += events.length;
    console.log(`Progress: ${processed} events processed, ${updated} updated.`);
  }

  console.log('✅ Migration completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error migrating data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
