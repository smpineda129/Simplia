import { Router } from 'express';
import { getEvents, exportExcel, exportPdf } from './audit.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Allow access if user has 'action_event.index' OR is Owner (handled in controller)
// We use a looser permission check here and filter in the controller,
// OR we can enforce 'action_event.index' for everyone.
// Assuming the user wants to allow regular users to see THEIR OWN events,
// we might not enforce 'action_event.index' globally if that permission is reserved for admins.
// However, the user said "check model.permission".
// I will apply 'action_event.index' but ensure regular users have it via their role if they are supposed to see it.
// If regular users don't have this permission, they will get 403.
// Given the requirement "allow viewing events... regular users only their company",
// I will rely on the controller logic for "data scope" but use the permission middleware for "feature access".
// If the user meant "check permission to ALLOW", I'll add it.
router.get('/', hasPermission('action_event.index'), getEvents);
router.get('/export/excel', hasPermission('action_event.index'), exportExcel);
router.get('/export/pdf', hasPermission('action_event.index'), exportPdf);

export default router;
