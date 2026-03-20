import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, Trash2, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
                    message: 'Reminder: Complete your savings goal for this month.',
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

            // Sort by date descending
            fallbackNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setNotifications(fallbackNotifications);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read', { icon: '✅' });
    };

    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success('Notification removed');
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'success':
                return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: <CheckCircle className="h-5 w-5" /> };
            case 'warning':
                return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: <AlertCircle className="h-5 w-5" /> };
            case 'info':
                return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', icon: <Info className="h-5 w-5" /> };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', icon: <Bell className="h-5 w-5" /> };
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Animation Variants
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto pb-24 lg:pb-8"
        >
            {/* Header Area */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 px-2 sm:px-0">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:shadow-sm hover:bg-gray-50 transition-all mr-4">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="ml-3 px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold border border-red-200">
                                    {unreadCount} New
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500 font-medium mt-1 text-sm">Stay updated with your financial activity.</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead} 
                        className="hidden sm:flex items-center text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark all as read
                    </button>
                )}
            </motion.div>

            {/* Content List */}
            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 min-h-[500px]">
                
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead} 
                        className="sm:hidden w-full flex items-center justify-center text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-3 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-colors mb-6"
                    >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark all as read
                    </button>
                )}

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-3xl" />)}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                            <Bell className="h-10 w-10 text-indigo-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h3>
                        <p className="text-gray-500 font-medium max-w-xs">No new notifications. We'll alert you when something important happens.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {notifications.map((notification) => {
                                const style = getNotificationColor(notification.type);
                                return (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                                        className={`group relative overflow-hidden rounded-[2rem] p-5 sm:p-6 cursor-pointer border-2 transition-all duration-300 flex gap-4 sm:gap-5 ${
                                            notification.isRead 
                                                ? 'bg-gray-50/50 border-transparent hover:bg-gray-50 hover:border-gray-100' 
                                                : 'bg-white border-indigo-100 shadow-[0_4px_20px_rgb(79,70,229,0.06)] hover:border-indigo-200'
                                        }`}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500 to-transparent opacity-5 rounded-bl-[4rem]" />
                                        )}
                                        
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border relative z-10 ${style.bg} ${style.text} ${style.border}`}>
                                            {style.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <p className={`text-sm sm:text-base leading-snug font-bold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'} line-clamp-2`}>
                                                    {notification.message}
                                                </p>
                                                
                                                {/* Delete Button */}
                                                <button 
                                                    onClick={(e) => deleteNotification(notification.id, e)}
                                                    className="flex-shrink-0 p-2 -mr-2 -mt-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors sm:opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-1 sm:mt-2">
                                                <p className="text-[10px] sm:text-xs font-bold tracking-wide text-gray-400">
                                                    {new Date(notification.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/50" />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default NotificationsPage;
