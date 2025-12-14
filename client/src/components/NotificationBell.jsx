import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            // Recalculate unread count just in case
            const remainingUnread = notifications.filter(n => n._id !== id && !n.read).length;
            setUnreadCount(remainingUnread);
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500';
            case 'warning': return 'text-yellow-500';
            default: return 'text-blue-500';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1 text-gray-600 hover:text-blue-600 focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 ring-1 ring-black ring-opacity-5">
                    <div className="py-2 px-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-4 text-center text-gray-500 text-sm">
                                No notifications
                            </div>
                        ) : (
                            <ul>
                                {notifications.map(notification => (
                                    <li
                                        key={notification._id}
                                        onClick={() => !notification.read && markAsRead(notification._id)}
                                        className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer flex items-start ${!notification.read ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 ${getIconColor(notification.type)}`}>
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, notification._id)}
                                            className="text-gray-400 hover:text-red-500 ml-2"
                                            title="Delete"
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
