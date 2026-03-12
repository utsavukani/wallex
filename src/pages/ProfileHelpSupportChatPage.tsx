import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileHelpSupportChatPage: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { from: 'assistant', text: "Welcome, I am your virtual assistant." },
        { from: 'assistant', text: 'How can I help you today?' }
    ]);
    const [text, setText] = useState('');

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setMessages(prev => [...prev, { from: 'user', text }, { from: 'assistant', text: 'Thanks! We will get back shortly.' }]);
        setText('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Online Support</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                <div className="bg-white rounded-3xl p-5 flex flex-col h-[70vh] animate-fade-slide-up">
                    <div className="flex space-x-2 mb-4">
                        <button className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm">Support Assistant</button>
                        <button className="px-3 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm">Help Center</button>
                    </div>
                    <div className="flex-1 overflow-auto space-y-2">
                        {messages.map((m, i) => (
                            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.from === 'assistant' ? 'bg-purple-100 text-gray-800 self-start' : 'bg-purple-600 text-white self-end ml-auto'}`}>{m.text}</div>
                        ))}
                    </div>
                    <form onSubmit={send} className="mt-4 flex items-center space-x-2">
                        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write here..." className="flex-1 px-4 py-3 bg-purple-50 border border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500" />
                        <button type="submit" className="px-4 py-3 bg-purple-600 text-white rounded-2xl">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileHelpSupportChatPage;



