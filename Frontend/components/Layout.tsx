import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BarChart3,
  Target,
  Plus,
  BookOpen,
  Bell,
  LogOut,
  User as UserIcon,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile navigation only needs 5 icons
  const mobileNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Transfer', href: '/transactions', icon: Plus, isAction: true },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'Settings', href: '/profile', icon: UserIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // The sidebar content
  const NavContent = () => (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-xl border-r border-gray-200/50 relative">
      <Link to="/" className="p-6 flex items-center mb-6 hover:opacity-80 transition-opacity">
        <img src={Logo} alt="Wallex Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
        <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Wallex</span>
      </Link>

      <div className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="relative group flex items-center px-4 py-3 rounded-2xl transition-all duration-300"
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative flex items-center z-10">
                <Icon className={`w-5 h-5 mr-3 transition-colors duration-300 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className={`font-semibold  transition-colors duration-300 ${active ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-4 border border-indigo-100 shadow-sm mb-4">
           <div className="flex items-center mb-3">
             <div className="h-10 w-10 bg-indigo-100 rounded-full flex flex-shrink-0 items-center justify-center border-2 border-white shadow-sm">
                <span className="text-sm font-bold text-indigo-700">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
             </div>
             <div className="ml-3 overflow-hidden">
               <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
               <p className="text-xs text-gray-500 font-medium capitalize truncate">{user?.role}</p>
             </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center p-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all border border-transparent hover:border-gray-200"
           >
             <LogOut className="w-4 h-4 mr-2" />
             Log Out
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Top Navbar (Glassmorphic) */}
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            
            {/* Mobile Branding - No Hamburger */}
            <div className="flex items-center lg:hidden">
              <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src={Logo} alt="Wallex Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                <span className="ml-2 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Wallex</span>
              </Link>
            </div>

            {/* Desktop Greeting */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {navigation.find(n => isActive(n.href))?.name || 'Overview'}
              </h2>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                to="/transactions" 
                className="hidden sm:flex items-center bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Transfer
              </Link>
              <Link 
                to="/notifications" 
                className="relative p-2.5 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:shadow-sm hover:border-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
              </Link>
              
              <Link 
                to="/profile" 
                className="lg:hidden p-0.5 rounded-full border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                 <div className="h-9 w-9 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex flex-shrink-0 items-center justify-center">
                    <span className="text-sm font-bold text-indigo-700">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                 </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Wrapper with extra padding for mobile bottom bar */}
        <main className="flex-1 p-4 sm:p-8 overflow-hidden relative pb-28 lg:pb-8">
          <AnimatePresence mode="wait">
             <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-full"
             >
                {children}
             </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* iOS-Style Floating Glass Bottom Navigation Bar (Mobile Only) */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden px-4 pb-6 pt-2 pointer-events-none">
        <nav className="mx-auto w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] px-2 py-2 flex items-center justify-between pointer-events-auto">
          {mobileNavigation.map((item) => {
            const active = isActive(item.href) && !item.isAction;
            const Icon = item.icon;
            
            if (item.isAction) {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative -mt-8 flex flex-col items-center justify-center pointer-events-auto"
                >
                  <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white hover:scale-105 active:scale-95 transition-transform border-4 border-[#F8F9FD]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 mt-1">{item.name}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative flex flex-col items-center justify-center p-2 min-w-[64px]"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-active-pill"
                    className="absolute inset-0 bg-indigo-50/80 rounded-2xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-6 h-6 mb-1 ${active ? 'text-indigo-600' : 'text-gray-400'}`} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] font-bold ${active ? 'text-indigo-700' : 'text-gray-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
    </div>
  );
};

export default Layout;