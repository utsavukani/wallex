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
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSecurityPinPage from './pages/ProfileSecurityPinPage';
import ProfileSecurityFingerprintPage from './pages/ProfileSecurityFingerprintPage';
import ProfileSecurityTermsPage from './pages/ProfileSecurityTermsPage';
import ProfileSettingsNotificationsPage from './pages/ProfileSettingsNotificationsPage';
import ProfileSettingsPasswordPage from './pages/ProfileSettingsPasswordPage';
import ProfileSettingsDeleteAccountPage from './pages/ProfileSettingsDeleteAccountPage';
import ProfileHelpFaqPage from './pages/ProfileHelpFaqPage';
import ProfileHelpSupportChatPage from './pages/ProfileHelpSupportChatPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import SearchPage from './pages/SearchPage';
import CalendarPage from './pages/CalendarPage';

// Demo persona switcher
import PersonaSwitcher from './components/PersonaSwitcher';

function AppContent() {
  const { user, loading } = useAuth();
  const [showPersonaSwitcher, setShowPersonaSwitcher] = useState(false);

  // Debug logging
  console.log('AppContent render:', { user: !!user, loading });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('No user found, showing login page');
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowPersonaSwitcher(!showPersonaSwitcher)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Demo Accounts
          </button>
          {showPersonaSwitcher && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border p-4 min-w-[300px]">
              <PersonaSwitcher onClose={() => setShowPersonaSwitcher(false)} />
            </div>
          )}
        </div>
        <LoginPage />
      </div>
    );
  }

  console.log('User authenticated, showing dashboard');
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/parent" element={<ParentPage />} />
        <Route path="/education" element={<EducationPage />} />
        {/* Settings consolidated under Profile; keep route for deep links if needed */}
        <Route path="/settings" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Profile sub-pages */}
        <Route path="/profile/security/change-pin" element={<ProfileSecurityPinPage />} />
        <Route path="/profile/security/fingerprint" element={<ProfileSecurityFingerprintPage />} />
        <Route path="/profile/security/terms" element={<ProfileSecurityTermsPage />} />
        <Route path="/profile/settings/notifications" element={<ProfileSettingsNotificationsPage />} />
        <Route path="/profile/settings/password" element={<ProfileSettingsPasswordPage />} />
        <Route path="/profile/settings/delete" element={<ProfileSettingsDeleteAccountPage />} />
        <Route path="/profile/help" element={<ProfileHelpFaqPage />} />
        <Route path="/profile/support" element={<ProfileHelpSupportChatPage />} />
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
                background: '#6B21A8',
                color: '#fff',
                borderRadius: '12px',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;