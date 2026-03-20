import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileSettingsPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [success, setSuccess] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (next.length < 6 || next !== confirm) return;
        setSuccess(true);
        setTimeout(() => navigate(-1), 1500);
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mb-6"
            >
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:shadow-sm hover:bg-gray-50 transition-all mr-4">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Password</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Manage your account security</p>
                </div>
            </motion.div>

            {/* Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 max-w-xl mx-auto min-h-[400px] flex flex-col justify-center"
            >
                {success ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                    >
                        <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-2 border-indigo-100 mx-auto mb-6 flex items-center justify-center relative shadow-inner">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgb(79,70,229,0.4)]"
                            >
                                <KeyRound className="w-5 h-5" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Password Updated!</h2>
                        <p className="text-gray-500 font-medium">Your new password has been applied to your account.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input 
                                    type={show ? 'text' : 'password'} 
                                    value={current} 
                                    onChange={(e) => setCurrent(e.target.value)} 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium transition-all" 
                                    placeholder="Enter current password"
                                />
                                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 p-2 rounded-xl transition-colors">
                                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                            <input 
                                type="password" 
                                value={next} 
                                onChange={(e) => setNext(e.target.value)} 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium transition-all" 
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirm} 
                                onChange={(e) => setConfirm(e.target.value)} 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-medium transition-all" 
                                placeholder="Confirm password"
                            />
                            {confirm && next !== confirm && (
                                <p className="text-red-500 text-xs font-bold mt-2 ml-1">Passwords do not match</p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={next.length < 6 || next !== confirm}
                            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:pointer-events-none mt-4"
                        >
                            Update Password
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ProfileSettingsPasswordPage;
