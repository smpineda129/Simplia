import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const tokenService = {
  generateAccessToken: (userId) => {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  },

  generateRefreshToken: (userId) => {
    return jwt.sign({ userId }, config.jwt.refreshSecret, {
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
};
