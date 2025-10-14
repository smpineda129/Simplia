import { prisma } from '../../db/prisma.js';

export const reportsService = {
  getSummary: async () => {
    // Estadísticas de usuarios
    const totalUsers = await prisma.user.count();
    
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    // Estadísticas de inventario
    const totalInventoryItems = await prisma.inventoryItem.count();
    
    const totalInventoryQuantity = await prisma.inventoryItem.aggregate({
      _sum: {
        quantity: true,
      },
    });

    const totalInventoryValue = await prisma.inventoryItem.aggregate({
      _sum: {
        price: true,
      },
    });

    const inventoryByCategory = await prisma.inventoryItem.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      _sum: {
        quantity: true,
        price: true,
      },
    });

    // Items con bajo stock (menos de 10)
    const lowStockItems = await prisma.inventoryItem.count({
      where: {
        quantity: {
          lt: 10,
        },
      },
    });

    return {
      users: {
        total: totalUsers,
        byRole: usersByRole.map(role => ({
          role: role.role,
          count: role._count.role,
        })),
      },
      inventory: {
        totalItems: totalInventoryItems,
        totalQuantity: totalInventoryQuantity._sum.quantity || 0,
        totalValue: totalInventoryValue._sum.price || 0,
        lowStockItems,
        byCategory: inventoryByCategory.map(cat => ({
          category: cat.category,
          count: cat._count.category,
          totalQuantity: cat._sum.quantity || 0,
          totalValue: cat._sum.price || 0,
        })),
      },
      timestamp: new Date().toISOString(),
    };
  },

  getUsersReport: async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const stats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    return {
      users,
      stats: stats.map(s => ({
        role: s.role,
        count: s._count.role,
      })),
      total: users.length,
    };
  },

  getInventoryReport: async () => {
    const items = await prisma.inventoryItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const stats = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: items.reduce((sum, item) => sum + item.price, 0),
      averagePrice: items.length > 0 
        ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
        : 0,
    };

    return {
      items,
      stats,
    };
  },
};
