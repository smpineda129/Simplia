import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';

// Set Env Vars BEFORE imports
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

// Mock Prisma
const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  },
  permission: {
    findFirst: jest.fn(),
  },
  modelHasPermission: {
    findMany: jest.fn().mockResolvedValue([]),
    findFirst: jest.fn(),
  },
  modelHasRole: {
    findMany: jest.fn().mockResolvedValue([]),
  },
  roleHasPermission: {
    findFirst: jest.fn(),
  },
  role: {
    findFirst: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $queryRaw: jest.fn().mockResolvedValue([]),
  $executeRaw: jest.fn().mockResolvedValue(1),
};

jest.unstable_mockModule('../../../db/prisma.js', () => ({
  prisma: mockPrisma,
}));

// Mock bcryptjs
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
  },
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock jsonwebtoken
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn().mockReturnValue({ userId: 1 }), // Always valid
    sign: jest.fn().mockReturnValue('mock-token'),
  },
  verify: jest.fn().mockReturnValue({ userId: 1 }),
  sign: jest.fn().mockReturnValue('mock-token'),
}));

// Import app dynamically
const { default: app } = await import('../../../app.js');
const request = (await import('supertest')).default;

describe('Users Module', () => {
  let authToken = 'mock-token';
  const adminUser = {
    id: 1,
    email: 'admin@gdi.com',
    password: 'hashed_password',
    name: 'Admin User',
    role: 'ADMIN',
    companyId: 1,
  };
  const adminRole = { name: 'ADMIN', roleLevel: 99 };
  const roleRelation = { roleId: 1, role: adminRole };

  beforeAll(async () => {
    // Setup generic mock responses
  });

  afterAll(async () => {
    mockPrisma.$disconnect.mockResolvedValue();
  });

  describe('GET /api/users', () => {
    it('debe obtener lista de usuarios', async () => {
      // Middleware authenticate lookup
      mockPrisma.user.findUnique.mockResolvedValue(adminUser);
      mockPrisma.modelHasRole.findMany.mockResolvedValue([roleRelation]);

      // Middleware permission lookup
      mockPrisma.permission.findFirst.mockResolvedValue({ id: 1, name: 'users.view' });
      mockPrisma.modelHasPermission.findFirst.mockResolvedValue(null);
      mockPrisma.roleHasPermission.findFirst.mockResolvedValue({ permissionId: 1, roleId: 1 });

      // Controller list lookup
      mockPrisma.user.findMany.mockResolvedValue([adminUser]);
      mockPrisma.user.count.mockResolvedValue(1);

      // UserRoleService getUserRoles (called by controller)
      mockPrisma.$queryRaw.mockResolvedValue([{ id: 1, name: 'ADMIN', roleLevel: 99 }]);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
     it('debe crear un nuevo usuario', async () => {
        // Prepare chained mocks for sequential calls

        mockPrisma.user.findUnique
            .mockResolvedValueOnce(adminUser) // 1. Auth
            .mockResolvedValueOnce(null);     // 2. Duplicate Check

        mockPrisma.modelHasRole.findMany
            .mockResolvedValueOnce([roleRelation]) // 1. Auth
            .mockResolvedValueOnce([roleRelation]) // 2. Permission
            .mockResolvedValueOnce([]);            // 3. Controller

        // Middleware permission
        mockPrisma.permission.findFirst.mockResolvedValue({ id: 2, name: 'users.create' });
        mockPrisma.modelHasPermission.findFirst.mockResolvedValue(null);
        mockPrisma.roleHasPermission.findFirst.mockResolvedValue({ permissionId: 2, roleId: 1 });

        // Create
        mockPrisma.user.create.mockResolvedValue({
           id: 2,
           email: 'new@example.com',
           name: 'New User',
           role: 'USER'
        });

        // Permissions for new user
        mockPrisma.modelHasPermission.findMany.mockResolvedValue([]);

        const response = await request(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
             email: 'new@example.com',
             password: 'password123', // Stronger password
             name: 'New User',
             role: 'USER'
          });

        if (response.status !== 201) {
            console.error('POST /api/users failed:', response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
     });
  });
});
