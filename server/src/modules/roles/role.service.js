import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class RoleService {
  async getAllRoles(companyId, filters = {}) {
    const { search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(companyId ? {
        OR: [
          { companyId: BigInt(companyId) },
          { companyId: null }
        ]
      } : {
        companyId: null
      })
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { roleLevel: 'asc' },
        include: {
          roleHasPermissions: {
            include: {
              permission: true,
            },
          },
        },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      data: roles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRoleById(id) {
    const role = await prisma.role.findUnique({
      where: { id: BigInt(id) },
      include: {
        roleHasPermissions: {
          include: {
            permission: {
              select: {
                id: true,
                name: true,
                guardName: true,
                permissionLevel: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new Error('Rol no encontrado');
    }

    return role;
  }

  async createRole(data) {
    const { name, guardName = 'web', roleLevel, companyId, permissions = [] } = data;

    // Crear rol
    const role = await prisma.role.create({
      data: {
        name,
        guardName,
        roleLevel: roleLevel ? parseInt(roleLevel) : null,
        companyId: companyId ? parseInt(companyId) : null,
      },
    });

    // Asignar permisos si existen
    if (permissions.length > 0) {
      await prisma.roleHasPermission.createMany({
        data: permissions.map((permissionId) => ({
          roleId: role.id,
          permissionId: parseInt(permissionId),
        })),
      });
    }

    return this.getRoleById(role.id);
  }

  async updateRole(id, data) {
    const role = await this.getRoleById(id);
    if (!role.companyId) {
      throw new Error('No se pueden modificar roles del sistema');
    }
    const { name, guardName, roleLevel, companyId, permissions } = data;

    // Actualizar rol
    await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        name,
        guardName,
        roleLevel: roleLevel ? parseInt(roleLevel) : null,
        companyId: companyId ? parseInt(companyId) : null,
      },
    });

    // Actualizar permisos si se proporcionan
    if (permissions !== undefined) {
      // Eliminar permisos existentes
      await prisma.roleHasPermission.deleteMany({
        where: { roleId: parseInt(id) },
      });

      // Crear nuevos permisos
      if (permissions.length > 0) {
        await prisma.roleHasPermission.createMany({
          data: permissions.map((permissionId) => ({
            roleId: parseInt(id),
            permissionId: parseInt(permissionId),
          })),
        });
      }
    }

    return this.getRoleById(id);
  }

  async deleteRole(id) {
    const role = await this.getRoleById(id);
    if (!role.companyId) {
      throw new Error('No se pueden eliminar roles del sistema');
    }
    // Verificar si hay usuarios con este rol
    const usersWithRole = await prisma.modelHasRole.count({
      where: {
        roleId: parseInt(id),
        modelType: 'App\\Models\\User',
      },
    });

    if (usersWithRole > 0) {
      throw new Error(`No se puede eliminar el rol porque tiene ${usersWithRole} usuario(s) asignado(s)`);
    }

    // Eliminar permisos del rol
    await prisma.roleHasPermission.deleteMany({
      where: { roleId: parseInt(id) },
    });

    // Eliminar rol
    await prisma.role.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Rol eliminado exitosamente' };
  }

  async getRolePermissions(roleId) {
    const permissions = await prisma.roleHasPermission.findMany({
      where: { roleId: parseInt(roleId) },
      include: {
        permission: true,
      },
    });

    return permissions.map((rp) => rp.permission);
  }

  async syncRolePermissions(roleId, permissionIds) {
    const role = await this.getRoleById(roleId);
    if (!role.companyId) {
      throw new Error('No se pueden modificar permisos de roles del sistema');
    }
    // Eliminar permisos existentes
    await prisma.roleHasPermission.deleteMany({
      where: { roleId: parseInt(roleId) },
    });

    // Crear nuevos permisos
    if (permissionIds.length > 0) {
      await prisma.roleHasPermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: parseInt(roleId),
          permissionId: parseInt(permissionId),
        })),
      });
    }

    return this.getRolePermissions(roleId);
  }
}

export default new RoleService();
