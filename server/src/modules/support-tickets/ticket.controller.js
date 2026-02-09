import ticketService from './ticket.service.js';

const ticketController = {
  // Get all tickets
  getAll: async (req, res) => {
    try {
      const filters = {
        ...req.query,
        companyId: req.user.role === 'SUPER_ADMIN' ? req.query.companyId : req.user.companyId,
      };

      const result = await ticketService.getAll(filters);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Error getting tickets:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener tickets',
        error: error.message,
      });
    }
  },

  // Get my tickets (user's own tickets)
  getMyTickets: async (req, res) => {
    try {
      const filters = {
        ...req.query,
        userId: req.user.id,
      };

      const result = await ticketService.getAll(filters);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Error getting my tickets:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mis tickets',
        error: error.message,
      });
    }
  },

  // Get ticket by ID
  getById: async (req, res) => {
    try {
      const ticket = await ticketService.getById(req.params.id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket no encontrado',
        });
      }

      // Check permissions
      const canView = 
        req.user.role === 'SUPER_ADMIN' ||
        ticket.userId?.toString() === req.user.id.toString() ||
        ticket.assignedToId?.toString() === req.user.id.toString() ||
        ticket.companyId?.toString() === req.user.companyId?.toString();

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver este ticket',
        });
      }

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      console.error('Error getting ticket:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener ticket',
        error: error.message,
      });
    }
  },

  // Create ticket (authenticated)
  create: async (req, res) => {
    try {
      const ticket = await ticketService.create(req.body, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Ticket creado exitosamente',
        data: ticket,
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear ticket',
        error: error.message,
      });
    }
  },

  // Create anonymous PQRS (public)
  createAnonymous: async (req, res) => {
    try {
      const ticket = await ticketService.createAnonymous(req.body);
      
      res.status(201).json({
        success: true,
        message: 'PQRS enviado exitosamente. Recibirás una respuesta en el correo proporcionado.',
        data: {
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
        },
      });
    } catch (error) {
      console.error('Error creating anonymous PQRS:', error);
      res.status(500).json({
        success: false,
        message: 'Error al enviar PQRS',
        error: error.message,
      });
    }
  },

  // Update ticket
  update: async (req, res) => {
    try {
      const ticket = await ticketService.getById(req.params.id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket no encontrado',
        });
      }

      // Check permissions
      const canUpdate = 
        req.user.role === 'SUPER_ADMIN' ||
        ticket.assignedToId?.toString() === req.user.id.toString();

      if (!canUpdate) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar este ticket',
        });
      }

      const updatedTicket = await ticketService.update(req.params.id, req.body, req.user.id);
      
      res.json({
        success: true,
        message: 'Ticket actualizado exitosamente',
        data: updatedTicket,
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar ticket',
        error: error.message,
      });
    }
  },

  // Add comment
  addComment: async (req, res) => {
    try {
      const ticket = await ticketService.getById(req.params.id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket no encontrado',
        });
      }

      // Check permissions
      const canComment = 
        req.user.role === 'SUPER_ADMIN' ||
        ticket.userId?.toString() === req.user.id.toString() ||
        ticket.assignedToId?.toString() === req.user.id.toString() ||
        ticket.companyId?.toString() === req.user.companyId?.toString();

      if (!canComment) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para comentar en este ticket',
        });
      }

      const comment = await ticketService.addComment(req.params.id, req.body, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Comentario agregado exitosamente',
        data: comment,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
        success: false,
        message: 'Error al agregar comentario',
        error: error.message,
      });
    }
  },

  // Get statistics
  getStats: async (req, res) => {
    try {
      const filters = {
        companyId: req.user.role === 'SUPER_ADMIN' ? req.query.companyId : req.user.companyId,
      };

      const stats = await ticketService.getStats(filters);
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message,
      });
    }
  },

  // Delete ticket
  delete: async (req, res) => {
    try {
      await ticketService.delete(req.params.id);
      
      res.json({
        success: true,
        message: 'Ticket eliminado exitosamente',
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar ticket',
        error: error.message,
      });
    }
  },
};

export default ticketController;
