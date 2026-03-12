import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { Goal } from '../models/Goal.js';
import { AllowanceRequest } from '../models/AllowanceRequest.js';

const seedData = async () => {
  try {
    // Connect to MongoDB
await mongoose.connect(config.mongoUri);
console.log('Connected to MongoDB');

// Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Goal.deleteMany({});
    await AllowanceRequest.deleteMany({});

    // Create demo users
    const users = await User.create([
      {
        name: 'Aisha Patel',
        email: 'aisha@example.com',
      role: 'student',
      segment: 'high-earner',
        phone: '+91 9876543210',
        isVerified: true,
      onboardingData: {
          allowanceAmount: 8000,
        hasPartTimeJob: true,
          typicalSpendCategories: ['Food', 'Transport', 'Academic', 'Entertainment']
        }
      },
      {
        name: 'Rohit Kumar',
        email: 'rohit@example.com',
      role: 'student',
      segment: 'mid-earner',
        phone: '+91 9876543211',
        isVerified: true,
      onboardingData: {
        allowanceAmount: 5000,
        hasPartTimeJob: true,
          typicalSpendCategories: ['Food', 'Transport', 'Academic']
        }
      },
      {
        name: 'Meera Singh',
        email: 'meera@example.com',
        role: 'student',
        segment: 'budget-conscious',
        phone: '+91 9876543212',
        isVerified: true,
        onboardingData: {
          allowanceAmount: 3000,
          hasPartTimeJob: false,
          typicalSpendCategories: ['Food', 'Academic', 'Bills']
        }
      },
      {
        name: 'Kunal Sharma',
        email: 'kunal@example.com',
      role: 'student',
        segment: 'low-income',
        phone: '+91 9876543213',
        isVerified: true,
      onboardingData: {
          allowanceAmount: 1500,
        hasPartTimeJob: false,
          typicalSpendCategories: ['Food', 'Academic']
        }
      },
      {
        name: 'Farida Ahmed',
        email: 'farida@example.com',
        role: 'parent',
        phone: '+91 9876543214',
      isVerified: true
    },
      {
        name: 'Mahesh Patel',
        email: 'mahesh@example.com',
      role: 'parent',
        phone: '+91 9876543215',
        isVerified: true
      },
      {
        name: 'Priya Singh',
      email: 'priya@example.com',
        role: 'parent',
        phone: '+91 9876543216',
      isVerified: true
    },
      {
        name: 'Arun Kumar',
        email: 'arun@example.com',
        role: 'parent',
        phone: '+91 9876543217',
        isVerified: true
      }
    ]);

    // Create demo transactions
    const transactions = await Transaction.create([
      {
        userId: users[0]._id, // Aisha
        amount: 4000,
        direction: 'credit',
        method: 'UPI',
        merchant: 'Salary',
        note: 'Monthly salary from internship',
        category: 'Income',
        confidence: 0.95,
        isConfirmed: true,
        timestamp: new Date('2024-04-30T18:27:00Z')
      },
      {
        userId: users[0]._id,
        amount: 150,
        direction: 'debit',
        method: 'UPI',
        merchant: 'Swiggy',
        note: 'Lunch delivery',
        category: 'Food',
        confidence: 0.92,
        isConfirmed: true,
        timestamp: new Date('2024-04-30T12:30:00Z')
      },
      {
        userId: users[1]._id, // Rohit
        amount: 2500,
        direction: 'credit',
        method: 'UPI',
        merchant: 'Part-time Job',
        note: 'Weekly payment',
        category: 'Income',
        confidence: 0.95,
        isConfirmed: true,
        timestamp: new Date('2024-04-29T16:00:00Z')
      },
      {
        userId: users[1]._id,
        amount: 100,
        direction: 'debit',
        method: 'UPI',
        merchant: 'Grocery Store',
        note: 'Groceries',
        category: 'Food',
        confidence: 0.88,
        isConfirmed: true,
        timestamp: new Date('2024-04-28T17:00:00Z')
      },
      {
        userId: users[2]._id, // Meera
        amount: 3000,
        direction: 'credit',
        method: 'UPI',
        merchant: 'Allowance',
        note: 'Monthly allowance',
        category: 'Income',
        confidence: 0.95,
        isConfirmed: true,
        timestamp: new Date('2024-04-30T10:00:00Z')
      },
      {
        userId: users[2]._id,
        amount: 674.40,
        direction: 'debit',
        method: 'UPI',
        merchant: 'Rent',
        note: 'Monthly rent payment',
        category: 'Bills',
        confidence: 0.95,
        isConfirmed: true,
        timestamp: new Date('2024-04-15T08:30:00Z')
      }
    ]);

    // Create demo goals
    const goals = await Goal.create([
      {
        userId: users[0]._id,
        title: 'New Laptop',
        targetAmount: 50000,
        currentAmount: 15000,
        category: 'long-term',
        deadline: new Date('2024-12-31'),
        isActive: true
      },
      {
        userId: users[1]._id,
        title: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 3500,
        category: 'long-term',
        isActive: true
      },
      {
        userId: users[2]._id,
        title: 'Books for Semester',
        targetAmount: 2000,
        currentAmount: 800,
        category: 'short-term',
        deadline: new Date('2024-06-30'),
        isActive: true
      }
    ]);

    // Create demo allowance requests
    const allowanceRequests = await AllowanceRequest.create([
      {
        studentId: users[0]._id,
        parentId: users[4]._id,
        amount: 2000,
        reason: 'Monthly allowance for April',
        status: 'pending',
        category: 'Monthly'
      },
      {
        studentId: users[1]._id,
        parentId: users[5]._id,
        amount: 500,
        reason: 'Books for semester',
        status: 'approved',
        category: 'Academic'
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${transactions.length} transactions`);
    console.log(`Created ${goals.length} goals`);
    console.log(`Created ${allowanceRequests.length} allowance requests`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();