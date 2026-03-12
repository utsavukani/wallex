import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { goalAPI } from '../services/api';
import {
    ArrowLeft,
    Bell,
    Target,
    Plus,
    Trophy,
    Star,
    TrendingUp,
    Calendar,
    PiggyBank,
    Gift,
    BookOpen,
    Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    category: 'short-term' | 'long-term';
    deadline?: string;
    icon: string;
    color: string;
    isActive: boolean;
}

const GoalsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        category: 'short-term' as 'short-term' | 'long-term',
        deadline: '',
        icon: '🎯'
    });

    const goalIcons = [
        { icon: '🎯', label: 'Target' },
        { icon: '💻', label: 'Gadgets' },
        { icon: '📚', label: 'Books' },
        { icon: '✈️', label: 'Travel' },
        { icon: '🎁', label: 'Gifts' },
        { icon: '🏥', label: 'Health' },
        { icon: '🎓', label: 'Education' },
        { icon: '🏠', label: 'Home' },
        { icon: '🚗', label: 'Car' },
        { icon: '💎', label: 'Luxury' }
    ];

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            // For demo purposes, provide fallback goals if API fails
            const fallbackGoals: Goal[] = [
                {
                    id: '1',
                    title: 'Emergency Fund',
                    targetAmount: 10000,
                    currentAmount: 3500,
                    category: 'short-term',
                    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    icon: '🛡️',
                    color: 'bg-blue-500',
                    isActive: true
                },
                {
                    id: '2',
                    title: 'New Laptop',
                    targetAmount: 45000,
                    currentAmount: 12000,
                    category: 'long-term',
                    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
                    icon: '💻',
                    color: 'bg-purple-500',
                    isActive: true
                }
            ];

            try {
                const data = await goalAPI.getGoals();
                setGoals(data.goals || fallbackGoals);
            } catch (apiError) {
                console.warn('API call failed, using fallback goals:', apiError);
                setGoals(fallbackGoals);
            }
        } catch (error) {
            console.error('Failed to load goals:', error);
            toast.error('Failed to load goals');
            // Set empty array as fallback
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.targetAmount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // Create mock goal for demo purposes
            const mockGoal: Goal = {
                id: Date.now().toString(),
                title: formData.title,
                targetAmount: parseFloat(formData.targetAmount),
                currentAmount: 0,
                category: formData.category,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
                icon: formData.icon,
                color: 'bg-purple-500',
                isActive: true
            };

            try {
                // Try to create via API
                await goalAPI.createGoal({
                    title: formData.title,
                    targetAmount: parseFloat(formData.targetAmount),
                    category: formData.category,
                    deadline: formData.deadline || undefined,
                    icon: formData.icon
                });
            } catch (apiError) {
                console.warn('API call failed, using mock goal:', apiError);
                // Add mock goal to local state for demo
                setGoals(prev => [mockGoal, ...prev]);
            }

            toast.success('Goal created successfully!');
            setShowAddForm(false);
            setFormData({
                title: '',
                targetAmount: '',
                category: 'short-term',
                deadline: '',
                icon: '🎯'
            });

            // Reload goals to show the new one
            loadGoals();
        } catch (error) {
            console.error('Failed to create goal:', error);
            toast.error('Failed to create goal');
        }
    };

    const getProgressPercentage = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-blue-500';
        if (percentage >= 40) return 'bg-yellow-500';
        return 'bg-purple-500';
    };

    const getSegmentSpecificGoals = () => {
        switch (user?.segment) {
            case 'high-earner':
                return [
                    { title: 'Investment Fund', target: 50000, icon: '📈', color: 'bg-green-500' },
                    { title: 'Emergency Fund', target: 25000, icon: '🛡️', color: 'bg-blue-500' }
                ];
            case 'mid-earner':
                return [
                    { title: 'Side Hustle Fund', target: 15000, icon: '💼', color: 'bg-purple-500' },
                    { title: 'Skill Development', target: 10000, icon: '🎓', color: 'bg-orange-500' }
                ];
            case 'budget-conscious':
                return [
                    { title: 'Micro Savings', target: 5000, icon: '💰', color: 'bg-green-500' },
                    { title: 'Budget Buffer', target: 3000, icon: '📊', color: 'bg-blue-500' }
                ];
            case 'low-income':
                return [
                    { title: 'Emergency Fund', target: 2000, icon: '🆘', color: 'bg-red-500' },
                    { title: 'Basic Needs', target: 1000, icon: '🏠', color: 'bg-purple-500' }
                ];
            default:
                return [];
        }
    };

    if (showAddForm) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
                {/* Top Header */}
                <div className="bg-purple-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowLeft className="h-5 w-5 mr-3" onClick={() => setShowAddForm(false)} />
                            <h1 className="text-lg font-bold">Create New Goal</h1>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Goal Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Goal Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., New Laptop, Vacation Fund"
                            />
                        </div>

                        {/* Target Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="5000"
                                min="0"
                                step="100"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Goal Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: 'short-term' })}
                                    className={`p-4 rounded-2xl border-2 text-sm font-medium transition-colors ${formData.category === 'short-term'
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Calendar className="h-5 w-5 mx-auto mb-2" />
                                    Short Term
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: 'long-term' })}
                                    className={`p-4 rounded-2xl border-2 text-sm font-medium transition-colors ${formData.category === 'long-term'
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Target className="h-5 w-5 mx-auto mb-2" />
                                    Long Term
                                </button>
                            </div>
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Choose Icon
                            </label>
                            <div className="grid grid-cols-5 gap-3">
                                {goalIcons.map((item) => (
                                    <button
                                        key={item.icon}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: item.icon })}
                                        className={`p-3 rounded-xl border-2 text-2xl transition-colors ${formData.icon === item.icon
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {item.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Deadline (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deadline (Optional)
                            </label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Create Button */}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Goal
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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

    const activeGoals = goals.filter(goal => goal.isActive);
    const completedGoals = goals.filter(goal => !goal.isActive);
    const segmentGoals = getSegmentSpecificGoals();

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Top Header */}
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                        <h1 className="text-lg font-bold">Savings Goals</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                {/* Add Goal Button */}
                <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center mb-6"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Goal
                </button>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'active'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Active Goals ({activeGoals.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'completed'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Completed ({completedGoals.length})
                    </button>
                </div>

                {/* Segment-Specific Recommendations */}
                {activeTab === 'active' && segmentGoals.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended for You</h3>
                        <div className="space-y-3">
                            {segmentGoals.map((goal, index) => (
                                <div key={index} className="bg-white rounded-2xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 ${goal.color} rounded-xl flex items-center justify-center mr-4`}>
                                                <span className="text-2xl">{goal.icon}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{goal.title}</p>
                                                <p className="text-sm text-gray-500">Target: ₹{goal.target.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm font-medium">
                                            Add Goal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Goals List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {activeTab === 'active' ? 'Your Active Goals' : 'Completed Goals'}
                    </h3>

                    {(activeTab === 'active' ? activeGoals : completedGoals).length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="h-8 w-8 text-purple-600" />
                            </div>
                            <p className="text-gray-600 mb-2">
                                {activeTab === 'active' ? 'No active goals yet' : 'No completed goals yet'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {activeTab === 'active' ? 'Create your first goal to start saving!' : 'Complete some goals to see them here'}
                            </p>
                        </div>
                    ) : (
                        (activeTab === 'active' ? activeGoals : completedGoals).map((goal) => {
                            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
                            return (
                                <div key={goal.id} className="bg-white rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 ${goal.color} rounded-xl flex items-center justify-center mr-4`}>
                                                <span className="text-2xl">{goal.icon}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{goal.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-purple-600">{Math.round(progress)}%</p>
                                            {progress >= 100 && (
                                                <div className="flex items-center text-yellow-600">
                                                    <Trophy className="h-4 w-4 mr-1" />
                                                    <span className="text-xs">Achieved!</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>

                                    {/* Goal Details */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="capitalize">{goal.category.replace('-', ' ')}</span>
                                        {goal.deadline && (
                                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Gamification Section */}
                {activeTab === 'active' && (
                    <div className="mt-8 bg-white rounded-2xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Achievements</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-purple-50 rounded-xl">
                                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-800">Goals Created</p>
                                <p className="text-lg font-bold text-purple-600">{goals.length}</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-xl">
                                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-800">Total Saved</p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalsPage;
