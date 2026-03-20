import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileSettingsDeleteAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [done, setDone] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || password.length < 6) return;
        setConfirming(true);
    };

    const finalize = () => {
        setDone(true);
        setTimeout(() => navigate('/login'), 1200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Delete Account</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                {done ? (
                    <div className="h-[60vh] flex items-center justify-center animate-fade-slide-up">
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-purple-600"></div>
                            </div>
                            <p className="text-white text-lg font-semibold">Account Deleted</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5 animate-fade-slide-up">
                        <div className="bg-white rounded-3xl p-5 space-y-3">
                            <p className="text-gray-800 font-semibold">Are You Sure You Want To Delete Your Account?</p>
                            <div className="text-sm text-gray-600 bg-purple-50 border border-purple-200 rounded-xl p-4">
                                <p>This action will permanently delete all of your data and cannot be undone.</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>All your expenses, income and associated transactions will be eliminated.</li>
                                    <li>You will not be able to access your account or any related information.</li>
                                </ul>
                            </div>
                            <form onSubmit={submit} className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Please enter your password to confirm</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                                <div className="flex space-x-3">
                                    <button type="submit" className="flex-1 bg-purple-600 text-white py-3 rounded-2xl font-medium">Yes, Delete Account</button>
                                    <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-purple-100 text-purple-700 py-3 rounded-2xl font-medium">Cancel</button>
                                </div>
                            </form>
                        </div>
                        {confirming && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                                <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Delete Account</h3>
                                    <p className="text-sm text-gray-600 mb-6 text-center">Are you sure you want to log out?</p>
                                    <div className="space-y-3">
                                        <button onClick={finalize} className="w-full bg-purple-600 text-white py-3 rounded-2xl font-medium">Yes, Delete Account</button>
                                        <button onClick={() => setConfirming(false)} className="w-full bg-purple-100 text-purple-700 py-3 rounded-2xl font-medium">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSettingsDeleteAccountPage;

