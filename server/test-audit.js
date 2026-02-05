
import { prisma } from './src/db/prisma.js';
import { context } from './src/utils/context.js';

async function testAudit() {
    const user = await prisma.user.findFirst();
    const proceeding = await prisma.Proceeding.findFirst();

    if (!user || !proceeding) {
        console.log('User or Proceeding not found in DB');
        return;
    }

    console.log('Initial count:', await prisma.action_events.count());

    await context.run(new Map([['user', user], ['ip', '127.0.0.1']]), async () => {
        console.log('Executing findUnique on Proceeding...');
        await prisma.Proceeding.findUnique({
            where: { id: proceeding.id }
        });
    });

    // Small delay for fire-and-forget
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Final count:', await prisma.action_events.count());
}

testAudit().catch(console.error);
