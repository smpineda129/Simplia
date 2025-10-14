import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const inventoryService = {
  getAll: async (filters = {}) => {
    const where = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return items;
  },

  getById: async (id) => {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new ApiError(404, 'Item no encontrado');
    }

    return item;
  },

  create: async (itemData) => {
    const { name, quantity, category, price } = itemData;

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        quantity,
        category,
        price,
      },
    });

    return item;
  },

  update: async (id, data) => {
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new ApiError(404, 'Item no encontrado');
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data,
    });

    return item;
  },

  delete: async (id) => {
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      throw new ApiError(404, 'Item no encontrado');
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    return { message: 'Item eliminado exitosamente' };
  },

  getStats: async () => {
    const totalItems = await prisma.inventoryItem.count();
    
    const totalQuantity = await prisma.inventoryItem.aggregate({
      _sum: {
        quantity: true,
      },
    });

    const totalValue = await prisma.inventoryItem.aggregate({
      _sum: {
        price: true,
      },
    });

    const categories = await prisma.inventoryItem.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    return {
      totalItems,
      totalQuantity: totalQuantity._sum.quantity || 0,
      totalValue: totalValue._sum.price || 0,
      categories: categories.map(cat => ({
        category: cat.category,
        count: cat._count.category,
      })),
    };
  },
};
