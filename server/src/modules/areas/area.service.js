import { prisma } from '../../db/prisma.js';

class AreaService {
  async getAll(filters = {}) {
    const { search, companyId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(companyId && { companyId: parseInt(companyId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [areas, total] = await Promise.all([
      prisma.area.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              short: true,
            },
          },
          _count: {
            select: { areaUsers: true },
          },
        },
      }),
      prisma.area.count({ where }),
    ]);

    return {
      areas,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const area = await prisma.area.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            short: true,
          },
        },
        areaUsers: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: { areaUsers: true },
        },
      },
    });

    if (!area) {
      throw new Error('Área no encontrada');
    }

    return area;
  }

  async create(data) {
    const area = await prisma.area.create({
      data: {
        name: data.name,
        code: data.code,
        companyId: parseInt(data.companyId),
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

    return area;
  }

  async update(id, data) {
    const area = await prisma.area.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!area) {
      throw new Error('Área no encontrada');
    }

    const updated = await prisma.area.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        code: data.code,
        ...(data.companyId && { companyId: parseInt(data.companyId) }),
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

    return updated;
  }

  async delete(id) {
    const area = await prisma.area.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!area) {
      throw new Error('Área no encontrada');
    }

    // Soft delete
    await prisma.area.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Área eliminada correctamente' };
  }

  async assignUsers(areaId, userIds) {
    const area = await this.getById(areaId);

    // Eliminar asignaciones anteriores (soft delete)
    await prisma.areaUser.updateMany({
      where: { areaId: parseInt(areaId), deletedAt: null },
      data: { deletedAt: new Date() },
    });

    // Crear nuevas asignaciones
    const assignments = await Promise.all(
      userIds.map((userId) =>
        prisma.areaUser.create({
          data: {
            areaId: parseInt(areaId),
            userId: parseInt(userId),
          },
        })
      )
    );

    return {
      message: 'Usuarios asignados correctamente',
      count: assignments.length,
    };
  }

  async removeUser(areaId, userId) {
    await prisma.areaUser.updateMany({
      where: {
        areaId: parseInt(areaId),
        userId: parseInt(userId),
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });

    return { message: 'Usuario removido del área' };
  }

  async assignArea(userId, areaId) {
    // Check if already assigned
    const existing = await prisma.areaUser.findFirst({
      where: {
        userId: parseInt(userId),
        areaId: parseInt(areaId),
        deletedAt: null
      }
    });

    if (existing) {
      return { message: 'El usuario ya pertenece a esta área' };
    }

    await prisma.areaUser.create({
      data: {
        userId: parseInt(userId),
        areaId: parseInt(areaId)
      }
    });

    return { message: 'Área asignada exitosamente' };
  }

  async removeArea(userId, areaId) {
    await prisma.areaUser.updateMany({
      where: {
        userId: parseInt(userId),
        areaId: parseInt(areaId),
        deletedAt: null
      },
      data: { deletedAt: new Date() }
    });

    return { message: 'Área removida exitosamente' };
  }
}

export default new AreaService();
