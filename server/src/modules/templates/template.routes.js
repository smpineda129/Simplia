import express from 'express';
import templateController from './template.controller.js';
import { createTemplateValidation, updateTemplateValidation } from './template.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: Gestión de plantillas con helpers dinámicos
 */

/**
 * @swagger
 * /api/templates/helpers:
 *   get:
 *     summary: Obtener helpers disponibles
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de helpers disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/helpers', authenticate, templateController.getHelpers);

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Obtener todas las plantillas
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Lista de plantillas
 */
router.get('/', authenticate, templateController.getAll);

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Obtener plantilla por ID
 *     tags: [Templates]
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
 *         description: Plantilla encontrada
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, templateController.getById);

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Crear nueva plantilla
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - companyId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *                 description: Contenido de la plantilla con sintaxis de helpers
 *               companyId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Plantilla creada exitosamente
 */
router.post('/', authenticate, createTemplateValidation, validate, templateController.create);

/**
 * @swagger
 * /api/templates/{id}:
 *   put:
 *     summary: Actualizar plantilla
 *     tags: [Templates]
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
 *         description: Plantilla actualizada exitosamente
 */
router.put('/:id', authenticate, updateTemplateValidation, validate, templateController.update);

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Eliminar plantilla
 *     tags: [Templates]
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
 *         description: Plantilla eliminada exitosamente
 */
router.delete('/:id', authenticate, templateController.delete);

/**
 * @swagger
 * /api/templates/{id}/process:
 *   post:
 *     summary: Procesar plantilla con datos
 *     tags: [Templates]
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
 *             properties:
 *               data:
 *                 type: object
 *                 description: Datos para procesar la plantilla
 *     responses:
 *       200:
 *         description: Plantilla procesada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     processedContent:
 *                       type: string
 */
router.post('/:id/process', authenticate, templateController.processTemplate);

export default router;
