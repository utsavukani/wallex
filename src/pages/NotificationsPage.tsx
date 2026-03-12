import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    date: string;
    isRead: boolean;
}

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            // For demo purposes, provide fallback notifications
            const fallbackNotifications: Notification[] = [
                {
                    id: '1',
                    message: '🎉 You saved ₹500 this week! Great job!',
                    type: 'success',
                    date: new Date().toISOString(),
                    isRead: false
                },
                {
                    id: '2',
                    message: 'Reminder: Complete your savings goal for this month',
                    type: 'warning',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    isRead: false
                },
                {
                    id: '3',
                    message: 'New financial education article available: "Budgeting Basics"',
                    type: 'info',
                    date: new Date(Date.now() - 172800000).toISOString(),
                    isRead: true
                },
                {
                    id: '4',
                    message: 'Your monthly spending is 15% below budget. Keep it up!',
                    type: 'success',
                    date: new Date(Date.now() - 259200000).toISOString(),
                    isRead: true
                }
            ];

            setNotifications(fallbackNotifications);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <Bell className="h-5 w-5 text-purple-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
                <div className="animate-pulse">
                    <div className="h-16 bg-purple-600"></div>
                    <div className="p-4 space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Top Header */}
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                        <h1 className="text-lg font-bold">Notifications</h1>
                    </div>
                    <Bell className="h-5 w-5" />
                </div>
            </div>

            {/* Content */}
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-gray-600 mb-2">No notifications yet</p>
                        <p className="text-sm text-gray-500">You'll see important updates here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-2xl p-4 ${!notification.isRead ? 'border-l-4 border-purple-500' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(notification.date).toLocaleDateString()} at{' '}
                                            {new Date(notification.date).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
