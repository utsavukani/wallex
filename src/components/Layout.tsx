import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  BarChart3,
  Target,
  Users,
  Plus,
  BookOpen,
  Bell,
  User as UserIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../assets/logo.svg';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Transactions', href: '/transactions', icon: Plus },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-green-50">
      {/* Top Header */}
      <div className="bg-purple-600 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center">
                <img src={Logo} alt="Wallex Logo" className="w-8 h-8 object-contain mr-2" />
                <span className="text-xl font-bold">Wallex</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/notifications" className="p-2">
              <Bell className="h-5 w-5" />
            </Link>
            <Link to="/profile" className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <main className="pb-20">
          {children}
        </main>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-purple-100 rounded-t-3xl border-t border-purple-200">
        <div className="flex justify-around items-center py-3 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 rounded-xl transition-all ${active
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-600 hover:bg-purple-50'
                  }`}
              >
                <Icon className={`h-6 w-6 ${active ? 'text-white' : 'text-purple-600'}`} />
                <span className={`text-xs mt-1 font-medium ${active ? 'text-white' : 'text-purple-600'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;