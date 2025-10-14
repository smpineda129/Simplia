import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCompanies() {
  console.log('🏢 Creando empresas...');

  const companies = [
    {
      name: 'Empresa Demo 1',
      identifier: '900123456-1',
      short: 'DEMO1',
      email: 'contacto@demo1.com',
      codeName: 'DEMO1',
      codeDescription: 'Empresa de demostración 1',
      website: 'https://demo1.com',
      maxUsers: 50,
    },
    {
      name: 'Empresa Demo 2',
      identifier: '900123456-2',
      short: 'DEMO2',
      email: 'contacto@demo2.com',
      codeName: 'DEMO2',
      codeDescription: 'Empresa de demostración 2',
      website: 'https://demo2.com',
      maxUsers: 25,
    },
    {
      name: 'Empresa Demo 3',
      identifier: '900123456-3',
      short: 'DEMO3',
      email: 'contacto@demo3.com',
      codeName: 'DEMO3',
      codeDescription: 'Empresa de demostración 3',
      maxUsers: 100,
    },
  ];

  for (const companyData of companies) {
    const existing = await prisma.company.findFirst({
      where: { identifier: companyData.identifier },
    });

    if (!existing) {
      const company = await prisma.company.create({
        data: companyData,
      });
      console.log(`✅ Empresa creada: ${company.name}`);
    } else {
      console.log(`⏭️  Empresa ya existe: ${existing.name}`);
    }
  }
}
