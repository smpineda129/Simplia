import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const tokenService = {
  generateAccessToken: (userId, impersonatorId = null) => {
    // Convertir BigInt a String para evitar errores de serialización
    const userIdStr = typeof userId === 'bigint' ? userId.toString() : userId;
    const payload = { userId: userIdStr };

    // Si hay un impersonatorId, agregarlo al payload
    if (impersonatorId) {
      const impersonatorIdStr = typeof impersonatorId === 'bigint' ? impersonatorId.toString() : impersonatorId;
      payload.impersonatorId = impersonatorIdStr;
    }

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  },

  generateRefreshToken: (userId) => {
    // Convertir BigInt a String para evitar errores de serialización
    const userIdStr = typeof userId === 'bigint' ? userId.toString() : userId;
    return jwt.sign({ userId: userIdStr }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  },

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
      throw new Error('Refresh token inválido o expirado');
    }
  },

  generateTokenPair: (userId) => {
    return {
      accessToken: tokenService.generateAccessToken(userId),
      refreshToken: tokenService.generateRefreshToken(userId),
    };
  },

  generateImpersonationToken: (impersonatorId, targetUserId) => {
    // Genera un token de acceso que incluye el ID del impersonador
    return tokenService.generateAccessToken(targetUserId, impersonatorId);
  },
};
