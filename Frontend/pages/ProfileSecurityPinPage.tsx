import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileSecurityPinPage: React.FC = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [success, setSuccess] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPin.length < 4) return;
        if (newPin !== confirmPin) return;
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
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Security PIN</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Update your 4-digit access code</p>
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
                        <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 mx-auto mb-6 flex items-center justify-center relative shadow-inner">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgb(16,185,129,0.4)]"
                            >
                                <ShieldCheck className="w-6 h-6" />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">PIN Updated!</h2>
                        <p className="text-gray-500 font-medium">Your new security PIN has been saved successfully.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Current PIN</label>
                            <div className="relative">
                                <input 
                                    type={show ? 'text' : 'password'} 
                                    maxLength={4}
                                    value={currentPin} 
                                    onChange={(e) => setCurrentPin(e.target.value.replace(/[^0-9]/g, ''))} 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-bold text-lg tracking-[0.5em] transition-all" 
                                    placeholder="••••"
                                />
                                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 p-2 rounded-xl transition-colors">
                                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">New PIN</label>
                            <input 
                                type="password" 
                                maxLength={4}
                                value={newPin} 
                                onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))} 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-bold text-lg tracking-[0.5em] transition-all" 
                                placeholder="••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New PIN</label>
                            <input 
                                type="password" 
                                maxLength={4}
                                value={confirmPin} 
                                onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))} 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 font-bold text-lg tracking-[0.5em] transition-all" 
                                placeholder="••••"
                            />
                            {confirmPin && newPin !== confirmPin && (
                                <p className="text-red-500 text-xs font-bold mt-2 ml-1">PINs do not match</p>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={newPin.length < 4 || newPin !== confirmPin}
                            className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-gray-800 hover:shadow-lg shadow-gray-900/20 transition-all disabled:opacity-50 disabled:pointer-events-none mt-4"
                        >
                            Update PIN
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ProfileSecurityPinPage;
