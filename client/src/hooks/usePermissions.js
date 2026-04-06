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
     * Verifica si el usuario puede personificar a otro usuario (solo rol Owner)
     * @param {object} targetUser - Usuario objetivo con roles
     * @returns {boolean}
     */
    const canImpersonateUser = (targetUser) => {
        if (!user || !targetUser) return false;
        if (user.id === targetUser.id) return false;

        // No permitir personificación anidada
        if (user.impersonatorId || user.impersonator_id) return false;

        // Solo el rol Owner (roleLevel 1) puede personificar
        const isOwner = user?.roles?.some(r =>
            (typeof r === 'object' ? r.name : r) === 'Owner' ||
            (typeof r === 'object' ? (r.roleLevel ?? r.role_level) : null) === 1
        );
        if (!isOwner) return false;

        // No permitir personificar a otro Owner
        const isTargetOwner = targetUser?.roles?.some(r =>
            (typeof r === 'object' ? r.name : r) === 'Owner' ||
            (typeof r === 'object' ? (r.roleLevel ?? r.role_level) : null) === 1
        );
        if (isTargetOwner) return false;

        return true;
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
