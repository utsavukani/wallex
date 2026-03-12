import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileSecurityTermsPage: React.FC = () => {
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);

    const accept = () => {
        setAccepted(true);
        setTimeout(() => navigate(-1), 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Terms And Conditions</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                <div className="bg-white rounded-3xl p-5 space-y-3 animate-fade-slide-up">
                    <h2 className="font-semibold text-gray-800">Est Fugiat Assumenda Aut Reprehenderit</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        <li>Aut fuga sequi eum voluptatibus provident.</li>
                        <li>Eos consequuntur voluptas vel amet eaque dignissimos velit.</li>
                    </ul>
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                        <span>I accept all the terms and conditions</span>
                    </label>
                    <button disabled={!accepted} onClick={accept} className={`w-full py-3 rounded-2xl font-medium ${accepted ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-500 cursor-not-allowed'}`}>Accept</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityTermsPage;

