import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent';
  segment?: string;
  linkedUsers?: any[];
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, otp: string, userData?: any) => Promise<boolean>;
  logout: () => void;
  sendOTP: (email: string, role: 'student' | 'parent') => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            console.log('User restored from localStorage:', userData);
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else if (token && !storedUser) {
          // Token exists but no user data - try to get from API
          try {
            const userData = await authAPI.getCurrentUser();
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (apiError) {
            console.warn('API call failed during auth init:', apiError);
            // For demo purposes, don't clear token if API fails
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const sendOTP = async (email: string, role: 'student' | 'parent'): Promise<boolean> => {
    try {
      await authAPI.sendOTP(email, role);
      toast.success('OTP sent successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send OTP. Try 123456 as a default test if local.');
      return true; // Still return true for local demo mode if actual email fails
    }
  };

  const login = async (email: string, otp: string, userData?: any): Promise<boolean> => {
    try {
      // Call the real backend verify endpoint
      const response = await authAPI.verifyOTP(email, otp, userData);
      
      const realUser = response.user;
      const token = response.token;

      if (!realUser || !token) {
        throw new Error('Invalid response from server');
      }

      // Store real token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(realUser));

      setUser(realUser);

      console.log('User logged in successfully:', realUser);
      toast.success(`Welcome ${realUser.name}!`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Ensure backend is running.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...userData };
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    sendOTP,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};