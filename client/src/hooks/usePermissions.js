import { useAuth } from './useAuth';

/**
 * Hook para verificar permisos del usuario actual
 */
export const usePermissions = () => {
    const { user } = useAuth();

    /**
     * Verifica si el usuario tiene un permiso específico
     * @param {string} permissionName - Nombre del permiso (ej. 'user.impersonate')
     * @returns {boolean}
     */
    const hasPermission = (permissionName) => {
        if (!user || !user.allPermissions) {
            return false;
        }
        // SUPER_ADMIN tiene acceso completo a todo
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        return user.allPermissions.includes(permissionName);
    };

    /**
     * Verifica si el usuario tiene alguno de los permisos especificados
     * @param {string[]} permissionNames - Array de nombres de permisos
     * @returns {boolean}
     */
    const hasAnyPermission = (permissionNames) => {
        if (!user || !user.allPermissions) {
            return false;
        }
        // SUPER_ADMIN tiene acceso completo a todo
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        return permissionNames.some(permission => user.allPermissions.includes(permission));
    };

    /**
     * Verifica si el usuario tiene todos los permisos especificados
     * @param {string[]} permissionNames - Array de nombres de permisos
     * @returns {boolean}
     */
    const hasAllPermissions = (permissionNames) => {
        if (!user || !user.allPermissions) {
            return false;
        }
        // SUPER_ADMIN tiene acceso completo a todo
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        return permissionNames.every(permission => user.allPermissions.includes(permission));
    };

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} roleName - Nombre del rol
     * @returns {boolean}
     */
    const hasRole = (roleName) => {
        if (!user || !user.roles) {
            return false;
        }
        return user.roles.some(role => {
            if (typeof role === 'string') return role === roleName;
            return role.name === roleName;
        });
    };

    /**
     * Verifica si el usuario puede personificar a otro usuario
     * Requiere permiso 'user.impersonate' y mayor autoridad (menor roleLevel) que el objetivo.
     * @param {object} targetUser - Usuario objetivo con roles
     * @returns {boolean}
     */
    const canImpersonateUser = (targetUser) => {
        if (!user || !targetUser) return false;
        if (String(user.id) === String(targetUser.id)) return false;

        // No permitir personificación anidada
        if (user.isImpersonated || user.impersonatorId || user.impersonator_id) return false;

        // Requiere permiso explícito
        if (!hasPermission('user.impersonate')) return false;

        // Comparar roleLevels: menor número = mayor autoridad
        const currentMinLevel = Math.min(
            ...(user.roles?.map(r => (typeof r === 'object' ? (r.roleLevel ?? r.role_level ?? 99) : 99)) ?? [99])
        );
        const targetMinLevel = Math.min(
            ...(targetUser.roles?.map(r => (typeof r === 'object' ? (r.roleLevel ?? r.role_level ?? 99) : 99)) ?? [99])
        );

        // Solo puede impersonar a usuarios con estrictamente menor autoridad (mayor roleLevel)
        return targetMinLevel > currentMinLevel;
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        canImpersonateUser,
        permissions: user?.allPermissions || [],
        roles: user?.roles || [],
    };
};
