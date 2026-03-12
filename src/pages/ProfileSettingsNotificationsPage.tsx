import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Toggle: React.FC<{ label: string; value: boolean; onChange: () => void; }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-gray-800">{label}</span>
        <button onClick={onChange} className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-purple-600' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}></div>
        </button>
    </div>
);

const ProfileSettingsNotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [general, setGeneral] = useState(true);
    const [sound, setSound] = useState(true);
    const [call, setCall] = useState(false);
    const [vibrate, setVibrate] = useState(true);
    const [txn, setTxn] = useState(true);
    const [reminder, setReminder] = useState(false);
    const [budget, setBudget] = useState(true);
    const [lowBalance, setLowBalance] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-green-50">
            <div className="bg-purple-600 text-white px-4 py-3">
                <div className="flex items-center">
                    <ArrowLeft className="h-5 w-5 mr-3 cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-lg font-bold">Notification Settings</h1>
                </div>
            </div>
            <div className="bg-green-50 px-4 py-6 rounded-t-3xl -mt-4">
                <div className="bg-white rounded-3xl p-5 animate-fade-slide-up">
                    <Toggle label="General Notification" value={general} onChange={() => setGeneral(!general)} />
                    <Toggle label="Sound" value={sound} onChange={() => setSound(!sound)} />
                    <Toggle label="Sound Call" value={call} onChange={() => setCall(!call)} />
                    <Toggle label="Vibrate" value={vibrate} onChange={() => setVibrate(!vibrate)} />
                    <Toggle label="Transaction Update" value={txn} onChange={() => setTxn(!txn)} />
                    <Toggle label="Expense Reminder" value={reminder} onChange={() => setReminder(!reminder)} />
                    <Toggle label="Budget Notifications" value={budget} onChange={() => setBudget(!budget)} />
                    <Toggle label="Low Balance Alerts" value={lowBalance} onChange={() => setLowBalance(!lowBalance)} />
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsNotificationsPage;

