
import { prisma } from './src/db/prisma.js';
import { context } from './src/utils/context.js';

async function testAuditLowercase() {
    const user = await prisma.user.findFirst();
    const proceeding = await prisma.proceeding.findFirst();

    if (!user || !proceeding) {
        console.log('User or Proceeding not found in DB');
        return;
    }

    await context.run(new Map([['user', user], ['ip', '127.0.0.1']]), async () => {
        // Calling with lowercase p
        await prisma.proceeding.findUnique({
            where: { id: proceeding.id }
        });
    });
}

testAuditLowercase().catch(console.error);
