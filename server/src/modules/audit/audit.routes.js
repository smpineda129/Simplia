import { Router } from 'express';
import { getEvents, exportExcel, exportPdf } from './audit.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = Router();

// No global router.use(authenticate) to avoid potential confusion with other middlewares
router.get('/export/excel', authenticate, hasPermission('action.view'), exportExcel);
router.get('/export/pdf', authenticate, hasPermission('action.view'), exportPdf);
router.get('/', authenticate, hasPermission('action.view'), getEvents);

export default router;
