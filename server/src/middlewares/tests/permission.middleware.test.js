import { describe, it, expect, beforeEach, jest } from '@jest/globals';

const mockPrisma = {
  permission: { findFirst: jest.fn() },
  modelHasPermission: { findFirst: jest.fn() },
  modelHasRole: { findMany: jest.fn() },
  roleHasPermission: { findFirst: jest.fn() },
};

jest.unstable_mockModule('../../db/prisma.js', () => ({
  prisma: mockPrisma,
}));

const { hasPermission, isSelfOrHasPermission } = await import('../permission.middleware.js');

describe('Permission Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Reset mocks
    mockPrisma.permission.findFirst.mockReset();
    mockPrisma.modelHasPermission.findFirst.mockReset();
    mockPrisma.modelHasRole.findMany.mockReset();
    mockPrisma.roleHasPermission.findFirst.mockReset();
  });

  describe('hasPermission', () => {
    it('should return 401 if not authenticated', async () => {
      req.user = undefined;
      const middleware = hasPermission('test.view');
      await middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should allow access if user has direct permission', async () => {
      mockPrisma.permission.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.modelHasPermission.findFirst.mockResolvedValue({ permissionId: 1 });

      const middleware = hasPermission('test.view');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access if user has role permission', async () => {
      mockPrisma.permission.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.modelHasPermission.findFirst.mockResolvedValue(null);
      mockPrisma.modelHasRole.findMany.mockResolvedValue([{ roleId: 10 }]);
      mockPrisma.roleHasPermission.findFirst.mockResolvedValue({ permissionId: 1 });

      const middleware = hasPermission('test.view');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access if no permission found', async () => {
      mockPrisma.permission.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.modelHasPermission.findFirst.mockResolvedValue(null);
      mockPrisma.modelHasRole.findMany.mockResolvedValue([{ roleId: 10 }]);
      mockPrisma.roleHasPermission.findFirst.mockResolvedValue(null);

      const middleware = hasPermission('test.view');
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isSelfOrHasPermission', () => {
    it('should allow access if user is self', async () => {
      req.params.id = '1'; // same as req.user.id

      const middleware = isSelfOrHasPermission('test.view');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      // Should NOT call prisma
      expect(mockPrisma.permission.findFirst).not.toHaveBeenCalled();
    });

    it('should check permission if user is NOT self', async () => {
      req.params.id = '999';

      // Mock permission check success
      mockPrisma.permission.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.modelHasPermission.findFirst.mockResolvedValue({ permissionId: 1 });

      const middleware = isSelfOrHasPermission('test.view');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
