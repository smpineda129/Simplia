import notificationService from './notification.service.js';

class NotificationController {
  async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const { page, limit, unreadOnly } = req.query;
      
      const result = await notificationService.getByUserId(userId, {
        page,
        limit,
        unreadOnly: unreadOnly === 'true',
      });

      res.json({
        success: true,
        data: result.notifications,
        pagination: result.pagination,
        unreadCount: result.unreadCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.userId;
      const result = await notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      
      const notification = await notificationService.markAsRead(id, userId);

      res.json({
        success: true,
        message: 'Notificación marcada como leída',
        data: notification,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.userId;
      const result = await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      
      const result = await notificationService.delete(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteAll(req, res) {
    try {
      const userId = req.user.userId;
      const result = await notificationService.deleteAll(userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new NotificationController();
