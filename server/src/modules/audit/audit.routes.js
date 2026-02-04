import { Router } from 'express';
import { getEvents, exportExcel, exportPdf } from './audit.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// We rely on the Controller to enforce "Owner vs Self" access logic.
// However, if we want to enforce that ONLY owners or people with specific permission can LIST ALL events, we use middleware.
// But for "Export my own events", we should allow it if authenticated.
// So we remove the strict `hasPermission` middleware here and let the controller handle granular access.
// If you want to strictly block users who shouldn't see ANYTHING, we can add a check, but `getEvents` filters by company/user anyway.

router.get('/', getEvents);
router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPdf);

export default router;
