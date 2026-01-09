import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class UserRoleService {
  /**
   * Helper to ensure ID is a BigInt
   */
  toBigInt(id) {
    if (typeof id === 'bigint') return id;
    if (id === null || id === undefined) return null;
    return BigInt(id);
  }

  /**
   * Asignar un rol a un usuario
   */
  async assignRole(userId, roleId) {
    const bUserId = this.toBigInt(userId);
    const bRoleId = this.toBigInt(roleId);

    // Verificar si ya tiene el rol
    const existing = await prisma.$queryRaw`
      SELECT * FROM model_has_roles 
      WHERE model_id = ${bUserId} 
      AND role_id = ${bRoleId} 
      AND model_type = 'App\\Models\\User'
    `;

    if (existing.length > 0) {
      return { message: 'El usuario ya tiene este rol' };
    }

    // Asignar rol
    await prisma.$executeRaw`
      INSERT INTO model_has_roles (role_id, model_type, model_id)
      VALUES (${bRoleId}, 'App\\Models\\User', ${bUserId})
    `;

    return { message: 'Rol asignado exitosamente' };
  }

  /**
   * Remover un rol de un usuario
   */
  async removeRole(userId, roleId) {
    const bUserId = this.toBigInt(userId);
    const bRoleId = this.toBigInt(roleId);

    await prisma.$executeRaw`
      DELETE FROM model_has_roles 
      WHERE model_id = ${bUserId} 
      AND role_id = ${bRoleId} 
      AND model_type = 'App\\Models\\User'
    `;

    return { message: 'Rol removido exitosamente' };
  }

  /**
   * Sincronizar roles de un usuario (reemplaza todos los roles)
   */
  async syncRoles(userId, roleIds) {
    const bUserId = this.toBigInt(userId);

    // Eliminar roles existentes
    await prisma.$executeRaw`
      DELETE FROM model_has_roles 
      WHERE model_id = ${bUserId} 
      AND model_type = 'App\\Models\\User'
    `;

    // Asignar nuevos roles
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        const bRoleId = this.toBigInt(roleId);
        await prisma.$executeRaw`
          INSERT INTO model_has_roles (role_id, model_type, model_id)
          VALUES (${bRoleId}, 'App\\Models\\User', ${bUserId})
        `;
      }
    }

    return { message: 'Roles sincronizados exitosamente' };
  }

  /**
   * Obtener roles de un usuario
   */
  async getUserRoles(userId) {
    const bUserId = this.toBigInt(userId);
    const roles = await prisma.$queryRaw`
      SELECT r.* 
      FROM roles r
      INNER JOIN model_has_roles mhr ON mhr.role_id = r.id
      WHERE mhr.model_id = ${bUserId} 
      AND mhr.model_type = 'App\\Models\\User'
    `;

    return roles;
  }

  /**
   * Verificar si un usuario tiene un rol específico
   */
  async hasRole(userId, roleName) {
    const bUserId = this.toBigInt(userId);
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM roles r
      INNER JOIN model_has_roles mhr ON mhr.role_id = r.id
      WHERE mhr.model_id = ${bUserId} 
      AND mhr.model_type = 'App\\Models\\User'
      AND r.name = ${roleName}
    `;

    const count = result[0]?.count;
    return (typeof count === 'bigint' ? count > 0n : count > 0);
  }

  /**
   * Obtener permisos de un usuario (Inherited through roles + Direct)
   */
  async getUserPermissions(userId) {
    const bUserId = this.toBigInt(userId);
    const permissions = await prisma.$queryRaw`
      SELECT DISTINCT p.*, 
             CASE WHEN mhp.model_id IS NOT NULL THEN 1 ELSE 0 END as is_direct
      FROM permissions p
      LEFT JOIN role_has_permissions rhp ON rhp.permission_id = p.id
      LEFT JOIN model_has_roles mhr ON mhr.role_id = rhp.role_id AND mhr.model_id = ${bUserId} AND mhr.model_type = 'App\\Models\\User'
      LEFT JOIN model_has_permissions mhp ON mhp.permission_id = p.id AND mhp.model_id = ${bUserId} AND mhp.model_type = 'App\\Models\\User'
      WHERE mhr.model_id IS NOT NULL OR mhp.model_id IS NOT NULL
    `;

    return permissions;
  }

  /**
   * Asignar un permiso directo a un usuario
   */
  async assignPermission(userId, permissionId) {
    const bUserId = this.toBigInt(userId);
    const bPermissionId = this.toBigInt(permissionId);

    // Verificar si ya tiene el permiso directo
    const existing = await prisma.$queryRaw`
      SELECT * FROM model_has_permissions 
      WHERE model_id = ${bUserId} 
      AND permission_id = ${bPermissionId} 
      AND model_type = 'App\\Models\\User'
    `;

    if (existing.length > 0) {
      return { message: 'El usuario ya tiene este permiso asignado directamente' };
    }

    // Asignar permiso
    await prisma.$executeRaw`
      INSERT INTO model_has_permissions (permission_id, model_type, model_id)
      VALUES (${bPermissionId}, 'App\\Models\\User', ${bUserId})
    `;

    return { message: 'Permiso asignado exitosamente' };
  }

  /**
   * Remover un permiso directo de un usuario
   */
  async removePermission(userId, permissionId) {
    const bUserId = this.toBigInt(userId);
    const bPermissionId = this.toBigInt(permissionId);

    await prisma.$executeRaw`
      DELETE FROM model_has_permissions 
      WHERE model_id = ${bUserId} 
      AND permission_id = ${bPermissionId} 
      AND model_type = 'App\\Models\\User'
    `;

    return { message: 'Permiso removido exitosamente' };
  }

  /**
   * Verificar si un usuario tiene un permiso específico
   */
  async hasPermission(userId, permissionName) {
    const bUserId = this.toBigInt(userId);
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM permissions p
      INNER JOIN role_has_permissions rhp ON rhp.permission_id = p.id
      INNER JOIN model_has_roles mhr ON mhr.role_id = rhp.role_id
      WHERE mhr.model_id = ${bUserId}
      AND mhr.model_type = 'App\\Models\\User'
      AND p.name = ${permissionName}
    `;

    const count = result[0]?.count;
    return (typeof count === 'bigint' ? count > 0n : count > 0);
  }
}

export default new UserRoleService();
