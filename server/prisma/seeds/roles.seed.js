import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
    console.log('🎭 Iniciando creación de roles...');

    const roles = [
        { name: 'Owner', level: 1 },
        { name: 'InternViewer', level: 6 }, // (Visualizador Interno)
        { name: 'ProceedingsSupervisor', level: 4 }, // (Supervisor de Expedientes)
        { name: 'ProceedingAdmin', level: 3 }, // (Administrador de Expedientes)
        { name: 'CorrespondenceAdmin', level: 3 }, // (Administrador de Correspondencias)
        { name: 'CorrespondenceSupervisor', level: 4 }, // (Supervisor de Correspondencias)
        { name: 'CorrespondenceAuthor', level: 5 }, // (Autor de Correspondencias)
        { name: 'ProceedingsAuthor', level: 5 }, // (Autor de Expedientes)
        { name: 'correspondencia', level: 4 },
        { name: 'CompanyAdmin', level: 2 }, // (Administrador de compañía)
    ];

    for (const roleData of roles) {
        // Check if role exists by name and guard 'web'
        // Since name is not unique in schema, we use findFirst then update or create
        let role = await prisma.role.findFirst({
            where: {
                name: roleData.name,
                guardName: 'web'
            }
        });

        if (role) {
            // Update level if it changed
            role = await prisma.role.update({
                where: { id: role.id },
                data: {
                    roleLevel: roleData.level
                }
            });
            console.log(`  . Updated role: ${roleData.name} (Level: ${roleData.level})`);
        } else {
            // Create new
            role = await prisma.role.create({
                data: {
                    name: roleData.name,
                    guardName: 'web',
                    roleLevel: roleData.level
                }
            });
            console.log(`  + Created role: ${roleData.name} (Level: ${roleData.level})`);
        }
    }

    console.log('✅ Roles generados correctamente.');
}
