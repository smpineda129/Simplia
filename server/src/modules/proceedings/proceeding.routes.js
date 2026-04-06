import express from 'express';
import proceedingController from './proceeding.controller.js';
import { createProceedingValidation, updateProceedingValidation } from './proceeding.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proceedings
 *   description: Gestión de expedientes documentales
 */

router.get('/', authenticate, hasPermission('proceeding.view'), proceedingController.getAll);
router.get('/:id', authenticate, hasPermission('proceeding.view'), proceedingController.getById);
router.post('/', authenticate, hasPermission('proceeding.create'), createProceedingValidation, validate, proceedingController.create);
router.put('/:id', authenticate, hasPermission('proceeding.update'), updateProceedingValidation, validate, proceedingController.update);
router.delete('/:id', authenticate, hasPermission('proceeding.delete'), proceedingController.delete);

// ─── Boxes ────────────────────────────────────────────────────────────────
router.post('/:id/boxes', authenticate, hasPermission('proceeding.update'), proceedingController.attachBox);
router.delete('/:id/boxes/:boxId', authenticate, hasPermission('proceeding.update'), proceedingController.detachBox);

// ─── External Users (Compartido con) ─────────────────────────────────────
router.post('/:id/external-users', authenticate, hasPermission('proceeding.update'), proceedingController.shareWithUser);
router.delete('/:id/external-users/:userId', authenticate, hasPermission('proceeding.update'), proceedingController.unshareWithUser);

// ─── Threads (Loans / Préstamos) ─────────────────────────────────────────
router.post('/:id/threads', authenticate, hasPermission('proceeding.update'), proceedingController.createThread);
router.delete('/:id/threads/:threadId', authenticate, hasPermission('proceeding.update'), proceedingController.deleteThread);

// ─── Documents ────────────────────────────────────────────────────────────
router.post('/:id/upload-document', authenticate, hasPermission('proceeding.update'), upload.single('file'), proceedingController.uploadDocument);
router.post('/:id/documents', authenticate, hasPermission('proceeding.update'), proceedingController.attachDocument);
router.delete('/:id/documents/:documentId', authenticate, hasPermission('proceeding.update'), proceedingController.detachDocument);

export default router;
