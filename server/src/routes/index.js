import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import companyRoutes from '../modules/companies/company.routes.js';
import areaRoutes from '../modules/areas/area.routes.js';
import retentionRoutes from '../modules/retentions/retention.routes.js';
import correspondenceTypeRoutes from '../modules/correspondence-types/correspondenceType.routes.js';
import templateRoutes from '../modules/templates/template.routes.js';
import proceedingRoutes from '../modules/proceedings/proceeding.routes.js';
import correspondenceRoutes from '../modules/correspondences/correspondence.routes.js';
import documentRoutes from '../modules/documents/document.routes.js';
import entityRoutes from '../modules/entities/entity.routes.js';
import warehouseRoutes from '../modules/warehouses/warehouse.routes.js';
import roleRoutes from '../modules/roles/role.routes.js';
import permissionRoutes from '../modules/permissions/permission.routes.js';
import { authenticate } from '../middlewares/auth.js';
import { hasPermission } from '../middlewares/permission.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/areas', areaRoutes);
router.use('/retentions', retentionRoutes);
router.use('/correspondence-types', correspondenceTypeRoutes);
router.use('/templates', templateRoutes);
router.use('/proceedings', proceedingRoutes);
router.use('/correspondences', correspondenceRoutes);
router.use('/documents', documentRoutes);
router.use('/entities', entityRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Ruta de prueba para permisos
router.get('/test-permission', authenticate, hasPermission('user.view'), (req, res) => {
  res.json({
    success: true,
    message: 'Acceso autorizado: Tienes permiso para ver usuarios.',
    user: req.user.email
  });
});

export default router;
