import { prisma } from '../db/prisma.js';

/**
 * Middleware para verificar si el usuario tiene un permiso específico.
 * Verifica tanto permisos directos como permisos heredados a través de roles.
 * 
 * @param {string} permissionName - Nombre del permiso (ej. 'user.view')
 */
export const hasPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado',
                });
            }

            const userId = req.user.id;

            // 1. Obtener la definición del permiso
            const permission = await prisma.permission.findFirst({
                where: {
                    name: permissionName,
                    guardName: 'web'
                }
            });

            if (!permission) {
                // Si el permiso no existe en la BD, por seguridad denegamos el acceso (o 404/500 según diseño)
                console.warn(`Permiso '${permissionName}' verificado pero no existe en la base de datos.`);
                return res.status(403).json({
                    success: false,
                    message: 'Permiso no definido en el sistema',
                });
            }

            // 2. Verificar permiso directo (ModelHasPermission)
            // model_has_permissions usa una llave compuesta, pero findFirst es más flexible si no tenemos los otros campos a mano
            // La tabla es: permissionId, modelType, modelId
            const hasDirectPermission = await prisma.modelHasPermission.findFirst({
                where: {
                    permissionId: permission.id,
                    modelId: userId,
                    modelType: 'App\\Models\\User' // Asumiendo este es el tipo usado en el seeder
                }
            });

            if (hasDirectPermission) {
                return next();
            }

            // 3. Verificar permiso vía Roles (User -> ModelHasRole -> Role -> RoleHasPermission)
            // Primero obtenemos los roles del usuario
            const userRoles = await prisma.modelHasRole.findMany({
                where: {
                    modelId: userId,
                    modelType: 'App\\Models\\User'
                },
                select: {
                    roleId: true
                }
            });

            const roleIds = userRoles.map(ur => ur.roleId);

            if (roleIds.length > 0) {
                // Verificamos si alguno de esos roles tiene el permiso
                const roleHasPermission = await prisma.roleHasPermission.findFirst({
                    where: {
                        permissionId: permission.id,
                        roleId: {
                            in: roleIds
                        }
                    }
                });

                if (roleHasPermission) {
                    return next();
                }
            }

            // 4. Si llegamos aquí, no tiene permisos
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción',
            });

        } catch (error) {
            console.error('Error al verificar permisos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al verificar permisos',
            });
        }
    };
};

/**
 * Middleware que permite el acceso si el usuario es el mismo del recurso
 * o si tiene el permiso especificado.
 * 
 * @param {string} permissionName - Nombre del permiso
 * @param {string} paramName - Nombre del parámetro que contiene el ID del usuario (ej. 'id' o 'userId')
 */
export const isSelfOrHasPermission = (permissionName, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado',
                });
            }

            // Verificar si es el mismo usuario
            const targetId = req.params[paramName];
            if (targetId && String(req.user.id) === String(targetId)) {
                return next();
            }

            // Si no es el mismo usuario, verificar permiso
            return hasPermission(permissionName)(req, res, next);
        } catch (error) {
            console.error('Error en isSelfOrHasPermission:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al verificar acceso',
            });
        }
    };
};
