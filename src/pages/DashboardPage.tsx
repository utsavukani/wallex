import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, userAPI, transactionAPI } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  Plus,
  Zap,
  PiggyBank,
  DollarSign,
  Car,
  Calendar,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardData {
  summary: any;
  balance: number;
  widgets: string[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('monthly');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // For demo purposes, provide fallback data if API calls fail
      const fallbackData = {
        summary: {
          summary: {
            totalEarned: 4000,
            totalSpent: 1187.40,
            totalBalance: 2812.60
          },
          widgets: []
        },
        balance: 2812.60,
        widgets: []
      };

      try {
        const [summaryRes, balanceRes] = await Promise.all([
          analyticsAPI.getSummary('month'),
          user?.role === 'student' ? userAPI.getBalance() : Promise.resolve({ balance: 0 })
        ]);

        setData({
          summary: summaryRes,
          balance: balanceRes.balance || 0,
          widgets: summaryRes.widgets || []
        });
      } catch (apiError) {
        console.warn('API calls failed, using fallback data:', apiError);
        // Use fallback data for demo purposes
        setData(fallbackData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');

      // Set fallback data even if everything fails
      setData({
        summary: {
          summary: {
            totalEarned: 4000,
            totalSpent: 1187.40,
            totalBalance: 2812.60
          },
          widgets: []
        },
        balance: 2812.60,
        widgets: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransactionClick = () => {
    navigate('/transactions');
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error || 'Failed to load dashboard data'}</p>
          {error && (
            <button
              onClick={loadDashboardData}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const { summary, balance, widgets } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
      {/* Top Section - Purple Background */}
      <div className="bg-purple-600 text-white px-4 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Hi, Welcome Back</h1>
          <p className="text-purple-100">Good Morning</p>
        </div>

        {/* Financial Summary Card */}
        <div className="bg-purple-500 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-purple-100">Total Balance</p>
                <p className="text-xl font-bold">₹{balance.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-white bg-opacity-20"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                <TrendingDown className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-purple-100">Total Expense</p>
                <p className="text-xl font-bold">-₹{summary.summary.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>30%</span>
              <span>₹20,000.00</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-white bg-opacity-20 rounded mr-2 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <span>30% Of Your Expenses, Looks Good.</span>
          </div>
        </div>

        {/* Savings and Revenue Card */}
        <div className="bg-purple-500 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mr-3">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Savings On Goals</p>
              </div>
            </div>
            <div className="w-px h-12 bg-white bg-opacity-20"></div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-purple-100">Revenue Last Week</p>
                  <p className="text-sm font-bold">₹{summary.summary.totalEarned.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full h-px bg-white bg-opacity-20"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xs">🍽️</span>
                </div>
                <div>
                  <p className="text-xs text-purple-100">Food Last Week</p>
                  <p className="text-sm font-bold text-purple-200">-₹100.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Light Background */}
      <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['daily', 'weekly', 'monthly'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600'
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>

          {/* Salary Transaction */}
          <div className="bg-white rounded-2xl p-4 flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Salary</p>
                  <p className="text-xs text-gray-500">18:27 - April 30</p>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-3"></div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Monthly</p>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-3"></div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{summary.summary.totalEarned.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Groceries Transaction */}
          <div className="bg-white rounded-2xl p-4 flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <span className="text-purple-600">🛍️</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Groceries</p>
                  <p className="text-xs text-gray-500">17:00 - April 24</p>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-3"></div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Pantry</p>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-3"></div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-₹100.00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Transaction */}
          <div className="bg-white rounded-2xl p-4 flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <span className="text-purple-600">🏠</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Rent</p>
                  <p className="text-xs text-gray-500">8:30 - April 15</p>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-3"></div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Rent</p>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-3"></div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-₹674.40</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <button
            onClick={handleAddTransactionClick}
            className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;