import React, { useState, useEffect } from 'react';
import { FiX, FiBell, FiCheck, FiCheckCircle, FiCalendar, FiDollarSign, FiActivity, FiFileText, FiAlertCircle, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import api from '../api/api';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import '../styles/Pages.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'APPOINTMENT_REMINDER': return <FiCalendar className="notif-icon appointment" />;
      case 'APPOINTMENT_CONFIRMED': return <FiCheckCircle className="notif-icon confirmed" />;
      case 'APPOINTMENT_CANCELLED': return <FiX className="notif-icon cancelled" />;
      case 'LAB_RESULT_READY': return <FiActivity className="notif-icon lab" />;
      case 'PRESCRIPTION_READY': return <FiFileText className="notif-icon prescription" />;
      case 'BILL_GENERATED':
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_DUE': return <FiDollarSign className="notif-icon payment" />;
      case 'ADMISSION_ALERT':
      case 'DISCHARGE_ALERT': return <FiAlertCircle className="notif-icon alert" />;
      default: return <FiBell className="notif-icon default" />;
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'APPOINTMENT_REMINDER': return 'Appointment Reminder';
      case 'APPOINTMENT_CONFIRMED': return 'Appointment Confirmed';
      case 'APPOINTMENT_CANCELLED': return 'Appointment Cancelled';
      case 'LAB_RESULT_READY': return 'Lab Result Ready';
      case 'PRESCRIPTION_READY': return 'Prescription Ready';
      case 'BILL_GENERATED': return 'Bill Generated';
      case 'PAYMENT_RECEIVED': return 'Payment Received';
      case 'PAYMENT_DUE': return 'Payment Due';
      case 'ADMISSION_ALERT': return 'Admission Alert';
      case 'DISCHARGE_ALERT': return 'Discharge Alert';
      case 'SYSTEM_ALERT': return 'System Alert';
      default: return 'General';
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header pageTitle="Notifications" />
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header pageTitle="Notifications" />

        {/* Toolbar */}
        <div className="page-toolbar notifications-toolbar">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
          <div className="toolbar-actions">
            <button className="action-link" onClick={fetchNotifications}>
              <FiRefreshCw /> Refresh
            </button>
            {unreadCount > 0 && (
              <button className="action-link" onClick={markAllAsRead}>
                <FiCheck /> Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="page-content notifications-content">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <FiBell className="empty-icon" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className="notification-icon-wrapper">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <span className="notification-type">
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                      <span className="notification-time">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    {notification.scheduledFor && (
                      <p className="notification-scheduled">
                        <FiCalendar /> {new Date(notification.scheduledFor).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="action-btn mark-read"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
