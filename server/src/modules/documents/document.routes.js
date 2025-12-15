import express from 'express';
import documentController from './document.controller.js';
import { createDocumentValidation, updateDocumentValidation } from './document.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestión de documentos digitales y físicos
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Obtener todos los documentos
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre
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
 *         description: Lista de documentos
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authenticate, documentController.getAll);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Obtener documento por ID
 *     tags: [Documents]
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
 *         description: Documento encontrado
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, documentController.getById);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Crear nuevo documento
 *     tags: [Documents]
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
 *               - companyId
 *               - medium
 *             properties:
 *               name:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               medium:
 *                 type: string
 *                 enum: [digital, physical]
 *               file:
 *                 type: string
 *               documentDate:
 *                 type: string
 *                 format: date
 *               meta:
 *                 type: object
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Documento creado exitosamente
 */
router.post('/', authenticate, createDocumentValidation, validate, documentController.create);

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Actualizar documento
 *     tags: [Documents]
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
 *         description: Documento actualizado exitosamente
 */
router.put('/:id', authenticate, updateDocumentValidation, validate, documentController.update);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Eliminar documento
 *     tags: [Documents]
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
 *         description: Documento eliminado exitosamente
 */
router.delete('/:id', authenticate, documentController.delete);

export default router;
