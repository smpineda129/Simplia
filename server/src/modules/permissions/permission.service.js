import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class PermissionService {
  async getAllPermissions(filters = {}) {
    const { search, page = 1, limit = 100 } = filters;
    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        include: {
          roleHasPermissions: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                  roleLevel: true,
                },
              },
            },
          },
        },
      }),
      prisma.permission.count({ where }),
    ]);

    return {
      data: permissions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPermissionById(id) {
    const permission = await prisma.permission.findUnique({
      where: { id: parseInt(id) },
      include: {
        roleHasPermissions: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                roleLevel: true,
                companyId: true,
              },
            },
          },
        },
      },
    });

    if (!permission) {
      throw new Error('Permiso no encontrado');
    }

    return permission;
  }

  async createPermission(data) {
    const { name, guardName = 'web', permissionLevel } = data;

    const permission = await prisma.permission.create({
      data: {
        name,
        guardName,
        permissionLevel: permissionLevel ? parseInt(permissionLevel) : null,
      },
    });

    return permission;
  }

  async updatePermission(id, data) {
    const { name, guardName, permissionLevel } = data;

    const permission = await prisma.permission.update({
      where: { id: parseInt(id) },
      data: {
        name,
        guardName,
        permissionLevel: permissionLevel ? parseInt(permissionLevel) : null,
      },
    });

    return permission;
  }

  async deletePermission(id) {
    // Eliminar relaciones con roles
    await prisma.roleHasPermission.deleteMany({
      where: { permissionId: parseInt(id) },
    });

    // Eliminar relaciones con modelos
    await prisma.modelHasPermission.deleteMany({
      where: { permissionId: parseInt(id) },
    });

    // Eliminar permiso
    await prisma.permission.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Permiso eliminado exitosamente' };
  }

  async getPermissionRoles(permissionId) {
    const roles = await prisma.roleHasPermission.findMany({
      where: { permissionId: parseInt(permissionId) },
      include: {
        role: true,
      },
    });

    return roles.map((rp) => rp.role);
  }

  // Obtener permisos agrupados por categoría (basado en el prefijo)
  async getGroupedPermissions() {
    const permissions = await prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });

    const grouped = {};
    permissions.forEach((permission) => {
      const parts = permission.name.split('.');
      const category = parts[0] || 'general';
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });

    return grouped;
  }
}

export default new PermissionService();
