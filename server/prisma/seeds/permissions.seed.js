import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility for snake case matching Laravel's Str::snake
const toSnakeCase = (str) => {
    return str
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
        .replace(/^_/, '');
};

async function generateActionPermissions(model, actionNames, permissionLevel = 1) {
    const modelName = toSnakeCase(model);

    // Find or create Owner role
    let owner = await prisma.role.findFirst({
        where: { name: 'Owner', guardName: 'web' }
    });

    if (!owner) {
        owner = await prisma.role.create({
            data: {
                name: 'Owner',
                guardName: 'web',
                roleLevel: 1
            }
        });
    }

    console.log(`Processing permissions for model: ${modelName}`);

    for (const action of actionNames) {
        const actionName = toSnakeCase(action);
        const permissionName = `${modelName}.${actionName}`;

        // Find or create Permission
        let permission = await prisma.permission.findFirst({
            where: { name: permissionName, guardName: 'web' }
        });

        if (!permission) {
            permission = await prisma.permission.create({
                data: {
                    name: permissionName,
                    guardName: 'web',
                    permissionLevel: permissionLevel
                }
            });
            console.log(`  + Created permission: ${permissionName}`);
        } else {
            // Update existing
            permission = await prisma.permission.update({
                where: { id: permission.id },
                data: { permissionLevel: permissionLevel }
            });
            console.log(`  . Updated permission: ${permissionName}`);
        }

        // Sync role (Add if not exists)
        // Check if relation exists
        const roleHasPermission = await prisma.roleHasPermission.findUnique({
            where: {
                permissionId_roleId: {
                    permissionId: permission.id,
                    roleId: owner.id
                }
            }
        });

        if (!roleHasPermission) {
            await prisma.roleHasPermission.create({
                data: {
                    permissionId: permission.id,
                    roleId: owner.id
                }
            });
            console.log(`    -> Linked to Owner`);
        }
    }
}

export async function seedPermissions() {
    console.log('🛡️  Iniciando generación de permisos...');

    const permissionsConfig = [
        { model: 'role', actions: ['view', 'create', 'update', 'delete', 'attach-user', 'detach-user', 'attach-permission', 'detach-permission'] },
        { model: 'permission', actions: ['view', 'create', 'update', 'delete', 'attach-user', 'detach-user'] },
        { model: 'document', actions: ['view', 'create', 'update', 'delete', 'show_deleted'] },
        { model: 'area', actions: ['view', 'create', 'update', 'delete', 'attach-user', 'detach-user', 'attach-proceeding', 'detach-proceeding', 'add-retention'] },
        { model: 'warehouse', actions: ['view', 'create', 'update', 'delete', 'attach-box', 'detach-box'] },
        { model: 'box', actions: ['view', 'create', 'update', 'delete', 'attach-proceeding', 'detach-proceeding', 'attach-warehouse', 'detach-warehouse'] },
        { model: 'category', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'user', actions: ['view', 'create', 'update', 'delete', 'attach-permission', 'detach-permission', 'attach-role', 'detach-role', 'attach-area', 'detach-area', 'impersonate'] },
        { model: 'action', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'company', actions: ['view', 'create', 'update', 'delete', 'add-area', 'add-user'] },
        { model: 'company_config', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'retention', actions: ['view', 'create', 'update', 'delete', 'attach-proceeding', 'detach-proceeding', 'add-retention_line', 'attach-retention_line', 'detach-retention_line'] },
        { model: 'status', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'correspondence', actions: ['view', 'create', 'update', 'delete', 'thread', 'upload_document', 'delete_any_area', 'update_any_area', 'view_any_area'] },
        { model: 'correspondence_type', actions: ['view', 'create', 'update', 'delete', 'add-correspondence'] },
        { model: 'proceeding', actions: ['view', 'create', 'update', 'delete', 'attach-box', 'detach-box', 'attach-area', 'detach-area', 'attach-entity', 'detach-entity', 'attach-document', 'detach-document', 'see_any_area', 'upload_document', 'close', 'ask_physical', 'share', 'loan', 'import_inventory', 'export_inventory', 'reopen_proceeding'] },
        { model: 'template', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'entity', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'external_user', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'retention_line', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'all', actions: ['show_soft_deleted'] },
        { model: 'form', actions: ['view', 'create', 'update', 'delete'] },
        { model: 'submission', actions: ['view', 'export'] },
    ];

    for (const config of permissionsConfig) {
        await generateActionPermissions(config.model, config.actions);
    }

    console.log('✅ Permisos generados correctamente.');
}
