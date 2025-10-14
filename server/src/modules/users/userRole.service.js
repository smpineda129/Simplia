import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class UserRoleService {
  /**
   * Asignar un rol a un usuario
   */
  async assignRole(userId, roleId) {
    // Verificar si ya tiene el rol
    const existing = await prisma.$queryRaw`
      SELECT * FROM model_has_roles 
      WHERE model_id = ${userId} 
      AND role_id = ${roleId} 
      AND model_type = 'User'
    `;

    if (existing.length > 0) {
      return { message: 'El usuario ya tiene este rol' };
    }

    // Asignar rol
    await prisma.$executeRaw`
      INSERT INTO model_has_roles (role_id, model_type, model_id)
      VALUES (${roleId}, 'User', ${userId})
    `;

    return { message: 'Rol asignado exitosamente' };
  }

  /**
   * Remover un rol de un usuario
   */
  async removeRole(userId, roleId) {
    await prisma.$executeRaw`
      DELETE FROM model_has_roles 
      WHERE model_id = ${userId} 
      AND role_id = ${roleId} 
      AND model_type = 'User'
    `;

    return { message: 'Rol removido exitosamente' };
  }

  /**
   * Sincronizar roles de un usuario (reemplaza todos los roles)
   */
  async syncRoles(userId, roleIds) {
    // Eliminar roles existentes
    await prisma.$executeRaw`
      DELETE FROM model_has_roles 
      WHERE model_id = ${userId} 
      AND model_type = 'User'
    `;

    // Asignar nuevos roles
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        await prisma.$executeRaw`
          INSERT INTO model_has_roles (role_id, model_type, model_id)
          VALUES (${roleId}, 'User', ${userId})
        `;
      }
    }

    return { message: 'Roles sincronizados exitosamente' };
  }

  /**
   * Obtener roles de un usuario
   */
  async getUserRoles(userId) {
    const roles = await prisma.$queryRaw`
      SELECT r.* 
      FROM roles r
      INNER JOIN model_has_roles mhr ON mhr.role_id = r.id
      WHERE mhr.model_id = ${userId} 
      AND mhr.model_type = 'User'
    `;

    return roles;
  }

  /**
   * Verificar si un usuario tiene un rol específico
   */
  async hasRole(userId, roleName) {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM roles r
      INNER JOIN model_has_roles mhr ON mhr.role_id = r.id
      WHERE mhr.model_id = ${userId} 
      AND mhr.model_type = 'User'
      AND r.name = ${roleName}
    `;

    return result[0]?.count > 0;
  }

  /**
   * Obtener permisos de un usuario (a través de sus roles)
   */
  async getUserPermissions(userId) {
    const permissions = await prisma.$queryRaw`
      SELECT DISTINCT p.*
      FROM permissions p
      INNER JOIN role_has_permissions rhp ON rhp.permission_id = p.id
      INNER JOIN model_has_roles mhr ON mhr.role_id = rhp.role_id
      WHERE mhr.model_id = ${userId}
      AND mhr.model_type = 'User'
    `;

    return permissions;
  }

  /**
   * Verificar si un usuario tiene un permiso específico
   */
  async hasPermission(userId, permissionName) {
    const result = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM permissions p
      INNER JOIN role_has_permissions rhp ON rhp.permission_id = p.id
      INNER JOIN model_has_roles mhr ON mhr.role_id = rhp.role_id
      WHERE mhr.model_id = ${userId}
      AND mhr.model_type = 'User'
      AND p.name = ${permissionName}
    `;

    return result[0]?.count > 0;
  }
}

export default new UserRoleService();
