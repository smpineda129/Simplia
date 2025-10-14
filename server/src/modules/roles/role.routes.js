import express from 'express';
import roleController from './role.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, roleController.getAllRoles);
router.get('/:id', authenticate, roleController.getRoleById);
router.post('/', authenticate, roleController.createRole);
router.put('/:id', authenticate, roleController.updateRole);
router.delete('/:id', authenticate, roleController.deleteRole);
router.get('/:id/permissions', authenticate, roleController.getRolePermissions);
router.post('/:id/permissions/sync', authenticate, roleController.syncRolePermissions);

export default router;
