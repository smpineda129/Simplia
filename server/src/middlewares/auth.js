import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { getContext } from '../utils/context.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(`[Auth Middleware] Request for ${req.url} - Has Header: ${!!authHeader}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwt.secret);

    // Verificar si hay personificación
    const userId = decoded.impersonatorId
      ? parseInt(decoded.userId) // Usuario personificado
      : parseInt(decoded.userId); // Usuario normal

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Fetch Roles manually
    const userRoles = await prisma.modelHasRole.findMany({
      where: {
        modelId: user.id,
        modelType: 'App\\Models\\User',
      },
      include: {
        role: {
          select: {
            name: true,
            roleLevel: true
          }
        }
      },
    });

    user.roles = userRoles.map((ur) => ({
      name: ur.role.name,
      roleLevel: ur.role.roleLevel
    }));

    // Si no tiene roles en model_has_role, pero tiene un rol en la tabla User, intentar obtener su nivel
    if (user.roles.length === 0 && user.role) {
      const dbRole = await prisma.role.findFirst({
        where: { name: user.role }
      });
      if (dbRole) {
        user.roles.push({
          name: dbRole.name,
          roleLevel: dbRole.roleLevel
        });
      }
    }

    // 2. Fetch Permissions
    // Direct permissions
    const directPermissions = await prisma.modelHasPermission.findMany({
      where: {
        modelId: user.id,
        modelType: 'App\\Models\\User',
      },
      include: { permission: true },
    });

    // Role-based permissions
    const roleIds = userRoles.map((ur) => ur.roleId);
    let rolePermissions = [];
    if (roleIds.length > 0) {
      rolePermissions = await prisma.roleHasPermission.findMany({
        where: { roleId: { in: roleIds } },
        include: { permission: true },
      });
    }

    // Combine and unique permissions
    const permissionsSet = new Set([
      ...directPermissions.map(dp => dp.permission.name),
      ...rolePermissions.map(rp => rp.permission.name)
    ]);

    user.allPermissions = Array.from(permissionsSet);

    req.user = user;

    // Populate Context
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection.remoteAddress;

    const store = getContext();
    if (store) {
      store.set('user', user);
      store.set('ip', ip);
      store.set('userAgent', req.headers['user-agent']);
    }

    // Si hay personificación, también adjuntar el impersonador
    if (decoded.impersonatorId) {
      const impersonator = await prisma.user.findUnique({
        where: { id: parseInt(decoded.impersonatorId) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
      req.impersonator = impersonator;
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }

    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};
