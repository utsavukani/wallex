import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

type Tab = 'spends' | 'categories';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const prettyCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const CalendarPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('spends');
    const [month, setMonth] = useState<number>(3); // April index
    const [year, setYear] = useState<number>(2023);

    const firstDayOfMonth = useMemo(() => new Date(year, month, 1).getDay(), [month, year]);
    const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [month, year]);

    const weeks: (number | null)[] = useMemo(() => {
        const blanks = Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return [...blanks, ...days];
    }, [firstDayOfMonth, daysInMonth]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Header */}
            <div className="bg-purple-600 text-white px-4 py-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-white">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-extrabold">Calender</h1>
                    <button className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="bg-green-50 rounded-t-3xl -mt-2 px-5 pt-5 pb-28">
                {/* Month & Year selectors */}
                <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="appearance-none bg-purple-100 rounded-2xl px-4 py-2 pr-8 text-gray-900">
                            {months.map((m, i) => (
                                <option key={m} value={i}>{m}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-purple-600">▾</span>
                    </div>
                    <div className="relative">
                        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="appearance-none bg-purple-100 rounded-2xl px-4 py-2 pr-8 text-gray-900">
                            {[2021, 2022, 2023, 2024].map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-purple-600">▾</span>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="rounded-3xl bg-white/40 p-4">
                    <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                            <div key={d} className="py-1">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-3 text-center text-gray-900">
                        {weeks.map((d, i) => (
                            <div key={i} className="h-8 flex items-center justify-center">
                                {d ? <span>{d}</span> : null}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-3 mt-6">
                    <button
                        onClick={() => setActiveTab('spends')}
                        className={`px-6 py-2 rounded-full font-semibold ${activeTab === 'spends' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-gray-800'}`}
                    >
                        Spends
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-6 py-2 rounded-full font-semibold ${activeTab === 'categories' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-gray-800'}`}
                    >
                        Categories
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'categories' ? (
                    <div className="mt-6">
                        {/* Simple semi-donut using CSS gradients */}
                        <div className="mx-auto w-64 h-32 relative">
                            <div className="absolute inset-0 rounded-b-[160px] rounded-t-[160px]" style={{
                                background: 'conic-gradient(#7C3AED 0 79%, #A78BFA 79% 90%, #C4B5FD 90% 100%)',
                                borderBottomLeftRadius: '160px',
                                borderBottomRightRadius: '160px',
                            }}></div>
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-28 bg-green-50 rounded-b-[140px] rounded-t-[140px]"></div>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center space-x-8 mt-4 text-sm">
                            <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-purple-700"></span><span>Groceries</span></div>
                            <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-purple-400"></span><span>Others</span></div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {/* Groceries */}
                        <div className="bg-white rounded-2xl p-4 flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">🛍️</div>
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
                                        <p className="font-semibold text-purple-700">-{prettyCurrency(100)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Others */}
                        <div className="bg-white rounded-2xl p-4 flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">📦</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">Others</p>
                                        <p className="text-xs text-gray-500">17:00 - April 24</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 mx-3"></div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800">Payments</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 mx-3"></div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{prettyCurrency(120)}</p>
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

export default CalendarPage;


