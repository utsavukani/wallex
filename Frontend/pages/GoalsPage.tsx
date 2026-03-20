import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { goalAPI } from '../services/api';
import { useApi } from '../hooks/useApi';
import { calculateProgressPercentage, formatCurrency } from '../utils/formatters';
import {
    ArrowLeft,
    Target,
    Plus,
    Trophy,
    Star,
    Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export interface LocalGoal {
    id?: string;
    _id?: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    category?: string;
    deadline?: string;
    icon?: string;
    color?: string;
    isActive?: boolean;
    status?: string;
}

const GoalsPage: React.FC = () => {
    const { user } = useAuth();
    
    // Modern global state management logic using Custom Hooks
    const { data: rawGoals, loading, execute: executeLoadGoals } = useApi(goalAPI.getGoals, []);
    const goals: LocalGoal[] = Array.isArray(rawGoals) ? rawGoals : (rawGoals as any)?.goals || [];

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
        executeLoadGoals();
    }, [executeLoadGoals]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.targetAmount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            try {
                // Try to create via API
                await goalAPI.createGoal({
                    title: formData.title,
                    targetAmount: parseFloat(formData.targetAmount),
                    type: 'Other', // Mapping short-term to generic backend type
                    deadline: formData.deadline || undefined,
                } as unknown as Partial<import('../types').Goal>);
            } catch (apiError) {
                throw apiError; 
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
            executeLoadGoals();
        } catch (error) {
            console.error('Failed to create goal:', error);
            toast.error('Failed to create goal');
        }
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
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="min-h-screen pb-20"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => setShowAddForm(false)} className="flex items-center text-gray-600 hover:text-indigo-600 font-semibold mb-2 transition-colors">
                            <ArrowLeft className="h-5 w-5 mr-1" /> Back to goals
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Goal</h1>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Goal Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Goal Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium transition-all"
                                    placeholder="e.g., New Laptop"
                                />
                            </div>

                            {/* Target Amount */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Target Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={formData.targetAmount}
                                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-black text-lg transition-all"
                                        placeholder="10000"
                                        min="0"
                                        step="100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Timeline
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: 'short-term' })}
                                    className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all flex flex-col items-center py-6 ${formData.category === 'short-term'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-[1.02] shadow-sm'
                                        : 'border-gray-100 text-gray-500 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <Calendar className="h-6 w-6 mb-2" />
                                    Short Term
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: 'long-term' })}
                                    className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all flex flex-col items-center py-6 ${formData.category === 'long-term'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-[1.02] shadow-sm'
                                        : 'border-gray-100 text-gray-500 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <Target className="h-6 w-6 mb-2" />
                                    Long Term
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Deadline (Optional) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Deadline (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium transition-all"
                                />
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Icon
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {goalIcons.slice(0, 5).map((item) => (
                                        <button
                                            key={item.icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: item.icon })}
                                            className={`h-12 w-full rounded-xl border-2 text-xl flex items-center justify-center transition-all ${formData.icon === item.icon
                                                ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                                : 'border-gray-100 hover:border-gray-300 bg-gray-50 text-gray-400 grayscale filter hover:grayscale-0'
                                                }`}
                                        >
                                            {item.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center mt-6"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Launch Goal
                        </button>
                    </form>
                </div>
            </motion.div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pb-20">
                <div className="animate-pulse">
                    <div className="h-16 bg-gray-100 rounded-2xl mb-4"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-100 rounded-2xl w-1/3"></div>
                        <div className="h-48 bg-gray-100 rounded-[2rem]"></div>
                    </div>
                </div>
            </div>
        );
    }

    const activeGoals = goals.filter((goal: LocalGoal) => goal.isActive || goal.status === 'active');
    const completedGoals = goals.filter((goal: LocalGoal) => goal.isActive === false || goal.status === 'completed');
    const segmentGoals = getSegmentSpecificGoals();

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Savings Goals</h1>
                    <p className="text-gray-500 mt-1 font-medium">Track your progress and build wealth.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gray-900 text-white py-3 px-6 rounded-2xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all flex items-center shadow-gray-900/20 whitespace-nowrap"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Goal
                </button>
            </motion.div>

            {/* Achievements Card Banner */}
            {activeTab === 'active' && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full border-4 border-white/20 blur-md"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/30 text-2xl shadow-inner">
                                <Trophy className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Goal Mastery</h3>
                                <p className="text-orange-100 font-medium text-sm mt-0.5">You have {goals.length} active missions</p>
                            </div>
                        </div>
                        <div className="flex space-x-4 bg-black/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 text-center items-center justify-between md:justify-center md:min-w-[300px]">
                            <div className="flex-1">
                                <p className="text-sm text-orange-100 font-medium">Total Saved</p>
                                <p className="text-2xl font-black">{formatCurrency(goals.reduce((sum: number, goal: LocalGoal) => sum + goal.currentAmount, 0))}</p>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div className="flex-1">
                                <p className="text-sm text-orange-100 font-medium">Unlocked</p>
                                <div className="flex items-center justify-center space-x-1 mt-1">
                                    <Star className="w-5 h-5 fill-white text-white" />
                                    <span className="text-xl font-bold">1/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Content Switcher */}
            <div className="flex justify-between items-center bg-gray-100 p-1 rounded-2xl w-max">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'active'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                >
                    Active ({activeGoals.length})
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ml-1 ${activeTab === 'completed'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                >
                    Completed ({completedGoals.length})
                </button>
            </div>

            {/* AI Recommendations */}
            {activeTab === 'active' && segmentGoals.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-2"
                >
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recommended For You</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {segmentGoals.map((goal, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white hover:border-indigo-100 transition-all hover:shadow-sm">
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 ${goal.color.replace('500', '100').replace('bg-', 'bg-').replace('text-', 'text-')} rounded-xl flex items-center justify-center mr-4 text-2xl filter saturate-150`}>
                                        {goal.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{goal.title}</p>
                                        <p className="text-sm font-medium text-gray-500">Target: {formatCurrency(goal.target)}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        setFormData({
                                            title: goal.title,
                                            targetAmount: goal.target.toString(),
                                            category: 'long-term',
                                            deadline: '',
                                            icon: goal.icon
                                        });
                                        setShowAddForm(true);
                                    }}
                                    className="bg-white px-5 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors w-full md:w-auto active:scale-95"
                                >
                                    Adopt Goal
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Goals Grid */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
            >
                <AnimatePresence>
                    {(activeTab === 'active' ? activeGoals : completedGoals).length === 0 ? (
                        <div className="col-span-full">
                            <div className="text-center py-16 bg-white rounded-[2rem] border border-gray-100 border-dashed">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Target className="w-8 h-8" />
                                </div>
                                <p className="text-gray-900 font-bold text-lg mb-1">
                                    {activeTab === 'active' ? 'No active missions' : 'No completed goals yet'}
                                </p>
                                <p className="text-gray-500 font-medium">
                                    {activeTab === 'active' ? 'Click "New Goal" to embark on a savings journey.' : 'Finish active goals to earn achievements.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        (activeTab === 'active' ? activeGoals : completedGoals).map((goal: LocalGoal, idx: number) => {
                            const progress = calculateProgressPercentage(goal.currentAmount, goal.targetAmount);
                            return (
                                <motion.div 
                                    key={goal._id || goal.id || idx.toString()}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:border-indigo-200 transition-all hover:shadow-md flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100 shadow-inner">
                                                {goal.icon}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-indigo-600">{Math.round(progress)}%</p>
                                                {progress >= 100 && (
                                                    <div className="flex items-center justify-end text-amber-500 font-bold tracking-tight bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50 mt-1">
                                                        <Trophy className="h-3 w-3 mr-1" />
                                                        <span className="text-[10px] uppercase">Goal Reached</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">{goal.title}</h3>
                                        <div className="flex items-center text-sm font-medium text-gray-500 mb-6">
                                            <span className="font-bold text-gray-900 mr-1">{formatCurrency(goal.currentAmount)}</span>
                                            / {formatCurrency(goal.targetAmount, false)}
                                        </div>
                                    </div>

                                    <div>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                className={`h-full rounded-full ${getProgressColor(progress)}`}
                                            ></motion.div>
                                        </div>

                                        {/* Footer tags */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{goal.category?.replace('-', ' ') || 'GOAL'}</span>
                                            {goal.deadline && (
                                                <span className="text-xs font-bold text-indigo-400 bg-indigo-50 px-2.5 py-1 rounded-md">
                                                    Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default GoalsPage;
