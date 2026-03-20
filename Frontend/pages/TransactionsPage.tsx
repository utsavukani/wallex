import React, { useState, useEffect } from 'react';

import { 
    Plus, 
    ArrowUpRight, 
    ArrowDownLeft,
    Calendar,
    ArrowLeft,
    Save, 
    ChevronDown, 
    Trash2, 
    FileText, 
    Coffee, 
    ShoppingBag, 
    Car, 
    HeartPulse, 
    GraduationCap 
} from 'lucide-react';
import { transactionAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const prettyCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const styles: Record<string, string> = {
    'Food': 'bg-orange-100 text-orange-700',
    'Transport': 'bg-blue-100 text-blue-700',
    'Shopping': 'bg-pink-100 text-pink-700',
    'Healthcare': 'bg-red-100 text-red-700',
    'Academic': 'bg-indigo-100 text-indigo-700',
    'Entertainment': 'bg-purple-100 text-purple-700',
    'Bills': 'bg-yellow-100 text-yellow-700',
    'Travel': 'bg-teal-100 text-teal-700',
  };
  const defaultStyle = 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${styles[category] || defaultStyle}`}>
      {category || 'General'}
    </span>
  );
};

const Row: React.FC<{ icon: React.ReactNode; title: string; time: string; sub: string; amount: string; income?: boolean; onDelete?: () => void; }>
  = ({ icon, title, time, sub, amount, income, onDelete }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-[1.5rem] p-4 flex items-center mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-inner ${income ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
         {icon}
      </div>
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg leading-tight">{title}</p>
            <p className="text-sm font-medium text-gray-400 mt-0.5">{time}</p>
          </div>
          
          <div className="hidden sm:block">
            <CategoryBadge category={sub} />
          </div>

          <div className="flex items-center justify-between sm:justify-end sm:min-w-[140px]">
            <span className="sm:hidden">
              <CategoryBadge category={sub} />
            </span>
            <div className="flex items-center space-x-4">
              <p className={`text-lg font-black ${income ? 'text-emerald-600' : 'text-gray-900'}`}>{amount}</p>
              {onDelete && (
                <button 
                  onClick={onDelete} 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

const TransactionsPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
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
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await transactionAPI.deleteTransaction(transactionToDelete);
      toast.success('Transaction deleted');
      setShowDeleteModal(false);
      setTransactionToDelete(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed to delete transaction');
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTransactionToDelete(null);
  };

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pb-20"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => setShowAddForm(false)} className="flex items-center text-gray-600 hover:text-indigo-600 font-semibold mb-2 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-1" /> Back to list
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add Record</h1>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleAddSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium transition-all"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium appearance-none transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Amount & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-black text-lg transition-all placeholder:font-medium placeholder:text-gray-400"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title / Merchant</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium transition-all"
                  placeholder="e.g., Starbucks, Amazon"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Optional Notes</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium resize-none transition-all"
                rows={3}
                placeholder="Any extra details..."
              />
            </div>

            <button disabled={submitting} type="submit" className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none mt-4">
              {submitting ? 'Saving...' : <><Save className="h-5 w-5 mr-3" /> Save Transaction</>}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Transactions</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage and review your activity.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gray-900 text-white py-3 px-6 rounded-2xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all flex items-center shadow-gray-900/20 whitespace-nowrap"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Record
        </button>
      </motion.div>

      {/* Summary Bento Grid */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden md:col-span-1 border border-indigo-700/50">
           <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full border-4 border-white/10 blur-sm"></div>
           <p className="text-indigo-200 font-bold mb-1 tracking-wide uppercase text-xs">Total Balance</p>
           <p className="text-4xl font-black">{prettyCurrency(totalBalance)}</p>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Income</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{prettyCurrency(income)}</p>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Expense</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{prettyCurrency(expense)}</p>
          </div>
        </div>
      </motion.div>

      {/* List Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-500" /> Recorded History
        </h3>

        {transactions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-gray-100 border-dashed">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <FileText className="w-8 h-8" />
             </div>
             <p className="text-gray-900 font-bold text-lg mb-1">No transactions yet</p>
             <p className="text-gray-500 font-medium">Click "Add Record" to log your first activity.</p>
          </div>
        )}

        <AnimatePresence>
          {transactions.map((t, idx) => {
            const dateStr = new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const isIncome = t.direction === 'credit';
            const amt = isIncome ? `+${prettyCurrency(t.amount)}` : `-${prettyCurrency(t.amount)}`;
            
            // Icon mapping
            let icon = <FileText className="w-6 h-6" />;
            if (t.category === 'Food') icon = <Coffee className="w-6 h-6" />;
            if (t.category === 'Transport') icon = <Car className="w-6 h-6" />;
            if (t.category === 'Shopping') icon = <ShoppingBag className="w-6 h-6" />;
            if (t.category === 'Healthcare') icon = <HeartPulse className="w-6 h-6" />;
            if (t.category === 'Academic') icon = <GraduationCap className="w-6 h-6" />;

            return (
              <Row
                key={t._id || idx}
                icon={icon}
                title={t.merchant || 'Unknown Payment'}
                time={dateStr}
                sub={t.category || ''}
                amount={amt}
                income={isIncome}
                onDelete={() => confirmDelete(t._id)}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white relative"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-center text-gray-900 mb-2">Delete Record?</h3>
              <p className="text-center text-gray-500 mb-8 font-medium">
                This action is irreversible. It will also update your total financial summaries.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3.5 px-4 bg-gray-50 text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-3.5 px-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;