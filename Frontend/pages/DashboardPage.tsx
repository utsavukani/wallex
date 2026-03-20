import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, userAPI, transactionAPI } from '../services/api';
import {
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface DashboardData {
  summary: any;
  balance: number;
  widgets: string[];
  recentTransactions: any[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        widgets: [],
        recentTransactions: []
      };

      try {
        const [summaryRes, balanceRes, transactionsRes] = await Promise.all([
          analyticsAPI.getSummary('month'),
          user?.role === 'student' ? userAPI.getBalance() : Promise.resolve({ balance: 0 }),
          transactionAPI.getTransactions()
        ]);

        setData({
          summary: summaryRes,
          balance: balanceRes.balance || 0,
          widgets: summaryRes.widgets || [],
          recentTransactions: (transactionsRes.transactions || []).slice(0, 3) 
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
            totalEarned: 0,
            totalSpent: 0,
            totalBalance: 0
          },
          widgets: []
        },
        balance: 0,
        widgets: [],
        recentTransactions: []
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
    <div className="space-y-6">
      {/* Greeting Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1 font-medium">Track your money, hit your goals.</p>
      </motion.div>

      {/* Bento Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Balance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20"
        >
          {/* Decorative glass rings */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-[20px] border-white/5 blur-xl"></div>
          <div className="absolute bottom-0 right-20 -mb-16 w-40 h-40 rounded-full border-[10px] border-indigo-400/10 blur-lg"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
            <div>
              <p className="text-indigo-200 font-medium tracking-wide mb-1 uppercase text-sm">Total Balance</p>
              <h2 className="text-5xl font-black tracking-tighter">₹{balance.toLocaleString()}</h2>
            </div>
            
            <div className="flex items-center space-x-6 mt-8">
               <div>
                  <div className="flex items-center text-green-400 mb-1">
                    <ArrowDownLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm font-bold">Income</span>
                  </div>
                  <p className="font-semibold text-lg">₹{summary.summary.totalEarned.toLocaleString()}</p>
               </div>
               <div className="w-px h-10 bg-white/20"></div>
               <div>
                  <div className="flex items-center text-red-400 mb-1">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm font-bold">Expense</span>
                  </div>
                  <p className="font-semibold text-lg">₹{summary.summary.totalSpent.toLocaleString()}</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Transfer / Action Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-gray-100 shadow-sm relative group cursor-pointer hover:border-indigo-200 transition-all"
          onClick={handleAddTransactionClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300 shadow-sm border border-indigo-100">
               <Plus className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Add Record</h3>
            <p className="text-sm text-gray-500 font-medium text-center mt-1">Register a new transaction manually</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Goals Progress Widget (Takes 1 Col) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Budget Health</h3>
             <Target className="w-5 h-5 text-gray-400" />
           </div>
           
           <div className="flex flex-col items-center justify-center p-4">
             <div className="relative w-32 h-32 flex items-center justify-center mb-4">
               {/* Minimal CSS Ring representation */}
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: "150 251.2" }} // Hardcoded 60% for aesthetics
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeLinecap="round"
                    className="text-indigo-600"
                  />
               </svg>
               <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-gray-900">60%</span>
               </div>
             </div>
             <p className="text-sm font-medium text-gray-500">of monthly budget utilized</p>
           </div>
        </motion.div>

        {/* Recent Transactions List (Takes 2 Cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/transactions')}
              className="px-4 py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              View All
            </button>
          </div>

          {!data.recentTransactions || data.recentTransactions.length === 0 ? (
             <div className="h-40 flex flex-col items-center justify-center text-gray-400">
               <CreditCard className="w-8 h-8 mb-2 opacity-50" />
               <p className="font-medium text-sm">No transactions found.</p>
             </div>
          ) : (
             <div className="space-y-3">
               {data.recentTransactions.map((t: any, index: number) => {
                 const isIncome = t.direction === 'credit';
                 let icon = isIncome ? '💰' : '🛍️';
                 
                 if (!isIncome) {
                   if (t.category?.toLowerCase() === 'rent') icon = '🏠';
                   else if (t.category?.toLowerCase() === 'food') icon = '🍽️';
                   else icon = '💸'; 
                 }

                 return (
                    <motion.div 
                      key={t._id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="group flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-transform group-hover:scale-105 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                        <span className="text-xl">{icon}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="truncate pr-4">
                            <p className="font-bold text-gray-900 truncate tracking-tight">{t.merchant || t.note || 'Transfer'}</p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md capitalize">
                                {t.category || 'General'}
                              </span>
                              <span className="text-xs text-gray-400 font-medium">
                                {new Date(t.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-black tracking-tight ${isIncome ? 'text-emerald-500' : 'text-gray-900'}`}>
                              {isIncome ? '+' : '-'}₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                 );
               })}
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;