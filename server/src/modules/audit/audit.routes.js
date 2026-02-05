import { Router } from 'express';
import { getEvents, exportExcel, exportPdf } from './audit.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', hasPermission('action.view'), getEvents);
router.get('/export/excel', hasPermission('action.view'), exportExcel);
router.get('/export/pdf', hasPermission('action.view'), exportPdf);

export default router;
