import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    Bell,
    Users,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    Eye,
    BarChart3,
    Calendar,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AllowanceRequest {
    id: string;
    studentName: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    category: string;
}

interface StudentInsight {
    id: string;
    name: string;
    totalSpent: number;
    totalEarned: number;
    topCategory: string;
    topCategoryPercentage: number;
    recentTransactions: number;
    savingsProgress: number;
}

interface ExpenseCategory {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

const ParentPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'insights'>('overview');
    const [allowanceRequests, setAllowanceRequests] = useState<AllowanceRequest[]>([]);
    const [studentInsights, setStudentInsights] = useState<StudentInsight[]>([]);
    const [showRequestForm, setShowRequestForm] = useState(false);

    // Form state
    const [requestForm, setRequestForm] = useState({
        amount: '',
        reason: '',
        category: ''
    });

    const categories = [
        'Food & Dining',
        'Transport',
        'Academic',
        'Entertainment',
        'Shopping',
        'Bills & Utilities',
        'Healthcare',
        'Other'
    ];

    useEffect(() => {
        loadParentData();
    }, []);

    const loadParentData = async () => {
        // Simulate loading data
        const mockRequests: AllowanceRequest[] = [
            {
                id: '1',
                studentName: 'Rohit Kumar',
                amount: 2000,
                reason: 'Monthly allowance for April',
                status: 'pending',
                date: '2024-04-30',
                category: 'Monthly'
            },
            {
                id: '2',
                studentName: 'Aisha Patel',
                amount: 500,
                reason: 'Books for semester',
                status: 'approved',
                date: '2024-04-28',
                category: 'Academic'
            },
            {
                id: '3',
                studentName: 'Meera Singh',
                amount: 300,
                reason: 'Emergency medical expenses',
                status: 'rejected',
                date: '2024-04-25',
                category: 'Healthcare'
            }
        ];

        const mockInsights: StudentInsight[] = [
            {
                id: '1',
                name: 'Rohit Kumar',
                totalSpent: 8500,
                totalEarned: 12000,
                topCategory: 'Food & Dining',
                topCategoryPercentage: 62,
                recentTransactions: 15,
                savingsProgress: 75
            },
            {
                id: '2',
                name: 'Aisha Patel',
                totalSpent: 6200,
                totalEarned: 8000,
                topCategory: 'Academic',
                topCategoryPercentage: 45,
                recentTransactions: 12,
                savingsProgress: 60
            },
            {
                id: '3',
                name: 'Meera Singh',
                totalSpent: 4800,
                totalEarned: 6000,
                topCategory: 'Transport',
                topCategoryPercentage: 38,
                recentTransactions: 8,
                savingsProgress: 40
            }
        ];

        setAllowanceRequests(mockRequests);
        setStudentInsights(mockInsights);
    };

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!requestForm.amount || !requestForm.reason) {
            toast.error('Please fill in all required fields');
            return;
        }

        const newRequest: AllowanceRequest = {
            id: Date.now().toString(),
            studentName: user?.name || 'Student',
            amount: parseFloat(requestForm.amount),
            reason: requestForm.reason,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            category: requestForm.category || 'Other'
        };

        setAllowanceRequests([newRequest, ...allowanceRequests]);
        setShowRequestForm(false);
        setRequestForm({ amount: '', reason: '', category: '' });
        toast.success('Allowance request submitted!');
    };

    const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
        setAllowanceRequests(prev =>
            prev.map(req =>
                req.id === requestId
                    ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
                    : req
            )
        );

        toast.success(`Request ${action}d successfully!`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Food & Dining': 'bg-orange-500',
            'Transport': 'bg-blue-500',
            'Academic': 'bg-purple-500',
            'Entertainment': 'bg-pink-500',
            'Shopping': 'bg-green-500',
            'Bills & Utilities': 'bg-red-500',
            'Healthcare': 'bg-indigo-500',
            'Other': 'bg-gray-500'
        };
        return colors[category] || 'bg-gray-500';
    };

    if (showRequestForm) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
                {/* Top Header */}
                <div className="bg-purple-600 text-white px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowLeft className="h-5 w-5 mr-3" onClick={() => setShowRequestForm(false)} />
                            <h1 className="text-lg font-bold">Request Allowance</h1>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                    <form onSubmit={handleRequestSubmit} className="space-y-6">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={requestForm.amount}
                                onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="500"
                                min="0"
                                step="100"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={requestForm.category}
                                onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason
                            </label>
                            <textarea
                                value={requestForm.reason}
                                onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Explain why you need this allowance..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Submit Request
                        </button>
                    </form>
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
                        <ArrowLeft className="h-5 w-5 mr-3" onClick={() => navigate('/parent')} />
                        <h1 className="text-lg font-bold">Parent Portal</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4 flex-1">
                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-sm text-gray-600">Connected Students</p>
                            <p className="text-lg font-bold text-purple-600">3</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">Total Sent</p>
                            <p className="text-lg font-bold text-green-600">₹15,000</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <p className="text-sm text-gray-600">Pending Requests</p>
                            <p className="text-lg font-bold text-yellow-600">1</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'overview'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'requests'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'insights'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Insights
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Overview</h3>
                        {studentInsights.map((student) => (
                            <div key={student.id} className="bg-white rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-800">{student.name}</h4>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                            {student.savingsProgress}% saved
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-600">Total Spent</p>
                                        <p className="font-semibold text-red-600">₹{student.totalSpent.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total Earned</p>
                                        <p className="font-semibold text-green-600">₹{student.totalEarned.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <p className="text-xs text-gray-600 mb-1">Top Spending Category</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{student.topCategory}</span>
                                        <span className="text-sm text-gray-600">{student.topCategoryPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className={`h-2 rounded-full ${getCategoryColor(student.topCategory)}`}
                                            style={{ width: `${student.topCategoryPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{student.recentTransactions} recent transactions</span>
                                    <button className="text-purple-600 hover:text-purple-700">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Allowance Requests</h3>
                            <button
                                onClick={() => setShowRequestForm(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                New Request
                            </button>
                        </div>

                        {allowanceRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DollarSign className="h-8 w-8 text-purple-600" />
                                </div>
                                <p className="text-gray-600 mb-2">No allowance requests yet</p>
                                <p className="text-sm text-gray-500">Students can request allowances here</p>
                            </div>
                        ) : (
                            allowanceRequests.map((request) => (
                                <div key={request.id} className="bg-white rounded-2xl p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">{request.studentName}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                    {request.category}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(request.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-lg font-bold text-gray-800">₹{request.amount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleRequestAction(request.id, 'approve')}
                                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRequestAction(request.id, 'reject')}
                                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Insights Tab */}
                {activeTab === 'insights' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending Insights</h3>

                        {/* Overall Spending Analysis */}
                        <div className="bg-white rounded-2xl p-4 mb-4">
                            <h4 className="font-semibold text-gray-800 mb-3">This Month's Overview</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600">Total Sent to Students</p>
                                    <p className="text-lg font-bold text-purple-600">₹15,000</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Average per Student</p>
                                    <p className="text-lg font-bold text-green-600">₹5,000</p>
                                </div>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="bg-white rounded-2xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-3">Top Spending Categories</h4>
                            <div className="space-y-3">
                                {[
                                    { category: 'Food & Dining', amount: 6200, percentage: 41 },
                                    { category: 'Academic', amount: 3800, percentage: 25 },
                                    { category: 'Transport', amount: 2900, percentage: 19 },
                                    { category: 'Entertainment', amount: 2100, percentage: 14 }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 ${getCategoryColor(item.category)} rounded-full mr-3`}></div>
                                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{item.amount.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-gray-500 ml-2">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Alerts */}
                        <div className="bg-white rounded-2xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-3">Recent Alerts</h4>
                            <div className="space-y-3">
                                <div className="flex items-center p-3 bg-yellow-50 rounded-xl">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Rohit spent 62% on Food this week</p>
                                        <p className="text-xs text-yellow-600">Consider discussing budget allocation</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 bg-green-50 rounded-xl">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Aisha achieved 75% savings goal</p>
                                        <p className="text-xs text-green-600">Great progress on financial discipline</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentPage;
