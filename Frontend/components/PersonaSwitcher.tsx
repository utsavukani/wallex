import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Crown, DollarSign, PiggyBank, Heart } from 'lucide-react';

interface PersonaSwitcherProps {
  onClose: () => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ onClose }) => {
  const { login, sendOTP } = useAuth();

  const personas = [
    {
      name: 'Aisha Patel',
      email: 'aisha@example.com',
      role: 'student' as const,
      segment: 'High Earner',
      dbSegment: 'high-earner',
      description: 'Part-time job + high allowance',
      icon: Crown,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      name: 'Rohit Kumar',
      email: 'rohit@example.com',
      role: 'student' as const,
      segment: 'Mid Earner',
      dbSegment: 'mid-earner',
      description: 'Part-time job + moderate allowance',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Meera Singh',
      email: 'meera@example.com',
      role: 'student' as const,
      segment: 'Budget Conscious',
      dbSegment: 'budget-conscious',
      description: 'No job, careful spender',
      icon: PiggyBank,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Kunal Sharma',
      email: 'kunal@example.com',
      role: 'student' as const,
      segment: 'Low Income',
      dbSegment: 'low-income',
      description: 'Low allowance, needs micro-savings',
      icon: Heart,
      color: 'text-red-600 bg-red-100'
    },
    {
      name: 'Farida Ahmed',
      email: 'farida@example.com',
      role: 'parent' as const,
      segment: 'Parent',
      description: "Aisha's parent",
      icon: User,
      color: 'text-gray-600 bg-gray-100'
    },
    {
      name: 'Mahesh Patel',
      email: 'mahesh@example.com',
      role: 'parent' as const,
      segment: 'Parent',
      description: "Rohit's parent",
      icon: User,
      color: 'text-gray-600 bg-gray-100'
    },
    {
      name: 'Priya Singh',
      email: 'priya@example.com',
      role: 'parent' as const,
      segment: 'Parent',
      description: "Meera's parent",
      icon: User,
      color: 'text-gray-600 bg-gray-100'
    },
    {
      name: 'Arun Kumar',
      email: 'arun@example.com',
      role: 'parent' as const,
      segment: 'Parent',
      description: "Kunal's parent",
      icon: User,
      color: 'text-gray-600 bg-gray-100'
    }
  ];

  const handlePersonaLogin = async (persona: typeof personas[0]) => {
    // 1. Force the backend to stage the OTP
    await sendOTP(persona.email, persona.role);

    // 2. Perform login and pass user data to create account if missing in live Atlas DB
    const success = await login(persona.email, '123456', {
      name: persona.name,
      role: persona.role,
      segment: 'dbSegment' in persona ? persona.dbSegment : undefined,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Accounts</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click any persona to login instantly (OTP: 123456)
      </p>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {personas.map((persona) => {
          const Icon = persona.icon;
          return (
            <button
              key={persona.email}
              onClick={() => handlePersonaLogin(persona)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${persona.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {persona.name}
                    </p>
                    <span className="text-xs text-gray-500 capitalize">
                      {persona.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {persona.segment}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {persona.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Demo Mode:</strong> All transactions are simulated. No real money is involved.
        </p>
      </div>
    </div>
  );
};

export default PersonaSwitcher;