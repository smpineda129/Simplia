import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

const POLLING_INTERVAL = 30000; // 30 segundos

export const useNotifications = (options = {}) => {
  const { autoFetch = true, pollingEnabled = true } = options;
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getAll({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        unreadOnly: params.unreadOnly || false,
      });
      
      setNotifications(response.data || []);
      setPagination(response.pagination || pagination);
      setUnreadCount(response.unreadCount || 0);
      
      return response;
    } catch (err) {
      setError(err.message || 'Error al cargar notificaciones');
      return null;
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data?.unreadCount || 0);
      return response.data?.unreadCount || 0;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      return 0;
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      setError(err.message || 'Error al marcar como leída');
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      setError(err.message || 'Error al marcar todas como leídas');
      return false;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const notification = notifications.find((n) => n.id === notificationId);
      await notificationService.delete(notificationId);
      
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar notificación');
      return false;
    }
  }, [notifications]);

  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationService.deleteAll();
      
      setNotifications([]);
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar notificaciones');
      return false;
    }
  }, []);

  // Fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchUnreadCount();
    }
  }, [autoFetch, fetchUnreadCount]);

  // Polling para actualizar el contador
  useEffect(() => {
    if (!pollingEnabled) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [pollingEnabled, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    setPage: (page) => fetchNotifications({ page }),
  };
};

export default useNotifications;
