import bcrypt from 'bcryptjs';
import { prisma } from '../../db/prisma.js';
import { tokenService } from '../../services/tokenService.js';
import { ApiError } from '../../utils/ApiError.js';

export const authService = {
  getUserWithPermissions: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
      },
    });

    if (!user) return null;

    // Manual fetch for permissions
    const modelId = userId;
    const modelType = 'App\\Models\\User';

    // Fetch Direct Permissions
    const directPermissions = await prisma.modelHasPermission.findMany({
      where: { modelId, modelType },
      include: { permission: true },
    });

    // Fetch Roles and their permissions
    const userRoles = await prisma.modelHasRole.findMany({
      where: { modelId, modelType },
      include: {
        role: {
          include: {
            roleHasPermissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    // Flatten permissions and roles
    const permissions = new Set();
    const roles = new Set();

    // Add direct permissions
    directPermissions.forEach(p => permissions.add(p.permission.name));

    // Add role permissions and role names
    userRoles.forEach(ur => {
      roles.add(ur.role.name);
      ur.role.roleHasPermissions.forEach(rhp => {
        permissions.add(rhp.permission.name);
      });
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      allPermissions: Array.from(permissions),
      roles: Array.from(roles)
    };
  },

  register: async (userData) => {
    const { email, password, name } = userData;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, 'El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    });

    const tokens = tokenService.generateTokenPair(user.id);

    // Fetch full user data including default permissions (if any)
    const fullUser = await authService.getUserWithPermissions(user.id);

    return {
      user: fullUser,
      ...tokens,
    };
  },

  login: async (credentials) => {
    const { email, password } = credentials;

    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null
      },
    });

    if (!user) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const tokens = tokenService.generateTokenPair(user.id);

    // Fetch user with permissions
    const fullUser = await authService.getUserWithPermissions(user.id);

    return {
      user: fullUser,
      ...tokens,
    };
  },

  refreshToken: async (refreshToken) => {
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token no proporcionado');
    }

    const decoded = tokenService.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new ApiError(401, 'Usuario no encontrado');
    }

    const accessToken = tokenService.generateAccessToken(user.id);

    return { accessToken };
  },

  getCurrentUser: async (userId) => {
    const user = await authService.getUserWithPermissions(userId);

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    return user;
  },
};
