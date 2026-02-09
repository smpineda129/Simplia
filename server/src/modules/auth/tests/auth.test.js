import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';

// Set Env Vars BEFORE imports
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

// Mock Prisma
const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  modelHasPermission: {
    findMany: jest.fn(),
  },
  modelHasRole: {
    findMany: jest.fn(),
  },
  role: {
    findFirst: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
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

// Import app and request dynamically after mocking
const { default: app } = await import('../../../app.js');
const request = (await import('supertest')).default;

describe('Auth Module', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeAll(async () => {
    mockPrisma.user.deleteMany.mockResolvedValue({ count: 1 });
  });

  afterAll(async () => {
    mockPrisma.$disconnect.mockResolvedValue();
  });

  describe('POST /api/auth/register', () => {
    it('debe registrar un nuevo usuario', async () => {
      // Mock findFirst (check duplicates) -> null
      mockPrisma.user.findFirst.mockResolvedValue(null);
      // Mock create -> user
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        ...testUser,
        password: 'hashed_password',
        role: 'USER',
        companyId: null
      });
      // Mock getUserWithPermissions calls
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        ...testUser,
        password: 'hashed_password',
        role: 'USER',
        companyId: null,
        company: null
      });
      mockPrisma.modelHasPermission.findMany.mockResolvedValue([]);
      mockPrisma.modelHasRole.findMany.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('debe fallar con email duplicado', async () => {
      // Mock findFirst -> existing user
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 1,
        ...testUser,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe iniciar sesión con credenciales válidas', async () => {
      // Mock findFirst -> user found (for login)
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 1,
        ...testUser,
        password: 'hashed_password',
        role: 'USER',
        companyId: null,
        company: null
      });

       // Mock getUserWithPermissions calls
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        ...testUser,
        password: 'hashed_password',
        role: 'USER',
        companyId: null,
        company: null
      });
      mockPrisma.modelHasPermission.findMany.mockResolvedValue([]);
      mockPrisma.modelHasRole.findMany.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('debe fallar si el usuario no existe', async () => {
       mockPrisma.user.findFirst.mockResolvedValue(null);
       const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
