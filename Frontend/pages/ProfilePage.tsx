import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    User as UserIcon,
    Edit,
    Save,
    Shield,
    ChevronRight,
    Bell,
    HelpCircle,
    LogOut,
    Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProfileData {
    name: string;
    email: string;
    phone?: string;
    role: string;
    segment?: string;
    joinDate: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [editData, setEditData] = useState<Partial<ProfileData>>({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const fallbackProfile: ProfileData = {
                name: user?.name || 'Demo User',
                email: user?.email || 'demo@example.com',
                phone: '+91 98765 43210',
                role: user?.role || 'student',
                segment: user?.segment || 'budget-conscious',
                joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
            };

            setProfile(fallbackProfile);
            setEditData(fallbackProfile);
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setEditData(profile || {});
    };

    const handleCancel = () => {
        setEditing(false);
        setEditData(profile || {});
    };

    const handleSave = async () => {
        try {
            if (!editData.name?.trim()) {
                toast.error('Name is required');
                return;
            }
            const updatedProfile = { ...profile, ...editData } as ProfileData;
            setProfile(updatedProfile);
            updateUser({ name: editData.name, email: editData.email });
            setEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        }
    };

    if (loading || !profile) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-48 bg-white/50 rounded-3xl border border-gray-100"></div>
                <div className="h-64 bg-white/50 rounded-3xl border border-gray-100"></div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-8"
        >
            {/* Header Area */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your account and preferences</p>
                </div>
                {!editing ? (
                    <button onClick={handleEdit} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button onClick={handleCancel} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-colors flex items-center">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </button>
                    </div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column - User Card */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20"></div>
                        
                        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-4 relative z-10 shadow-xl border-4 border-white">
                            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {profile.name.charAt(0).toUpperCase()}
                            </span>
                            {editing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 relative z-10">{profile.name}</h2>
                        <span className="inline-block mt-2 text-xs font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full relative z-10">
                            {profile.role}
                        </span>
                        
                        <div className="mt-6 w-full space-y-3 relative z-10 text-left">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Email</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{profile.email}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{profile.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Forms & Settings */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                    
                    {/* Edit Form Area */}
                    {editing ? (
                        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <UserIcon className="w-5 h-5 mr-2 text-indigo-500" />
                                Personal Information
                            </h3>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editData.name || ''}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={editData.phone || ''}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={editData.email || ''}
                                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            {/* Preferences Grid */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                                    <Bell className="w-5 h-5 mr-2 text-indigo-500" />
                                    Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Push Notifications</p>
                                            <p className="text-xs text-gray-500 mt-1">Stay updated with alerts</p>
                                        </div>
                                        <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${notifications ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${notifications ? 'left-[26px]' : 'left-[2px]'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Dark Mode</p>
                                            <p className="text-xs text-gray-500 mt-1">Toggle appearance</p>
                                        </div>
                                        <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${darkMode ? 'left-[26px]' : 'left-[2px]'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Security & Configs */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-indigo-500" />
                                    Security & Access
                                </h3>
                                <div className="space-y-3">
                                    <button onClick={() => navigate('/profile/security/change-pin')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all group">
                                        <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">Change Access PIN</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                    <button onClick={() => navigate('/profile/settings/password')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all group">
                                        <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">Update Password</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support & Logout Section */}
                    <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={() => navigate('/profile/support')} className="w-full flex items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100/80 rounded-2xl font-bold text-indigo-700 transition-colors">
                                <HelpCircle className="h-5 w-5 mr-2" />
                                Support & FAQs
                            </button>
                            <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center justify-center p-4 bg-red-50 hover:bg-red-100/80 rounded-2xl font-bold text-red-600 transition-colors">
                                <LogOut className="h-5 w-5 mr-2" />
                                Secure Logout
                            </button>
                        </div>
                    </motion.div>

                </motion.div>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut className="h-8 w-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Sign Out</h3>
                            <p className="text-sm text-gray-500 mb-8 text-center font-medium">Are you sure you want to end your current session?</p>
                            <div className="space-y-3">
                                <button onClick={() => { setShowLogoutConfirm(false); logout(); }} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-colors">
                                    Yes, log me out
                                </button>
                                <button onClick={() => setShowLogoutConfirm(false)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfilePage;
