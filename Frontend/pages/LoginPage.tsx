import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Shield, ArrowRight, User as UserIcon, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        }
      } else {
        // New user - go to onboarding
        setStep('onboarding');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
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
        console.log('Profile completion successful');
      } else {
        toast.error('Failed to complete setup. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const determineSegment = (allowance: number, hasJob: boolean, categories: string[]) => {
    if (allowance >= 8000 && hasJob) return 'high-earner';
    if (allowance >= 5000 && hasJob) return 'mid-earner';
    if (allowance >= 3000) return 'budget-conscious';
    return 'low-income';
  };

  const toggleCategory = (category: string) => {
    setTypicalSpendCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and App Name */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center mb-6"
          >
            <img src={Logo} alt="Wallex Logo" className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-xl" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-indigo-800 tracking-tight mb-2">Wallex</h1>
          <p className="text-gray-500 font-medium">Smart Finance for Students</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: EMAIL */}
            {step === 'email' && (
              <motion.form 
                key="email-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSendOTP} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${role === 'student'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {role === 'student' && (
                        <motion.div layoutId="active-role" className="absolute inset-0 bg-indigo-50/50" />
                      )}
                      <UserIcon className="w-6 h-6 mb-2 relative z-10" />
                      <span className="text-sm font-bold relative z-10">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('parent')}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 overflow-hidden ${role === 'parent'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                       {role === 'parent' && (
                        <motion.div layoutId="active-role" className="absolute inset-0 bg-indigo-50/50" />
                      )}
                      <Briefcase className="w-6 h-6 mb-2 relative z-10" />
                      <span className="text-sm font-bold relative z-10">Parent</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:font-normal"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-gray-900 text-white py-4 px-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center mt-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white relative z-10"></div>
                  ) : (
                    <span className="relative z-10 flex items-center">
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </motion.form>
            )}

            {/* STEP 2: OTP */}
            {step === 'otp' && (
              <motion.form 
                key="otp-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleVerifyOTP} 
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                    <Shield className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
                  <p className="text-sm text-gray-500 mt-2">We sent a verification code to <br/><span className="font-semibold text-gray-900">{email}</span></p>
                </div>

                <div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-4 bg-white/50 border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none text-center text-3xl font-bold tracking-[0.5em] text-gray-900"
                    placeholder="------"
                    maxLength={6}
                    required
                  />
                  <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                    <p className="text-xs text-indigo-700 font-medium">
                      Demo Mode: Use code <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded shadow-sm ml-1">123456</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 px-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Verify Code'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="w-full text-gray-500 hover:text-gray-900 font-medium text-sm py-3 transition-colors"
                  >
                    Use a different email
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: ONBOARDING */}
            {step === 'onboarding' && (
              <motion.form 
                key="onboarding-step"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleOnboarding} 
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Complete Setup</h2>
                  <p className="text-sm text-gray-500 mt-1">Let's personalize your Wallex experience.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                      Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  {role === 'student' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2 border-t border-gray-100"
                    >
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                          Monthly Allowance (₹)
                        </label>
                        <input
                          type="number"
                          value={allowanceAmount}
                          onChange={(e) => setAllowanceAmount(Number(e.target.value))}
                          className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium"
                          placeholder="5000"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                          Do you have a part-time job?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setHasPartTimeJob(true)}
                            className={`p-3 rounded-xl border-2 text-sm font-bold transition-colors ${hasPartTimeJob
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                              : 'border-gray-100 hover:border-gray-200 text-gray-600 bg-white'
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasPartTimeJob(false)}
                            className={`p-3 rounded-xl border-2 text-sm font-bold transition-colors ${!hasPartTimeJob
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                              : 'border-gray-100 hover:border-gray-200 text-gray-600 bg-white'
                              }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                          Typical expenses (Select multiple)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${typicalSpendCategories.includes(category)
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                                }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 px-4 rounded-xl font-bold shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Join Wallex'
                    )}
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center px-4">
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            By continuing, you agree to our <a href="#" className="underline hover:text-gray-900 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-gray-900 transition-colors">Privacy Policy</a>.
            <br />
            <span className="inline-block mt-3 text-indigo-700 font-bold bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">Test Drive Mode Enabled</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;