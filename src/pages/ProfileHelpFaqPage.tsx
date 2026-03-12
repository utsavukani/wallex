import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
    { q: 'How to use FinWise?', a: 'You can register expenses in the top menu of the homepage.' },
    { q: 'How to contact support?', a: 'Use Online Support from the profile section or email us.' },
    { q: 'How can I reset my password if I forget it?', a: 'Use Password Settings in profile to change your password.' },
];

const ProfileHelpFaqPage: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<number | null>(null);
    const [tab, setTab] = useState<'faq' | 'contact'>('faq');

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Help & FAQs</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                <div className="bg-white rounded-3xl p-5 animate-fade-slide-up">
                    <div className="flex p-1 bg-purple-50 rounded-xl mb-4">
                        <button onClick={() => setTab('faq')} className={`flex-1 py-2 rounded-lg font-medium ${tab === 'faq' ? 'bg-white' : ''}`}>FAQ</button>
                        <button onClick={() => setTab('contact')} className={`flex-1 py-2 rounded-lg font-medium ${tab === 'contact' ? 'bg-white' : ''}`}>Contact Us</button>
                    </div>
                    {tab === 'faq' ? (
                        <div className="divide-y">
                            {faqs.map((item, idx) => (
                                <div key={idx} className="py-3">
                                    <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full flex items-center justify-between text-left">
                                        <span className="text-gray-800">{item.q}</span>
                                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${open === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    {open === idx && <p className="text-sm text-gray-600 mt-2">{item.a}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <a className="block p-3 rounded-xl bg-purple-50 text-purple-700" href="#">Customer Service</a>
                            <a className="block p-3 rounded-xl bg-purple-50 text-purple-700" href="#">Website</a>
                            <a className="block p-3 rounded-xl bg-purple-50 text-purple-700" href="#">Facebook</a>
                            <a className="block p-3 rounded-xl bg-purple-50 text-purple-700" href="#">Whatsapp</a>
                            <a className="block p-3 rounded-xl bg-purple-50 text-purple-700" href="#">Instagram</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHelpFaqPage;



