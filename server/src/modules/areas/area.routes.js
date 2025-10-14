import express from 'express';
import areaController from './area.controller.js';
import { createAreaValidation, updateAreaValidation, assignUsersValidation } from './area.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: Gestión de áreas/departamentos
 */

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Obtener todas las áreas
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o código
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         description: Filtrar por empresa
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de áreas
 */
router.get('/', authenticate, areaController.getAll);

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *     summary: Obtener área por ID
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Área encontrada
 *       404:
 *         description: Área no encontrada
 */
router.get('/:id', authenticate, areaController.getById);

/**
 * @swagger
 * /api/areas:
 *   post:
 *     summary: Crear nueva área
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               companyId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Área creada exitosamente
 */
router.post('/', authenticate, createAreaValidation, validate, areaController.create);

/**
 * @swagger
 * /api/areas/{id}:
 *   put:
 *     summary: Actualizar área
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Área actualizada exitosamente
 */
router.put('/:id', authenticate, updateAreaValidation, validate, areaController.update);

/**
 * @swagger
 * /api/areas/{id}:
 *   delete:
 *     summary: Eliminar área
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Área eliminada exitosamente
 */
router.delete('/:id', authenticate, areaController.delete);

/**
 * @swagger
 * /api/areas/{id}/users:
 *   post:
 *     summary: Asignar usuarios al área
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Usuarios asignados exitosamente
 */
router.post('/:id/users', authenticate, assignUsersValidation, validate, areaController.assignUsers);

/**
 * @swagger
 * /api/areas/{id}/users/{userId}:
 *   delete:
 *     summary: Remover usuario del área
 *     tags: [Areas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario removido exitosamente
 */
router.delete('/:id/users/:userId', authenticate, areaController.removeUser);

export default router;
