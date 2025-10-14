import { prisma } from '../../db/prisma.js';

class CompanyService {
  async getAll(filters = {}) {
    const { search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { identifier: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { users: true },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return {
      companies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const company = await prisma.company.findFirst({
      where: { id: parseInt(id), deletedAt: null },
      include: {
        users: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    return company;
  }

  async create(data) {
    const company = await prisma.company.create({
      data: {
        name: data.name,
        identifier: data.identifier,
        short: data.short,
        email: data.email,
        codeName: data.codeName,
        codeDescription: data.codeDescription,
        imageUrl: data.imageUrl,
        website: data.website,
        watermarkUrl: data.watermarkUrl,
        maxUsers: data.maxUsers || 10,
      },
    });

    return company;
  }

  async update(id, data) {
    const company = await prisma.company.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const updated = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        identifier: data.identifier,
        short: data.short,
        email: data.email,
        codeName: data.codeName,
        codeDescription: data.codeDescription,
        imageUrl: data.imageUrl,
        website: data.website,
        watermarkUrl: data.watermarkUrl,
        maxUsers: data.maxUsers,
      },
    });

    return updated;
  }

  async delete(id) {
    const company = await prisma.company.findFirst({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    // Soft delete
    await prisma.company.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return { message: 'Empresa eliminada correctamente' };
  }

  async getStats(id) {
    const company = await this.getById(id);

    const stats = {
      totalUsers: company._count.users,
      maxUsers: company.maxUsers,
      usersPercentage: company.maxUsers
        ? Math.round((company._count.users / company.maxUsers) * 100)
        : 0,
      activeUsers: await prisma.user.count({
        where: {
          companyId: parseInt(id),
          deletedAt: null,
        },
      }),
    };

    return stats;
  }
}

export default new CompanyService();
