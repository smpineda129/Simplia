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
            const levels = roles.map(role => {
                const level = role.role_level || role.roleLevel || 999;
                // Restricción: Nivel 1 solo para rol 'Owner'
                if (level === 1 && role.name !== 'Owner') {
                    return 999;
                }
                return level;
            });
            return Math.min(...levels);
        }

        // 2. Si no hay roles en la tabla de relaciones, intentar con la columna 'role' del usuario
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: { id: true, role: true }
        });

        if (user && user.role) {
            const dbRole = await prisma.role.findFirst({
                where: { name: user.role }
            });
            if (dbRole) {
                const level = dbRole.roleLevel || 999;
                // Restricción: Nivel 1 solo para rol 'Owner'
                if (level === 1 && dbRole.name !== 'Owner') {
                    return 999;
                }
                return level;
            }
        }

        // 3. Fallback: nivel menos privilegiado
        return 999;
    },

    /**
     * Verifica si un usuario puede personificar (solo rol Owner)
     * @param {number} impersonatorId - ID del usuario que quiere personificar
     * @returns {Promise<void>} - Lanza ApiError si no puede
     */
    async assertCanImpersonate(impersonatorId) {
        const level = await this.getUserLowestRoleLevel(impersonatorId);
        if (level > 2) {
            throw new ApiError(403, 'Solo el rol Owner o Admin puede personificar usuarios');
        }
    },

    /**
     * Inicia una sesión de personificación
     * @param {number} impersonatorId - ID del usuario que personifica
     * @param {string} targetEmail - Email del usuario a personificar
     * @returns {Promise<{accessToken: string, user: object}>}
     */
    async startImpersonation(impersonatorId, targetEmail) {
        // Verificar que el impersonador es Owner
        await this.assertCanImpersonate(impersonatorId);

        // Buscar usuario objetivo por email
        const targetUser = await prisma.user.findFirst({
            where: { email: targetEmail, deletedAt: null },
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

        if (!targetUser) {
            throw new ApiError(404, 'Usuario no encontrado');
        }

        if (parseInt(impersonatorId) === parseInt(targetUser.id)) {
            throw new ApiError(400, 'No puedes personificarte a ti mismo');
        }

        // No permitir personificar a un usuario con nivel de rol mayor o igual al impersonador
        const impersonatorLevel = await this.getUserLowestRoleLevel(impersonatorId);
        const targetRoles = await userRoleService.getUserRoles(parseInt(targetUser.id));
        const targetLevel = targetRoles.length > 0
            ? Math.min(...targetRoles.map(r => r.role_level || r.roleLevel || 999))
            : 999;

        if (targetLevel <= impersonatorLevel) {
            throw new ApiError(403, 'No puedes personificar a un usuario con igual o mayor nivel de privilegio');
        }

        // Obtener roles y permisos del usuario objetivo
        const permissions = await userRoleService.getUserPermissions(parseInt(targetUser.id));

        const userWithPermissions = {
            ...targetUser,
            roles: targetRoles.map(r => ({
                name: r.name,
                roleLevel: r.role_level || r.roleLevel
            })),
            allPermissions: permissions.map(p => p.name),
        };

        // Generar token de personificación
        const accessToken = tokenService.generateImpersonationToken(
            impersonatorId,
            targetUser.id
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
