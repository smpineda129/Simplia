import { impersonateService } from './impersonate.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const impersonateController = {
    /**
     * Inicia la personificación de un usuario
     * POST /api/users/:id/impersonate
     */
    startImpersonation: asyncHandler(async (req, res) => {
        const impersonatorId = req.user.id;
        const targetUserId = req.params.id;

        const result = await impersonateService.startImpersonation(
            impersonatorId,
            targetUserId
        );

        res.status(200).json({
            success: true,
            message: `Ahora estás personificando a ${result.user.name}`,
            data: result,
        });
    }),

    /**
     * Termina la sesión de personificación
     * POST /api/auth/leave-impersonation
     */
    leaveImpersonation: asyncHandler(async (req, res) => {
        // El impersonatorId viene del token JWT
        if (!req.impersonator) {
            return res.status(400).json({
                success: false,
                message: 'No estás personificando a ningún usuario',
            });
        }

        const result = await impersonateService.leaveImpersonation(req.impersonator.id);

        res.status(200).json({
            success: true,
            message: 'Has dejado de personificar',
            data: result,
        });
    }),

    /**
     * Verifica si el usuario actual puede personificar a un usuario específico
     * GET /api/users/:id/can-impersonate
     */
    canImpersonate: asyncHandler(async (req, res) => {
        const impersonatorId = req.user.id;
        const targetUserId = req.params.id;

        const result = await impersonateService.canImpersonate(
            impersonatorId,
            targetUserId
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    }),
};
