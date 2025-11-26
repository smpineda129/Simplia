import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('📊 Verificando datos en la base de datos...\n');

    const companies = await prisma.company.count();
    const users = await prisma.user.count();
    const correspondences = await prisma.correspondence.count();
    const proceedings = await prisma.proceeding.count();
    const retentions = await prisma.retention.count();
    const documents = await prisma.document.count();
    const areas = await prisma.area.count();

    console.log('✅ Resumen de datos:');
    console.log(`   🏢 Empresas: ${companies}`);
    console.log(`   👥 Usuarios: ${users}`);
    console.log(`   📧 Correspondencias: ${correspondences}`);
    console.log(`   📁 Expedientes: ${proceedings}`);
    console.log(`   📋 Retenciones: ${retentions}`);
    console.log(`   📄 Documentos: ${documents}`);
    console.log(`   🏛️  Áreas: ${areas}`);

    console.log('\n🏢 Empresas registradas:');
    const companiesList = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        short: true,
        email: true,
      }
    });

    companiesList.forEach(company => {
      console.log(`   - ${company.name} (${company.short}) - ID: ${company.id}`);
    });

    console.log('\n✅ Todos tus datos están seguros y sin cambios!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

checkData()
  .catch((e) => {
    console.error('❌ Error verificando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
