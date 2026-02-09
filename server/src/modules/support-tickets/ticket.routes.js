import { Router } from 'express';
import ticketController from './ticket.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { hasPermission } from '../../middlewares/permission.middleware.js';

const router = Router();

// Public route - Create anonymous PQRS
router.post('/public/pqrs', ticketController.createAnonymous);

// Authenticated routes
router.use(authenticate);

// Get statistics
router.get('/stats', ticketController.getStats);

// Get my tickets
router.get('/my-tickets', ticketController.getMyTickets);

// Get all tickets (admin)
router.get('/', hasPermission('ticket.view'), ticketController.getAll);

// Get ticket by ID
router.get('/:id', ticketController.getById);

// Create ticket
router.post('/', ticketController.create);

// Update ticket
router.put('/:id', ticketController.update);

// Add comment to ticket
router.post('/:id/comments', ticketController.addComment);

// Delete ticket
router.delete('/:id', hasPermission('ticket.delete'), ticketController.delete);

export default router;
