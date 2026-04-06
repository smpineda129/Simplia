import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRoleService from './userRole.service.js';
import { presignUser } from '../../utils/s3Presign.js';
import { config } from '../../config/env.js';
import emailService from '../../utils/emailService.js';
import { setPasswordEmailTemplate } from '../../templates/setPasswordEmail.js';

export const userService = {
  getAll: async (filters = {}) => {
    const { search, role, page = 1, limit = 10, companyId } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: BigInt(companyId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && {
        modelHasRoles: {
          some: {
            role: { name: role },
            modelType: 'App\\Models\\User',
          },
        },
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          avatar: true,
          companyId: true,
          company: {
            select: {
              id: true,
              name: true,
              short: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Agregar roles de Spatie a cada usuario y generar pre-signed URLs
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roles = await userRoleService.getUserRoles(user.id);
        const presigned = await presignUser(user);
        return {
          ...presigned,
          roles: roles.map(r => ({
            name: r.name,
            roleLevel: r.role_level || r.roleLevel
          })) || [],
        };
      })
    );

    return {
      users: usersWithRoles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  },

  getById: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        locale: true,
        signature: true,
        avatar: true,
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        areaUsers: {
          where: { deletedAt: null },
          select: {
            area: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    // Fetch granular roles and permissions
    const roles = await userRoleService.getUserRoles(parseInt(id));
    const permissions = await userRoleService.getUserPermissions(parseInt(id));

    const presigned = await presignUser(user);

    return {
      ...presigned,
      roles: roles.map(r => ({
        name: r.name,
        roleLevel: r.role_level || r.roleLevel
      })),
      allPermissions: permissions.map(p => p.name)
    };
  },

  create: async (userData) => {
    const { email, password, name, role, roleId, companyId } = userData;

    const existingUser = await prisma.user.findUnique({
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
        role: role || 'USER',
        companyId: companyId ? BigInt(companyId) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    // If roleId is provided, assign the role using Spatie system
    if (roleId) {
      await userRoleService.assignRole(parseInt(user.id), parseInt(roleId));
    }

    return user;
  },

  update: async (id, data) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new ApiError(400, 'El correo electrónico ya está en uso');
      }
    }

    const updateData = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  },

  delete: async (id) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Usuario eliminado exitosamente' };
  },

  sendSetPasswordEmail: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, name: true, email: true, company: { select: { name: true } } },
    });

    if (!user) throw new ApiError(404, 'Usuario no encontrado');
    if (!user.email) throw new ApiError(400, 'El usuario no tiene email registrado');

    const token = jwt.sign(
      { userId: user.id.toString(), purpose: 'set-password' },
      config.jwt.secret,
      { expiresIn: '48h' }
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const setPasswordUrl = `${clientUrl}/set-password?token=${token}`;
    const companyName = user.company?.name || 'Simplia';

    const emailHtml = setPasswordEmailTemplate({
      userName: user.name,
      setPasswordUrl,
      companyName,
      logoUrl: `${clientUrl}/Horizontal_Logo.jpeg`,
      expiresInHours: 48,
    });

    await emailService.send({
      to: user.email,
      subject: `Establece tu contraseña — ${companyName}`,
      html: emailHtml,
    });

    return { message: 'Email enviado exitosamente' };
  },

  setPasswordWithToken: async (token, newPassword) => {
    let payload;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch {
      throw new ApiError(400, 'El enlace es inválido o ha expirado');
    }

    if (payload.purpose !== 'set-password') {
      throw new ApiError(400, 'Token inválido');
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.userId) },
    });

    if (!user) throw new ApiError(404, 'Usuario no encontrado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: parseInt(payload.userId) },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña establecida exitosamente' };
  },
};
