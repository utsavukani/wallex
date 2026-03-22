import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Account } from '../models/Account.js';
import { config } from '../config/index.js';
import { determineSegment } from '../utils/segmentation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Mock OTP storage (in production, use Redis)
const otpStore = new Map();

// Rate limiters for auth endpoints to mitigate abuse
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false
});

const sendOtpSchema = z.object({
  email: z.string().email(),
  role: z.enum(['student', 'parent'])
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  role: z.enum(['student', 'parent']).optional(),
  segment: z.string().optional(),
  onboardingData: z.object({
    allowanceAmount: z.number().optional(),
    hasPartTimeJob: z.boolean().optional(),
    typicalSpendCategories: z.array(z.string()).optional()
  }).optional()
});

// Send OTP
router.post('/otp', otpLimiter, async (req, res) => {
  try {
    const { email, role } = sendOtpSchema.parse(req.body);

    // Generate mock OTP
    const otp = '123456'; // In production, generate random 6-digit OTP

    // Store OTP (expires in 10 minutes)
    otpStore.set(email, {
      otp,
      role,
      expires: Date.now() + 10 * 60 * 1000
    });

    // In production, send OTP via SMS/Email
    console.log(`Mock OTP for ${email}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify OTP and login/register
router.post('/verify', verifyLimiter, async (req, res) => {
  try {
    const data = verifyOtpSchema.parse(req.body);
    const { email, otp, name, phone, onboardingData, role, segment } = data;

    // Verify OTP
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      if (!name) {
        return res.status(400).json({ error: 'Name is required for new users' });
      }

      const finalRole = storedOtp.role || role || 'student';

      const userSegment = finalRole === 'student' && onboardingData
        ? determineSegment(onboardingData)
        : segment || undefined;

      user = new User({
        role: finalRole,
        name,
        email,
        phone,
        segment: userSegment,
        onboardingData,
        isVerified: true
      });

      await user.save();

      // Create account for new users
      if (finalRole === 'student') {
        const account = new Account({
          userId: user._id,
          balanceSimulated: onboardingData?.allowanceAmount || 5000
        });
        await account.save();
      }

      isNewUser = true;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Clean up OTP
    otpStore.delete(email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        segment: user.segment,
        isVerified: user.isVerified
      },
      isNewUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('linkedUserIds');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      segment: user.segment,
      linkedUsers: user.linkedUserIds,
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export { router as authRoutes };