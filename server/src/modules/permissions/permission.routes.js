import express from 'express';
import permissionController from './permission.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, permissionController.getAllPermissions);
router.get('/grouped', authenticate, permissionController.getGroupedPermissions);
router.get('/:id', authenticate, permissionController.getPermissionById);
router.post('/', authenticate, permissionController.createPermission);
router.put('/:id', authenticate, permissionController.updatePermission);
router.delete('/:id', authenticate, permissionController.deletePermission);
router.get('/:id/roles', authenticate, permissionController.getPermissionRoles);

export default router;
