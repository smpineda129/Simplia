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
     * Requiere el permiso 'user.impersonate'
     * @param {object} targetUser - Usuario objetivo con roles
     * @returns {boolean}
     */
    const canImpersonateUser = (targetUser) => {
        if (!user || !targetUser) return false;
        if (user.id === targetUser.id) return false;

        // Si ya está personificando, no permitir otra capa de personificación
        if (user.impersonatorId || user.impersonator_id) {
            return false;
        }

        // Debe tener el permiso de personificación
        if (!hasPermission('user.impersonate')) {
            return false;
        }

        const getLevel = (u) => {
            let levels = [];
            if (u.roles && Array.isArray(u.roles)) {
                u.roles.forEach(r => {
                    const l = typeof r === 'object' ? (r.roleLevel ?? r.role_level) : null;
                    if (l !== null && l !== undefined) levels.push(l);
                });
            }
            if (u.role === 'Owner') levels.push(1);
            else if (u.role === 'ADMIN') levels.push(2);
            if (levels.length === 0) return 999;
            return Math.min(...levels);
        };

        const currentLvl = getLevel(user);
        const targetLvl = getLevel(targetUser);

        return currentLvl < targetLvl || (currentLvl === 1 && targetUser.role !== 'Owner');
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
