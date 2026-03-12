import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileSecurityFingerprintPage: React.FC = () => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState<'added' | 'deleted' | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Fingerprint</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                {success ? (
                    <div className="h-[60vh] flex items-center justify-center animate-fade-slide-up">
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-purple-600"></div>
                            </div>
                            <p className="text-white text-lg font-semibold">
                                {success === 'added' ? 'Fingerprint Has Been Changed Successfully' : 'The Fingerprint Has Been Successfully Deleted.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5 animate-fade-slide-up">
                        <div className="bg-white rounded-3xl p-6 text-center">
                            <div className="w-28 h-28 rounded-full bg-purple-600 text-white mx-auto mb-4 flex items-center justify-center">
                                <span className="text-5xl">🔒</span>
                            </div>
                            <p className="text-gray-700 mb-4">Use Fingerprint To Access</p>
                            <button onClick={() => setSuccess('added')} className="w-full bg-purple-100 text-purple-700 py-3 rounded-2xl font-medium">Use Touch Id</button>
                        </div>
                        <div className="bg-white rounded-3xl p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-800">John Fingerprint</span>
                                <button onClick={() => setSuccess('deleted')} className="px-4 py-2 bg-purple-600 text-white rounded-xl">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSecurityFingerprintPage;

