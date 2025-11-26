import bcrypt from 'bcryptjs';
import { prisma } from '../../db/prisma.js';
import { tokenService } from '../../services/tokenService.js';
import { ApiError } from '../../utils/ApiError.js';

export const authService = {
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

    const tokens = tokenService.generateTokenPair(user.id);

    // Remover password del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
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

    if (!user) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Credenciales inválidas');
    }

    const tokens = tokenService.generateTokenPair(user.id);

    // Remover password del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
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

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    // Remover password del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },
};
