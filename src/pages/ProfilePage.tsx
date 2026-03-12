import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    User as UserIcon,
    Edit,
    Save,
    X,
    Shield,
    ChevronRight,
    Bell,
    Moon,
    Sun,
    HelpCircle,
    LogOut
} from 'lucide-react';
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
            // For demo purposes, provide fallback profile data
            const fallbackProfile: ProfileData = {
                name: user?.name || 'Demo User',
                email: user?.email || 'demo@example.com',
                phone: '+91 98765 43210',
                role: user?.role || 'student',
                segment: user?.segment || 'budget-conscious',
                joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days ago
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

            // Update profile data
            const updatedProfile = { ...profile, ...editData };
            setProfile(updatedProfile);

            // Update user context
            updateUser({
                name: editData.name,
                email: editData.email
            });

            setEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
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

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
                <div className="bg-purple-600 text-white px-4 py-3">
                    <div className="flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                        <h1 className="text-lg font-bold">Profile</h1>
                    </div>
                </div>
                <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                    <div className="text-center py-12">
                        <p className="text-gray-600">Failed to load profile</p>
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
                        <h1 className="text-lg font-bold">Profile</h1>
                    </div>
                    {!editing ? (
                        <button onClick={handleEdit} className="p-2">
                            <Edit className="h-5 w-5" />
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button onClick={handleSave} className="p-2">
                                <Save className="h-5 w-5" />
                            </button>
                            <button onClick={handleCancel} className="p-2">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1 space-y-6">
                {/* User Card */}
                <div className="bg-white rounded-3xl p-5 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-3xl font-bold text-purple-600">{profile.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
                        <p className="text-sm text-gray-600">ID: {user?.id || '—'}</p>
                    </div>
                </div>

                {/* Edit Profile Card */}
                <div className="bg-white rounded-3xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center mb-1">
                        <UserIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-semibold text-gray-800">Edit Profile</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={editData.name || ''}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={editData.email || ''}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={editData.phone || ''}
                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-3">
                                <div className="flex items-center">
                                    <Bell className="h-5 w-5 text-purple-600 mr-2" />
                                    <span className="text-sm font-medium text-gray-800">Push Notifications</span>
                                </div>
                                <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                            <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-3">
                                <div className="flex items-center">
                                    {darkMode ? <Moon className="h-5 w-5 text-purple-600 mr-2" /> : <Sun className="h-5 w-5 text-yellow-600 mr-2" />}
                                    <span className="text-sm font-medium text-gray-800">Dark Mode</span>
                                </div>
                                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                        </div>
                        <button onClick={handleSave} className="w-full bg-purple-600 text-white py-3 px-4 rounded-2xl font-medium hover:bg-purple-700 transition-colors">Update Profile</button>
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-white rounded-3xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center mb-1">
                        <Shield className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-semibold text-gray-800">Security</h3>
                    </div>
                    <button onClick={() => navigate('/profile/security/change-pin')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Change PIN</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    <button onClick={() => navigate('/profile/security/fingerprint')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Fingerprint</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    <button onClick={() => navigate('/profile/security/terms')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Terms & Conditions</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Settings Card */}
                <div className="bg-white rounded-3xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center mb-1">
                        <UserIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-semibold text-gray-800">Settings</h3>
                    </div>
                    <button onClick={() => navigate('/profile/settings/notifications')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Notification Preferences</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    <button onClick={() => navigate('/profile/settings/password')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Password Settings</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    <button onClick={() => navigate('/profile/settings/delete')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-red-600">Delete Account</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Help & Support */}
                <div className="bg-white rounded-3xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center mb-1">
                        <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-semibold text-gray-800">Help & Support</h3>
                    </div>
                    <button onClick={() => navigate('/profile/help')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Help Center (FAQs)</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    <button onClick={() => navigate('/profile/support')} className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                        <span className="text-gray-800">Online Support</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Logout */}
                <button onClick={() => setShowLogoutConfirm(true)} className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">End Session</h3>
                        <p className="text-sm text-gray-600 mb-6 text-center">Are you sure you want to log out?</p>
                        <div className="space-y-3">
                            <button onClick={() => { setShowLogoutConfirm(false); logout(); }} className="w-full bg-purple-600 text-white py-3 rounded-2xl font-medium">Yes, End Session</button>
                            <button onClick={() => setShowLogoutConfirm(false)} className="w-full bg-purple-100 text-purple-700 py-3 rounded-2xl font-medium">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
