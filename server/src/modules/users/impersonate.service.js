import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import { tokenService } from '../../services/tokenService.js';
import userRoleService from './userRole.service.js';

export const impersonateService = {
    /**
     * Obtiene el nivel de rol más bajo (más privilegiado) de un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<number>} - El nivel de rol más bajo
     */
    async getUserLowestRoleLevel(userId) {
        // 1. Intentar obtener roles desde la tabla de relaciones (model_has_roles)
        const roles = await userRoleService.getUserRoles(userId);

        if (roles && roles.length > 0) {
            // El servicio getUserRoles ya devuelve objetos de roles completos a través de su raw query
            return Math.min(...roles.map(role => role.role_level || role.roleLevel || 999));
        }

        // 2. Si no hay roles en la tabla de relaciones, intentar con la columna 'role' del usuario
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: { role: true }
        });

        if (user && user.role) {
            const dbRole = await prisma.role.findFirst({
                where: { name: user.role }
            });
            if (dbRole) {
                return dbRole.roleLevel || 999;
            }
        }

        // 3. Fallback: nivel menos privilegiado
        return 999;
    },

    /**
     * Verifica si un usuario puede personificar a otro
     * @param {number} impersonatorId - ID del usuario que quiere personificar
     * @param {number} targetUserId - ID del usuario a personificar
     * @returns {Promise<{canImpersonate: boolean, reason?: string}>}
     */
    async canImpersonate(impersonatorId, targetUserId) {
        // 1. Verificar que el usuario objetivo existe
        const targetUser = await prisma.user.findUnique({
            where: { id: parseInt(targetUserId) },
        });

        if (!targetUser || targetUser.deletedAt) {
            return {
                canImpersonate: false,
                reason: 'Usuario objetivo no encontrado o eliminado',
            };
        }

        // 2. No puede personificarse a sí mismo
        if (parseInt(impersonatorId) === parseInt(targetUserId)) {
            return {
                canImpersonate: false,
                reason: 'No puedes personificarte a ti mismo',
            };
        }

        // 3. Verificar que el impersonador tiene el permiso 'user.impersonate'
        const hasPermission = await userRoleService.hasPermission(
            impersonatorId,
            'user.impersonate'
        );

        if (!hasPermission) {
            return {
                canImpersonate: false,
                reason: 'No tienes el permiso user.impersonate',
            };
        }

        // 4. Verificar niveles de rol
        const impersonatorLevel = await this.getUserLowestRoleLevel(impersonatorId);
        const targetLevel = await this.getUserLowestRoleLevel(targetUserId);

        // El impersonador debe tener un nivel MENOR (más privilegiado) que el objetivo
        if (impersonatorLevel >= targetLevel) {
            return {
                canImpersonate: false,
                reason: 'No tienes suficiente nivel de privilegio para personificar a este usuario',
            };
        }

        return { canImpersonate: true };
    },

    /**
     * Inicia una sesión de personificación
     * @param {number} impersonatorId - ID del usuario que personifica
     * @param {number} targetUserId - ID del usuario a personificar
     * @returns {Promise<{accessToken: string, user: object}>}
     */
    async startImpersonation(impersonatorId, targetUserId) {
        // Verificar si puede personificar
        const { canImpersonate, reason } = await this.canImpersonate(
            impersonatorId,
            targetUserId
        );

        if (!canImpersonate) {
            throw new ApiError(403, reason || 'No puedes personificar a este usuario');
        }

        // Obtener datos del usuario objetivo
        const targetUser = await prisma.user.findUnique({
            where: { id: parseInt(targetUserId) },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                companyId: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        short: true,
                    },
                },
            },
        });

        // Obtener roles y permisos del usuario objetivo
        const roles = await userRoleService.getUserRoles(parseInt(targetUserId));
        const permissions = await userRoleService.getUserPermissions(parseInt(targetUserId));

        const userWithPermissions = {
            ...targetUser,
            roles: roles.map(r => ({
                name: r.name,
                roleLevel: r.role_level || r.roleLevel
            })),
            allPermissions: permissions.map(p => p.name),
        };

        // Generar token de personificación
        const accessToken = tokenService.generateImpersonationToken(
            impersonatorId,
            targetUserId
        );

        return {
            accessToken,
            user: userWithPermissions,
            isImpersonating: true,
        };
    },

    /**
     * Termina una sesión de personificación
     * @param {number} impersonatorId - ID del usuario original
     * @returns {Promise<{accessToken: string, refreshToken: string, user: object}>}
     */
    async leaveImpersonation(impersonatorId) {
        // Obtener datos del usuario original
        const impersonator = await prisma.user.findUnique({
            where: { id: parseInt(impersonatorId) },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                companyId: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        short: true,
                    },
                },
            },
        });

        if (!impersonator) {
            throw new ApiError(404, 'Usuario original no encontrado');
        }

        // Obtener roles y permisos del usuario original
        const roles = await userRoleService.getUserRoles(parseInt(impersonatorId));
        const permissions = await userRoleService.getUserPermissions(parseInt(impersonatorId));

        const userWithPermissions = {
            ...impersonator,
            roles: roles.map(r => ({
                name: r.name,
                roleLevel: r.role_level || r.roleLevel
            })),
            allPermissions: permissions.map(p => p.name),
        };

        // Generar nuevos tokens normales (sin personificación)
        const tokens = tokenService.generateTokenPair(impersonatorId);

        return {
            ...tokens,
            user: userWithPermissions,
            isImpersonating: false,
        };
    },
};
