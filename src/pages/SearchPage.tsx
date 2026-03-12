import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';

const categories = ['Groceries', 'Food', 'Transport', 'Bills', 'Entertainment', 'Others'];

const prettyCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [reportType, setReportType] = useState<'income' | 'expense'>('expense');
    const [showResults, setShowResults] = useState(false);

    const displayDate = useMemo(() => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        return `${day} / ${month.toUpperCase()}/${year}`;
    }, [date]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            {/* Header */}
            <div className="bg-purple-600 text-white px-4 py-4">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-white">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-extrabold">Search</h1>
                    <button className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="bg-green-50 rounded-t-3xl -mt-2 px-5 pt-5 pb-28">
                {/* Search field */}
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-purple-100 placeholder-purple-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                {/* Categories */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Categories</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl bg-purple-100 text-gray-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">Select the category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-500">▾</span>
                    </div>
                </div>

                {/* Date */}
                <div className="mb-5">
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="sr-only"
                            aria-label="Select date"
                            id="search-date-input"
                        />
                        <label htmlFor="search-date-input" className="block cursor-pointer w-full px-4 py-3 pr-12 rounded-2xl bg-purple-100 text-gray-900">
                            <span className="uppercase tracking-wide text-sm">{displayDate}</span>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                                <CalendarIcon className="h-4 w-4 text-purple-600" />
                            </span>
                        </label>
                    </div>
                </div>

                {/* Report Type */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Report</label>
                    <div className="flex items-center space-x-8">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="radio"
                                name="reportType"
                                value="income"
                                checked={reportType === 'income'}
                                onChange={() => setReportType('income')}
                                className="accent-purple-600"
                            />
                            <span className="text-gray-800">Income</span>
                        </label>
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="radio"
                                name="reportType"
                                value="expense"
                                checked={reportType === 'expense'}
                                onChange={() => setReportType('expense')}
                                className="accent-purple-600"
                            />
                            <span className="text-gray-800">Expense</span>
                        </label>
                    </div>
                </div>

                {/* Search Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowResults(true)}
                        className="w-40 mx-auto block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full transition-colors"
                    >
                        Search
                    </button>
                </div>

                {/* Results */}
                {showResults && (
                    <div className="bg-purple-100 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">🍽️</div>
                            <div>
                                <p className="font-semibold text-gray-800">Dinner</p>
                                <p className="text-xs text-gray-600">18:27 - {new Date(date).toLocaleString('en-US', { month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-purple-700 font-semibold">-{prettyCurrency(26)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;


