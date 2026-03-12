import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
        setTimeout(() => navigate(-1), 1200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Password Settings</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                {success ? (
                    <div className="h-[60vh] flex items-center justify-center animate-fade-slide-up">
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-purple-600"></div>
                            </div>
                            <p className="text-white text-lg font-semibold">Password Has Been Changed Successfully</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-4 animate-fade-slide-up">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <div className="relative">
                                <input type={show ? 'text' : 'password'} value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-2xl font-medium">Change Password</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfileSettingsPasswordPage;

