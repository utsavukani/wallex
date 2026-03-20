import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import GoalsPage from './pages/GoalsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ParentPage from './pages/ParentPage';
import EducationPage from './pages/EducationPage';

import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSecurityPinPage from './pages/ProfileSecurityPinPage';
import ProfileSettingsPasswordPage from './pages/ProfileSettingsPasswordPage';
import ProfileHelpSupportChatPage from './pages/ProfileHelpSupportChatPage';
import ProfileSettingsDeleteAccountPage from './pages/ProfileSettingsDeleteAccountPage';
import ProfileSettingsNotificationsPage from './pages/ProfileSettingsNotificationsPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Demo persona switcher
import PersonaSwitcher from './components/PersonaSwitcher';

function AppContent() {
  const { user, loading } = useAuth();
  const [showPersonaSwitcher, setShowPersonaSwitcher] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FD] selection:bg-indigo-100 selection:text-indigo-900 relative">
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setShowPersonaSwitcher(!showPersonaSwitcher)}
            className="bg-white text-gray-700 border border-gray-200 shadow-sm px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition-all flex items-center"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Demo Accounts
          </button>
          {showPersonaSwitcher && (
            <div className="absolute top-14 right-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-4 min-w-[320px]">
              <PersonaSwitcher onClose={() => setShowPersonaSwitcher(false)} />
            </div>
          )}
        </div>
        <LoginPage />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/parent" element={<ParentPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/security/change-pin" element={<ProfileSecurityPinPage />} />
        <Route path="/profile/settings/password" element={<ProfileSettingsPasswordPage />} />
        <Route path="/profile/support" element={<ProfileHelpSupportChatPage />} />
        <Route path="/profile/settings/delete-account" element={<ProfileSettingsDeleteAccountPage />} />
        <Route path="/profile/settings/notifications" element={<ProfileSettingsNotificationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: '#111827',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                fontWeight: 'bold',
                fontSize: '14px',
                padding: '16px 20px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;