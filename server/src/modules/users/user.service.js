import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import userRoleService from './userRole.service.js';

export const userService = {
  getAll: async (filters = {}) => {
    const users = await prisma.user.findMany({
      where: filters,
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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agregar roles de Spatie a cada usuario
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roles = await userRoleService.getUserRoles(user.id);
        return {
          ...user,
          roles: roles || [],
        };
      })
    );

    return usersWithRoles;
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

    return {
      ...user,
      roles: roles.map(r => r.name),
      allPermissions: permissions.map(p => p.name)
    };
  },

  create: async (userData) => {
    const { email, password, name, role } = userData;

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
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

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
};
