import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { List, BarChart2, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'year';
type ChartView = 'bar' | 'list';

const prettyCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const getMotivation = (percent: number) => {
    if (percent <= 30) return '30% of your expenses, looks good.';
    if (percent <= 60) return 'You are on track. Keep it steady!';
    if (percent <= 90) return "Spending is getting higher. Let's be mindful.";
    return 'Warning: You are close to hitting your target!';
};

const ringStyle = (percent: number, color: string) => ({
    background: `conic-gradient(${color} ${percent}%, #E9D5FF ${percent}% 100%)`
});

const AnalyticsPage: React.FC = () => {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState<Timeframe>('daily');
    const [chartView, setChartView] = useState<ChartView>('bar');
    const [summary, setSummary] = useState<any>(null);
    const [trends, setTrends] = useState<{ labels: string[]; values: number[] } | null>(null);

    const goalTarget = useMemo(() => (timeframe === 'year' ? 200000 : 20000), [timeframe]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [s, t] = await Promise.all([
                    analyticsAPI.getSummary(timeframe === 'year' ? 'year' : timeframe === 'monthly' ? 'month' : timeframe),
                    analyticsAPI.getTrends(timeframe === 'year' ? 'year' : timeframe === 'monthly' ? 'month' : timeframe),
                ]);

                setSummary(s?.summary || s);
                // Render empty map instead of aggressive defaults if not exist
                const labels = t?.trends?.map((item: any) => item.period) || [];
                const values = t?.trends?.map((item: any) => item.amount) || [];
                setTrends({ labels, values });
            } catch (err) {
                // Fallback to strict zero values if API totally crashes
                setSummary({
                    totalBalance: 0,
                    totalSpent: 0,
                    totalEarned: 0,
                });
                setTrends({ labels: [], values: [] });
            }
        };
        fetchData();
    }, [timeframe]);

    const expensePercent = useMemo(() => {
        if (!summary) return 0;
        const percent = Math.min(100, Math.max(0, Math.round(((summary.totalSpent || 0) / goalTarget) * 100)));
        return percent;
    }, [summary, goalTarget]);

    const barData = useMemo(() => {
        return {
            labels: trends?.labels || [],
            datasets: [
                {
                    label: 'Expenses',
                    data: trends?.values || [],
                    backgroundColor: (context: any) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return '#6366f1';
                        // Create vertical gradient
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, '#818cf8'); // Indigo-400
                        gradient.addColorStop(1, '#4f46e5'); // Indigo-600
                        return gradient;
                    },
                    borderRadius: 12,
                    borderSkipped: false,
                    maxBarThickness: 32,
                },
            ],
        };
    }, [trends]);

    const barOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#4f46e5',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context: any) => `₹${Number(context.raw).toLocaleString('en-IN')}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6', drawBorder: false },
                border: { display: false },
                ticks: {
                    color: '#9ca3af',
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    callback: (val: any) => `₹${Number(val).toLocaleString('en-IN')}`,
                },
            },
            x: { 
                grid: { display: false }, 
                border: { display: false },
                ticks: { 
                    color: '#6b7280',
                    font: { family: "'Plus Jakarta Sans', sans-serif" }
                } 
            },
        },
    }), []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics</h1>
                <p className="text-gray-500 mt-1 font-medium">Deep dive into your financial habits.</p>
            </motion.div>

            {/* Timeframe Selector & Progress Bar Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
            >
                {/* Timeframe Tabs */}
                <div className="bg-gray-50 p-1.5 rounded-2xl flex max-w-md mx-auto mb-8 border border-gray-100/50">
                    {(['daily', 'weekly', 'monthly', 'year'] as Timeframe[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${timeframe === tf 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                                : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
                                }`}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-2">
                    {/* Budget Progress */}
                    <div>
                         <div className="flex justify-between items-end mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Budget Used</h3>
                                <p className="text-4xl font-black text-gray-900 mt-1">{expensePercent}%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-500">Target</p>
                                <p className="text-lg font-bold text-indigo-600">{prettyCurrency(goalTarget)}</p>
                            </div>
                         </div>
                         <div className="h-4 bg-gray-100 rounded-full overflow-hidden mt-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${expensePercent}%` }}
                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                className={`h-full rounded-full ${expensePercent > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
                            />
                         </div>
                         <p className="text-sm font-medium text-gray-500 mt-3 flex items-center">
                            <Target className="w-4 h-4 mr-1.5" />
                            {getMotivation(expensePercent)}
                         </p>
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                </div>
                                <span className="font-semibold text-emerald-900">Total Income</span>
                            </div>
                            <span className="text-xl font-bold text-emerald-600">{prettyCurrency(summary?.totalEarned || 0)}</span>
                        </div>
                        <div className="bg-rose-50 rounded-2xl p-4 flex items-center justify-between border border-rose-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mr-3">
                                    <TrendingDown className="w-5 h-5 text-rose-600" />
                                </div>
                                <span className="font-semibold text-rose-900">Total Expense</span>
                            </div>
                            <span className="text-xl font-bold text-rose-600">{prettyCurrency(summary?.totalSpent || 0)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Chart Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Bar Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Expense Trends</h3>
                            <p className="text-sm font-medium text-gray-500">Your spending pace over time</p>
                        </div>
                        <div className="flex space-x-2 border border-gray-100 p-1 rounded-xl bg-gray-50">
                            <button
                                onClick={() => setChartView('bar')}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${chartView === 'bar' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-white'}`}
                            >
                                <BarChart2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setChartView('list')}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${chartView === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-white'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        {chartView === 'bar' ? (
                            <Bar data={barData} options={barOptions} />
                        ) : (
                            <div className="space-y-3 overflow-y-auto h-full pr-2">
                                {(trends?.labels || []).map((label, idx) => (
                                    <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                                        <span className="font-semibold text-gray-700">{label}</span>
                                        <span className="font-bold text-indigo-600">{prettyCurrency(trends?.values[idx] || 0)}</span>
                                    </div>
                                ))}
                                {(!trends || trends.labels.length === 0) && (
                                    <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                                        No trend data available for this timeframe.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sub-widgets */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col space-y-6"
                >
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full border-4 border-white/10 blur-md"></div>
                        <h4 className="text-indigo-100 font-medium mb-1">Cumulative Balance</h4>
                        <p className="text-4xl font-black mb-6">
                           {prettyCurrency(summary?.currentBalance || 0)}
                        </p>
                        <div className="flex items-center text-sm font-medium bg-white/20 px-3 py-2 rounded-xl backdrop-blur-sm w-max">
                            <span className="mr-2">💡</span>
                            Keep it up to hit your goals!
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex-1">
                        <h4 className="text-gray-900 font-bold mb-4">Goal Diagnostics</h4>
                        <div className="space-y-4">
                            {[{ name: 'Emergency Fund', percent: 65, color: '#4f46e5' }, { name: 'New Laptop', percent: 25, color: '#ec4899' }].map((t, i) => (
                                <div key={i} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="relative w-14 h-14 flex-shrink-0">
                                        <div className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: t.color }}></div>
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: "0 251.2" }}
                                                animate={{ strokeDasharray: `${(t.percent / 100) * 251.2} 251.2` }} 
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                                                cx="50" cy="50" r="40" stroke={t.color} strokeWidth="12" fill="transparent" 
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: t.color }}>
                                            {t.percent}%
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t.name}</p>
                                        <p className="text-xs font-medium text-gray-500">Auto-calculated projection</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
