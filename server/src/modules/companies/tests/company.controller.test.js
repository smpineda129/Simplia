import { jest } from '@jest/globals';

// Define the mock before importing the controller
const mockCompanyService = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getStats: jest.fn(),
};

// Use unstable_mockModule for ESM mocking of default exports
jest.unstable_mockModule('../company.service.js', () => ({
  default: mockCompanyService,
}));

describe('CompanyController', () => {
  let companyController;
  let req, res;
  let companyService;

  beforeAll(async () => {
    const module = await import('../company.controller.js');
    companyController = module.default;
    companyService = mockCompanyService;
  });

  beforeEach(() => {
    req = {
      user: {
        id: 1,
        companyId: 10,
        roles: [],
      },
      params: {},
      query: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should allow owner to see all companies', async () => {
      req.user.roles = [{ name: 'Owner', roleLevel: 1 }];
      companyService.getAll.mockResolvedValue({ companies: [], pagination: {} });

      await companyController.getAll(req, res);

      expect(companyService.getAll).toHaveBeenCalledWith(expect.objectContaining({}));
      expect(companyService.getAll.mock.calls[0][0].id).toBeUndefined();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should restrict non-owner to their own company', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      companyService.getAll.mockResolvedValue({ companies: [], pagination: {} });

      await companyController.getAll(req, res);

      expect(companyService.getAll).toHaveBeenCalledWith(expect.objectContaining({ id: 10 }));
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 403 for non-owner without companyId', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      req.user.companyId = null;

      await companyController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(companyService.getAll).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should allow owner to access any company', async () => {
      req.user.roles = [{ name: 'Owner', roleLevel: 1 }];
      req.params.id = 20;
      const mockCompany = { id: 20, name: 'Other Corp' };
      companyService.getById.mockResolvedValue(mockCompany);

      await companyController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCompany });
    });

    it('should allow user to access their own company', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      req.params.id = 10;
      const mockCompany = { id: 10, name: 'My Corp' };
      companyService.getById.mockResolvedValue(mockCompany);

      await companyController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCompany });
    });

    it('should deny access to other company for non-owner (before service call)', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      req.params.id = 20; // Different from user.companyId (10)

      await companyController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(companyService.getById).not.toHaveBeenCalled();
    });

    it('should return 404 if own company does not exist', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      req.params.id = 10; // Same ID
      companyService.getById.mockRejectedValue(new Error('Empresa no encontrada'));

      await companyController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getStats', () => {
     it('should deny access to other company stats for non-owner', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      req.params.id = 20;

      await companyController.getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(companyService.getStats).not.toHaveBeenCalled();
     });

     it('should allow access to own company stats', async () => {
      req.user.roles = [{ name: 'User', roleLevel: 2 }];
      req.params.id = 10;
      companyService.getStats.mockResolvedValue({ totalUsers: 5 });

      await companyController.getStats(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
     });
  });
});
