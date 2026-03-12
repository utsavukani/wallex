import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Shield, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../assets/logo.svg';


const LoginPage: React.FC = () => {
  const { sendOTP, login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp' | 'onboarding'>('email');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Onboarding data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState<number>(5000);
  const [hasPartTimeJob, setHasPartTimeJob] = useState(false);
  const [typicalSpendCategories, setTypicalSpendCategories] = useState<string[]>([]);

  const categories = ['Food', 'Transport', 'Academic', 'Entertainment', 'Shopping', 'Bills'];

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await sendOTP(email, role);
    if (success) {
      setStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if this is a new user (for demo, assume emails not in our test data are new)
      const testEmails = [
        'aisha@example.com', 'rohit@example.com', 'meera@example.com', 'kunal@example.com',
        'farida@example.com', 'mahesh@example.com', 'priya@example.com', 'arun@example.com'
      ];

      const isExistingUser = testEmails.includes(email);

      if (isExistingUser) {
        // Existing user - login directly
        const success = await login(email, otp);
        if (!success) {
          toast.error('Login failed. Please try again.');
          setLoading(false);
        }
      } else {
        // New user - go to onboarding
        setStep('onboarding');
        setLoading(false);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (role === 'student' && allowanceAmount <= 0) {
      toast.error('Please enter a valid allowance amount');
      return;
    }

    setLoading(true);

    try {
      const onboardingData = role === 'student' ? {
        name,
        phone,
        role,
        segment: determineSegment(allowanceAmount, hasPartTimeJob, typicalSpendCategories),
        onboardingData: {
          allowanceAmount,
          hasPartTimeJob,
          typicalSpendCategories
        }
      } : {
        name,
        phone,
        role
      };

      const success = await login(email, otp, onboardingData);
      if (success) {
        // Profile completion successful - user should now be logged in
        console.log('Profile completion successful');
        // The login function will handle setting the user state
        // No need to manually navigate - the App component will handle routing
      } else {
        toast.error('Failed to complete setup. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete setup. Please try again.');
      setLoading(false);
    }
  };

  // Helper function to determine user segment based on onboarding data
  const determineSegment = (allowance: number, hasJob: boolean, categories: string[]) => {
    if (allowance >= 8000 && hasJob) {
      return 'high-earner';
    } else if (allowance >= 5000 && hasJob) {
      return 'mid-earner';
    } else if (allowance >= 3000) {
      return 'budget-conscious';
    } else {
      return 'low-income';
    }
  };

  const toggleCategory = (category: string) => {
    setTypicalSpendCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and App Name */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={Logo} alt="Wallex Logo" className="my-{10px} w-40 h-40 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Wallex</h1>
          <p className="text-purple-600 text-sm">New to Wallex? Sign Up</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-4 rounded-2xl border-2 text-sm font-medium transition-colors ${role === 'student'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`p-4 rounded-2xl border-2 text-sm font-medium transition-colors ${role === 'parent'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Parent
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 px-4 rounded-2xl font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                className="w-full bg-purple-100 text-purple-700 py-4 px-4 rounded-2xl font-medium hover:bg-purple-200 transition-colors"
              >
                Sign Up
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Demo OTP: <span className="font-mono font-bold">123456</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 px-4 rounded-2xl font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-purple-600 hover:text-purple-800 text-sm"
              >
                ← Back to email
              </button>
            </form>
          )}

          {step === 'onboarding' && (
            <form onSubmit={handleOnboarding} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Allowance (₹)
                    </label>
                    <input
                      type="number"
                      value={allowanceAmount}
                      onChange={(e) => setAllowanceAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you have a part-time job?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHasPartTimeJob(true)}
                        className={`p-4 rounded-2xl border-2 text-sm font-medium transition-colors ${hasPartTimeJob
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasPartTimeJob(false)}
                        className={`p-4 rounded-2xl border-2 text-sm font-medium transition-colors ${!hasPartTimeJob
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What do you typically spend on? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className={`p-3 rounded-xl border text-sm font-medium transition-colors ${typicalSpendCategories.includes(category)
                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 px-4 rounded-2xl font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-center mt-6">
          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
            Forgot Password?
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            <span className="font-semibold text-yellow-600">Demo Mode: No real money involved</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;