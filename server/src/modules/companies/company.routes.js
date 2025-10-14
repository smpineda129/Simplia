import express from 'express';
import companyController from './company.controller.js';
import { createCompanyValidation, updateCompanyValidation } from './company.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestión de empresas
 */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Obtener todas las empresas
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre, identificador o email
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
 *         description: Lista de empresas
 */
router.get('/', authenticate, companyController.getAll);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Obtener empresa por ID
 *     tags: [Companies]
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
 *         description: Empresa encontrada
 *       404:
 *         description: Empresa no encontrada
 */
router.get('/:id', authenticate, companyController.getById);

/**
 * @swagger
 * /api/companies/{id}/stats:
 *   get:
 *     summary: Obtener estadísticas de la empresa
 *     tags: [Companies]
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
 *         description: Estadísticas de la empresa
 */
router.get('/:id/stats', authenticate, companyController.getStats);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Crear nueva empresa
 *     tags: [Companies]
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
 *               - identifier
 *               - short
 *             properties:
 *               name:
 *                 type: string
 *               identifier:
 *                 type: string
 *               short:
 *                 type: string
 *               email:
 *                 type: string
 *               maxUsers:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 */
router.post('/', authenticate, createCompanyValidation, validate, companyController.create);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Actualizar empresa
 *     tags: [Companies]
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
 *         description: Empresa actualizada exitosamente
 */
router.put('/:id', authenticate, updateCompanyValidation, validate, companyController.update);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Eliminar empresa
 *     tags: [Companies]
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
 *         description: Empresa eliminada exitosamente
 */
router.delete('/:id', authenticate, companyController.delete);

export default router;
