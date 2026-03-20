import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileHelpSupportChatPage: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { from: 'assistant', text: "Welcome to Wallex Support. I am your virtual assistant.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { from: 'assistant', text: 'How can I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [text, setText] = useState('');

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { from: 'user', text, time }]);
        setText('');
        
        // Simulate reply
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                from: 'assistant', 
                text: 'Thanks for reaching out! Our team has received your query and will connect with you shortly.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }]);
        }, 1000);
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
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
                        Online Support
                        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold border border-indigo-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Live
                        </span>
                    </h1>
                </div>
            </motion.div>

            {/* Content List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 max-w-3xl mx-auto flex flex-col h-[70vh]"
            >
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100/50 flex items-center gap-4 mb-6 shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-indigo-50 text-indigo-600">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Virtual Assistant</h3>
                        <p className="text-sm font-medium text-gray-500">Usually replies instantly</p>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide flex flex-col">
                    {messages.map((m, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            key={i} 
                            className={`flex flex-col max-w-[85%] ${m.from === 'assistant' ? 'self-start' : 'self-end'}`}
                        >
                            <div className={`px-5 py-3.5 text-[15px] shadow-sm ${
                                m.from === 'assistant' 
                                    ? 'bg-white text-gray-800 rounded-3xl rounded-tl-sm border border-gray-100' 
                                    : 'bg-indigo-600 text-white rounded-3xl rounded-tr-sm font-medium'
                            }`}>
                                {m.text}
                            </div>
                            <span className={`text-[11px] font-bold text-gray-400 mt-1.5 px-1 ${m.from === 'assistant' ? 'self-start' : 'self-end'}`}>
                                {m.time}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="mt-4 shrink-0 pt-4 border-t border-gray-100">
                    <form onSubmit={send} className="flex items-center gap-3 bg-gray-50 p-2 rounded-[1.5rem] border border-gray-200/60 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <input 
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            placeholder="Type a message..." 
                            className="flex-1 px-4 py-2 text-[15px] bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400" 
                        />
                        <button 
                            type="submit" 
                            disabled={!text.trim()}
                            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                        >
                            <Send className="w-5 h-5 -ml-0.5" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileHelpSupportChatPage;
