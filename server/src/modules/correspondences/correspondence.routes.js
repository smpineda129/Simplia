import express from 'express';
import correspondenceController from './correspondence.controller.js';
import {
  createCorrespondenceValidation,
  updateCorrespondenceValidation,
  createThreadValidation,
  respondValidation,
} from './correspondence.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Correspondences
 *   description: Gestión de correspondencia con radicados automáticos
 */

router.get('/export', authenticate, hasPermission('correspondence.view'), correspondenceController.exportExcel);
router.get('/stats', authenticate, hasPermission('correspondence.view'), correspondenceController.getStats);
router.get('/area-users', authenticate, hasPermission('correspondence.view'), correspondenceController.getAreaUsers);
router.get('/company-users', authenticate, hasPermission('correspondence.view'), correspondenceController.getCompanyUsers);
router.get('/', authenticate, hasPermission('correspondence.view'), correspondenceController.getAll);
router.get('/:id', authenticate, hasPermission('correspondence.view'), correspondenceController.getById);

router.post('/', authenticate, hasPermission('correspondence.create'), createCorrespondenceValidation, validate, correspondenceController.create);
router.put('/:id', authenticate, hasPermission('correspondence.update'), updateCorrespondenceValidation, validate, correspondenceController.update);
router.delete('/:id', authenticate, hasPermission('correspondence.delete'), correspondenceController.delete);

router.post('/:id/threads', authenticate, hasPermission('correspondence.thread'), createThreadValidation, validate, correspondenceController.createThread);
router.delete('/:id/threads/:threadId', authenticate, hasPermission('correspondence.thread'), correspondenceController.deleteThread);

router.post('/:id/respond', authenticate, hasPermission('correspondence.create'), respondValidation, validate, correspondenceController.respond);
router.post('/:id/mark-delivered', authenticate, hasPermission('correspondence.update'), correspondenceController.markAsDelivered);

// ─── Document Folders ──────────────────────────────────────────────────────
router.post('/:id/folders', authenticate, hasPermission('correspondence.update'), correspondenceController.createFolder);
router.get('/:id/folders', authenticate, hasPermission('correspondence.view'), correspondenceController.getFolders);
router.delete('/:id/folders/:folderId', authenticate, hasPermission('correspondence.update'), correspondenceController.deleteFolder);

export default router;
