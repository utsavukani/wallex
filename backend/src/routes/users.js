import express from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Account } from '../models/Account.js';
import { Transaction } from '../models/Transaction.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('linkedUserIds', 'name email role')
      .select('-__v');

    let account = null;
    if (user.role === 'student') {
      account = await Account.findOne({ userId: user._id });
    }

    res.json({
      user,
      account
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user profile
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(2).max(100).optional(),
      phone: z.string().min(7).max(20).optional()
    }).refine(data => Object.keys(data).length > 0, { message: 'No updates provided' });

    const updates = schema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get account balance (for students)
router.get('/balance', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students have account balances' });
    }

    const account = await Account.findOne({ userId: req.user._id });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Recalculate true balance by actively querying all User transactions
    const transactions = await Transaction.find({ userId: req.user._id });
    let trueBalance = account.balanceSimulated || 5000; // Base starting allowance logic if applicable
    
    // In our architecture, the onboarded allowance is the starting absolute
    let totalCredits = 0;
    let totalDebits = 0;

    transactions.forEach(t => {
      if (t.direction === 'credit') totalCredits += t.amount;
      if (t.direction === 'debit') totalDebits += t.amount;
    });

    // The starting base balance is basically just their allowance parameter from Onboarding
    // Any new expenses deduct from it.
    // If we assume `balanceSimulated` inherently caught the allowance correctly at signup:
    // We should strictly aggregate: (Allowance Base) + Credits - Debits
    // Since Account stored the base initially, let's trace back to their base Allowance if possible.
    const user = await User.findById(req.user._id);
    const baseAllowance = user?.onboardingData?.allowanceAmount || 5000;
    const dynamicBalance = baseAllowance + totalCredits - totalDebits;

    // Sync it back for good measure
    account.balanceSimulated = dynamicBalance;
    await account.save();

    res.json({
      balance: dynamicBalance,
      currency: account.currency,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user segment
router.patch('/segment', authenticate, async (req, res) => {
  try {
    const { segment } = z.object({
      segment: z.enum(['high-earner', 'mid-earner', 'budget-conscious', 'low-income'])
    }).parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { segment },
      { new: true, runValidators: true }
    ).select('-__v');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { router as userRoutes };