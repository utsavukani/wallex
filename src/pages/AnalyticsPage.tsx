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
    Legend,
} from 'chart.js';
import { Calendar, List, Search, BarChart2, TrendingDown, TrendingUp } from 'lucide-react';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [summary, setSummary] = useState<any>(null);
    const [trends, setTrends] = useState<{ labels: string[]; values: number[] } | null>(null);

    const goalTarget = useMemo(() => (timeframe === 'year' ? 200000 : 20000), [timeframe]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [s, t] = await Promise.all([
                    analyticsAPI.getSummary(timeframe === 'year' ? 'year' : timeframe === 'monthly' ? 'month' : timeframe),
                    analyticsAPI.getTrends(timeframe === 'year' ? 'year' : timeframe === 'monthly' ? 'month' : timeframe),
                ]);

                setSummary(s?.summary || s);
                const labels = t?.labels || defaultLabels(timeframe);
                const values = t?.values || defaultValues(timeframe);
                setTrends({ labels, values });
            } catch (err) {
                // Fallback to demo values if API fails
                setSummary({
                    totalBalance: 7783,
                    totalSpent: 1187.4,
                    totalEarned: 4120,
                });
                setTrends({ labels: defaultLabels(timeframe), values: defaultValues(timeframe) });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [timeframe]);

    const expensePercent = useMemo(() => {
        if (!summary) return 0;
        const percent = Math.min(100, Math.max(0, Math.round(((summary.totalSpent || 0) / goalTarget) * 100)));
        return percent;
    }, [summary, goalTarget]);

    const barData = useMemo(() => ({
        labels: trends?.labels || [],
        datasets: [
            {
                label: 'Expenses',
                data: trends?.values || [],
                backgroundColor: '#7C3AED',
                borderRadius: 8,
                maxBarThickness: 24,
            },
        ],
    }), [trends]);

    const barOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#E9D5FF', drawBorder: false },
                ticks: {
                    color: '#6B7280',
                    callback: (val: any) => `₹${Number(val).toLocaleString('en-IN')}`,
                },
            },
            x: { grid: { display: false }, ticks: { color: '#111827' } },
        },
    }), []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Summary Banner */}
            <div className="bg-purple-600 text-white px-4 pt-6 pb-4">
                <h2 className="text-xl font-bold mb-4">Analysis</h2>

                <div className="grid grid-cols-2 gap-4 items-start">
                    <div>
                        <p className="text-xs text-purple-200">Total Balance</p>
                        <p className="text-3xl font-extrabold">{prettyCurrency(summary?.totalBalance || 7783)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-purple-200">Total Expense</p>
                        <p className="text-2xl font-bold text-purple-200">- {prettyCurrency(summary?.totalSpent || 1187.4)}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <span className="px-2 py-0.5 text-xs bg-purple-800 rounded-full">{expensePercent}%</span>
                        <div className="flex-1 h-3 mx-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white bg-opacity-90 rounded-full transition-all duration-500"
                                style={{ width: `${expensePercent}%` }}
                                aria-valuenow={expensePercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                role="progressbar"
                            />
                        </div>
                        <span className="text-xs">{prettyCurrency(goalTarget)}</span>
                    </div>
                    <p className="text-xs text-purple-100">{getMotivation(expensePercent)}</p>
                </div>
            </div>

            {/* Body Card */}
            <div className="bg-green-50 rounded-t-3xl -mt-3 px-4 pt-5 pb-28">
                {/* Timeframe Tabs */}
                <div className="bg-purple-100 p-1 rounded-2xl inline-flex mb-5">
                    {(['daily', 'weekly', 'monthly', 'year'] as Timeframe[]).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${timeframe === tf ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700'
                                }`}
                            aria-pressed={timeframe === tf}
                        >
                            {tf.charAt(0).toUpperCase() + tf.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Chart Card */}
                <div className="bg-purple-100 rounded-3xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-800 font-semibold">Income & Expenses</h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/search')}
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-purple-700 hover:bg-purple-50 transition"
                                aria-label="Open search"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/calendar')}
                                className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-purple-700 hover:bg-purple-50 transition"
                                aria-label="Open calendar"
                            >
                                <Calendar className="w-4 h-4" />
                            </button>
                            <span className="w-px h-6 bg-purple-300/60 mx-1" />
                            <button
                                onClick={() => setChartView('bar')}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${chartView === 'bar' ? 'bg-purple-600 text-white' : 'bg-white text-purple-700'
                                    }`}
                                aria-label="Bar chart view"
                            >
                                <BarChart2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setChartView('list')}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${chartView === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-purple-700'
                                    }`}
                                aria-label="List view"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="h-52">
                        {chartView === 'bar' ? (
                            <Bar data={barData} options={barOptions} />
                        ) : (
                            <div className="space-y-2 overflow-y-auto h-full pr-1">
                                {(trends?.labels || []).map((label, idx) => (
                                    <div key={label} className="bg-white rounded-xl p-3 flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{label}</span>
                                        <span className="text-sm font-semibold text-purple-700">{prettyCurrency(trends?.values[idx] || 0)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Income & Expense Breakdown */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="bg-white rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Income</p>
                            <p className="text-lg font-bold text-gray-900">{prettyCurrency(summary?.totalEarned || 4120)}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                            <TrendingDown className="w-4 h-4 text-purple-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Expense</p>
                            <p className="text-lg font-bold text-purple-700">{prettyCurrency(summary?.totalSpent || 1187.4)}</p>
                        </div>
                    </div>
                </div>

                {/* My Targets */}
                <div className="mt-6">
                    <h4 className="text-gray-800 font-semibold mb-3">My Targets</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[{ name: 'Travel', percent: 30 }, { name: 'Car', percent: 50 }].map((t) => (
                            <div key={t.name} className="bg-white rounded-3xl p-4 shadow-sm">
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 rounded-full" style={ringStyle(t.percent, '#7C3AED')}></div>
                                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                            <span className="text-base font-bold text-purple-700">{t.percent}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">{t.name}</p>
                                        <p className="text-xs text-gray-500">Progress towards your goal</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

function defaultLabels(tf: Timeframe): string[] {
    switch (tf) {
        case 'daily':
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        case 'weekly':
            return ['1st Week', '2nd Week', '3rd Week', '4th Week'];
        case 'monthly':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        case 'year':
            return ['2019', '2020', '2021', '2022', '2023'];
        default:
            return [];
    }
}

function defaultValues(tf: Timeframe): number[] {
    switch (tf) {
        case 'daily':
            return [3500, 600, 5200, 4100, 9800, 1200, 5300];
        case 'weekly':
            return [11500, 3200, 9800, 7600];
        case 'monthly':
            return [12000, 15500, 18200, 9900, 16800, 5200];
        case 'year':
            return [65000, 82000, 101000, 56000, 78000];
        default:
            return [];
    }
}

export default AnalyticsPage;
