import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Plus, Save, ChevronDown } from 'lucide-react';
import { transactionAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const prettyCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-between mt-6 mb-2">
    <h3 className="text-gray-800 font-semibold">{title}</h3>
    <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
      <Calendar className="w-4 h-4 text-purple-700" />
    </button>
  </div>
);

const Row: React.FC<{ icon: React.ReactNode; title: string; time: string; sub: string; amount: string; income?: boolean; }>
  = ({ icon, title, time, sub, amount, income }) => (
    <div className="bg-white rounded-2xl p-4 flex items-center mb-3">
      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 text-xl">{icon}</div>
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-purple-700">{time}</p>
          </div>
          <div className="w-px h-8 bg-purple-200 mx-3"></div>
          <div className="text-right min-w-[80px]">
            <p className="text-sm text-gray-600">{sub}</p>
          </div>
          <div className="w-px h-8 bg-purple-200 mx-3"></div>
          <div className="text-right min-w-[110px]">
            <p className={`font-semibold ${income ? 'text-green-600' : 'text-purple-700'}`}>{amount}</p>
          </div>
        </div>
      </div>
    </div>
  );

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    title: '',
    message: ''
  });

  const categories = [
    'Food',
    'Transport',
    'Academic',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Travel',
    'Other'
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [txnRes, balRes] = await Promise.all([
        transactionAPI.getTransactions(),
        userAPI.getBalance()
      ]);
      
      const fetchedTxns = txnRes.transactions || [];
      setTransactions(fetchedTxns);
      setTotalBalance(balRes.balance || 0);

      // Calc mock income/expense locally based on fetched txns
      let inc = 0;
      let exp = 0;
      fetchedTxns.forEach((t: any) => {
        if (t.direction === 'credit') inc += t.amount;
        else exp += t.amount;
      });
      setIncome(inc);
      setExpense(exp);

    } catch (e) {
      console.error('Failed to load transaction data:', e);
      // fallback mock display if backend failed to block UI complete crash
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.title) {
      toast.error('Amount and Title are required');
      return;
    }

    setSubmitting(true);
    try {
      // Post to backend
      await transactionAPI.createTransaction({
        amount: Number(formData.amount),
        direction: 'debit',
        method: 'Cash',
        merchant: formData.title,
        note: formData.message,
        rawSource: 'manual',
        category: formData.category || undefined, // ML service will auto-categorize if undefined
        timestamp: new Date(formData.date).toISOString()
      });

      toast.success('Transaction added successfully!');
      setShowAddForm(false);
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: '',
        title: '',
        message: ''
      });

      // Reload list
      loadData();
    } catch (err: any) {
      toast.error('Failed to add transaction');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
        {/* Top Header */}
        <div className="bg-purple-600 text-white px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ArrowLeft className="h-6 w-6 mr-3 cursor-pointer" onClick={() => setShowAddForm(false)} />
              <h1 className="text-lg font-bold">Add Expenses</h1>
            </div>
          </div>
        </div>

        {/* Form Container (unchanged styling) */}
        <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-2 flex-1">
          <form onSubmit={handleAddSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select the category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Dinner, Groceries"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-purple-100 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Enter Message"
              />
            </div>

            <button disabled={submitting} type="submit" className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
              {submitting ? 'Saving...' : <><Save className="h-5 w-5 mr-2" />Save</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-purple-500">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-extrabold">Transaction</h1>
          <button className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-green-50 rounded-t-3xl -mt-2 px-5 pt-5 pb-28">
        {/* +Add Transaction panel (unchanged) */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center mb-6"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Transaction
        </button>
        {/* Balance summary */}
        <div className="bg-green-100 rounded-2xl p-4 text-center text-gray-900">
          <p className="text-sm font-semibold">Total Balance</p>
          <p className="text-3xl font-extrabold">{prettyCurrency(totalBalance)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-green-100 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">↗</span>
              <span className="font-semibold text-gray-700">Income</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{prettyCurrency(income)}</p>
          </div>
          <div className="bg-green-100 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">↘</span>
              <span className="font-semibold text-gray-700">Expense</span>
            </div>
            <p className="text-xl font-bold text-purple-700">{prettyCurrency(expense)}</p>
          </div>
        </div>

        {/* Render real data list */}
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">No transactions recorded yet.</div>
        )}

        {transactions.map((t, idx) => {
          const dateStr = new Date(t.timestamp).toLocaleDateString();
          const isIncome = t.direction === 'credit';
          const amt = isIncome ? prettyCurrency(t.amount) : `-${prettyCurrency(t.amount)}`;
          let icon = '🏷️';
          if (t.category === 'Food') icon = '🍽️';
          if (t.category === 'Transport') icon = '🚌';
          if (t.category === 'Shopping') icon = '🛍️';
          if (isIncome) icon = '💰';

          return (
             <Row 
               key={t._id || idx}
               icon={<span>{icon}</span>} 
               title={t.merchant || 'Unknown'} 
               time={dateStr} 
               sub={t.category || 'General'} 
               amount={amt} 
               income={isIncome} 
             />
          );
        })}

      </div>
    </div>
  );
};

export default TransactionsPage;