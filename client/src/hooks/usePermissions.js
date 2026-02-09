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
     * Requiere el permiso 'user.impersonate'
     * @param {object} targetUser - Usuario objetivo con roles
     * @returns {boolean}
     */
    const canImpersonateUser = (targetUser) => {
        if (!user || !targetUser) return false;
        if (user.id === targetUser.id) return false;

        // Si ya está personificando, no permitir otra capa de personificación
        if (user.impersonatorId || user.impersonator_id || user.isImpersonating) {
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
                    const name = typeof r === 'object' ? r.name : r;
                    
                    // Solo permitir nivel 1 si el nombre del rol es 'Owner'
                    if (l === 1 && name !== 'Owner') {
                        levels.push(999); // Nivel no válido para no-owner
                    } else if (l !== null && l !== undefined) {
                        levels.push(l);
                    }
                });
            }
            // Fallbacks para roles estáticos si no hay niveles definidos
            if (u.role === 'Owner') levels.push(1);
            else if (u.role === 'ADMIN' || u.role === 'CompanyAdmin') levels.push(2);

            // IMPORTANTE: Asegurarnos de que si no hay roles definidos pero tiene el permiso, 
            // el nivel sea alto (999) para que pueda ser personificado
            if (levels.length === 0) return 999;
            return Math.min(...levels);
        };

        const currentLvl = getLevel(user);
        const targetLvl = getLevel(targetUser);

        // REGLA 1: Owner (Nivel 1) puede personificar a cualquiera siempre que tenga nivel 1,
        // excepto a otro Owner (Nivel 1).
        if (currentLvl === 1) {
            // Verificar si el objetivo es un Owner con nivel 1
            const targetRoles = targetUser.roles || [];
            const isTargetOwnerLvl1 = targetRoles.some(r => {
                const l = typeof r === 'object' ? (r.roleLevel ?? r.role_level) : null;
                const name = typeof r === 'object' ? r.name : r;
                return l === 1 && name === 'Owner';
            });

            if (isTargetOwnerLvl1) return false;
            return true;
        }

        // REGLA 2: Otros roles con permiso deben tener nivel menor (numéricamente) al objetivo y ser de la misma compañía
        const currentCompanyId = user.companyId?.toString();
        const targetCompanyId = targetUser.companyId?.toString();

        const sameCompany = currentCompanyId && targetCompanyId &&
            currentCompanyId === targetCompanyId;

        if (!sameCompany) return false;

        // Verificar nivel superior (numéricamente menor)
        return currentLvl < targetLvl;
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
