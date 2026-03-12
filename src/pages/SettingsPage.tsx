import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    Bell,
    User,
    Shield,
    Moon,
    Sun,
    Smartphone,
    CreditCard,
    HelpCircle,
    LogOut,
    Settings,
    Eye,
    EyeOff,
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const getSegmentSpecificSettings = () => {
        switch (user?.segment) {
            case 'high-earner':
                return [
                    {
                        title: 'Investment Preferences',
                        description: 'Configure your investment goals and risk tolerance',
                        icon: <CreditCard className="h-5 w-5" />
                    },
                    {
                        title: 'Income Tracking',
                        description: 'Set up multiple income source tracking',
                        icon: <Smartphone className="h-5 w-5" />
                    }
                ];
            case 'mid-earner':
                return [
                    {
                        title: 'Side Hustle Settings',
                        description: 'Manage your part-time work preferences',
                        icon: <Smartphone className="h-5 w-5" />
                    },
                    {
                        title: 'Parent Communication',
                        description: 'Configure family sharing settings',
                        icon: <User className="h-5 w-5" />
                    }
                ];
            case 'budget-conscious':
                return [
                    {
                        title: 'Budget Alerts',
                        description: 'Set spending limits and alerts',
                        icon: <Bell className="h-5 w-5" />
                    },
                    {
                        title: 'Savings Automation',
                        description: 'Configure automatic savings rules',
                        icon: <CreditCard className="h-5 w-5" />
                    }
                ];
            case 'low-income':
                return [
                    {
                        title: 'Micro-Savings',
                        description: 'Set up small amount savings automation',
                        icon: <CreditCard className="h-5 w-5" />
                    },
                    {
                        title: 'Emergency Fund',
                        description: 'Configure emergency fund settings',
                        icon: <Shield className="h-5 w-5" />
                    }
                ];
            default:
                return [];
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Top Header */}
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-3" onClick={() => navigate(-1)} />
                        <h1 className="text-lg font-bold">Settings</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl font-bold text-purple-600">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                                {user?.segment?.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">General Settings</h3>

                    <div className="space-y-4">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {darkMode ? (
                                    <Moon className="h-5 w-5 text-purple-600 mr-3" />
                                ) : (
                                    <Sun className="h-5 w-5 text-yellow-600 mr-3" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-800">Dark Mode</p>
                                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'transform translate-x-6' : 'transform translate-x-1'
                                        }`}
                                ></div>
                            </button>
                        </div>

                        {/* Notifications Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Bell className="h-5 w-5 text-purple-600 mr-3" />
                                <div>
                                    <p className="font-medium text-gray-800">Notifications</p>
                                    <p className="text-sm text-gray-600">Receive app notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'transform translate-x-6' : 'transform translate-x-1'
                                        }`}
                                ></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Security</h3>

                    <div className="space-y-4">
                        {/* Change Password */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                onClick={handlePasswordChange}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Segment-Specific Settings */}
                {getSegmentSpecificSettings().length > 0 && (
                    <div className="bg-white rounded-2xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Personalized Settings</h3>

                        <div className="space-y-3">
                            {getSegmentSpecificSettings().map((setting, index) => (
                                <button
                                    key={index}
                                    className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="text-purple-600 mr-3">
                                            {setting.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-800">{setting.title}</p>
                                            <p className="text-sm text-gray-600">{setting.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Support & Help */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Support & Help</h3>

                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                            <div className="flex items-center">
                                <HelpCircle className="h-5 w-5 text-purple-600 mr-3" />
                                <span className="font-medium text-gray-800">Help & Support</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                            <div className="flex items-center">
                                <Shield className="h-5 w-5 text-purple-600 mr-3" />
                                <span className="font-medium text-gray-800">Privacy Policy</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 hover:bg-purple-50 rounded-xl transition-colors">
                            <div className="flex items-center">
                                <Settings className="h-5 w-5 text-purple-600 mr-3" />
                                <span className="font-medium text-gray-800">Terms of Service</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* App Info */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">App Information</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Version</span>
                            <span className="font-medium text-gray-800">1.0.0</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Build</span>
                            <span className="font-medium text-gray-800">2024.04.30</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Platform</span>
                            <span className="font-medium text-gray-800">React Native</span>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    Log Out
                </button>

                {/* Demo Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        This is a demo application. No real financial data is stored.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
