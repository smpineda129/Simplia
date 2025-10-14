import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAreas() {
  console.log('📁 Creando áreas...');

  // Obtener las empresas existentes
  const companies = await prisma.company.findMany({
    take: 3,
  });

  if (companies.length === 0) {
    console.log('⚠️  No hay empresas. Saltando seed de áreas.');
    return;
  }

  const areasData = [
    { name: 'Recursos Humanos', code: 'RRHH' },
    { name: 'Contabilidad', code: 'CONT' },
    { name: 'Tecnología', code: 'TI' },
    { name: 'Ventas', code: 'VTAS' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Operaciones', code: 'OPS' },
    { name: 'Legal', code: 'LEG' },
    { name: 'Administración', code: 'ADM' },
  ];

  for (const company of companies) {
    // Crear 4-6 áreas por empresa
    const areasToCreate = areasData.slice(0, Math.floor(Math.random() * 3) + 4);

    for (const areaData of areasToCreate) {
      const existing = await prisma.area.findFirst({
        where: {
          code: areaData.code,
          companyId: company.id,
        },
      });

      if (!existing) {
        const area = await prisma.area.create({
          data: {
            name: areaData.name,
            code: areaData.code,
            companyId: company.id,
          },
        });
        console.log(`✅ Área creada: ${area.name} (${company.name})`);
      }
    }
  }
}
