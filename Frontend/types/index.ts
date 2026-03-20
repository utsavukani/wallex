// src/types/index.ts

// --- ENUMS ---
export type UserRole = 'student' | 'parent';
export type UserSegment = 'high-earner' | 'mid-earner' | 'budget-conscious' | 'low-income';
export type TransactionDirection = 'debit' | 'credit';
export type TransactionMethod = 'UPI' | 'Card' | 'Cash' | 'Bank Transfer';
export type TransactionSource = 'manual' | 'smsMock' | 'webhookMock' | 'receiptOCR';
export type GoalType = 'Emergency' | 'Trip' | 'Gadget' | 'Education' | 'Other';
export type GoalStatus = 'active' | 'completed' | 'paused';
export type GoalFrequency = 'daily' | 'weekly' | 'monthly';

// --- MODELS ---

export interface User {
    _id: string;
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
    linkedUserIds: string[];
    segment?: UserSegment;
    onboardingData?: {
        allowanceAmount?: number;
        hasPartTimeJob?: boolean;
        typicalSpendCategories?: string[];
    };
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    _id: string;
    userId: string;
    amount: number;
    direction: TransactionDirection;
    method: TransactionMethod;
    merchant?: string;
    note?: string;
    timestamp: string;
    rawSource: TransactionSource;
    category: string;
    subCategory?: string;
    confidence: number;
    isConfirmed: boolean;
    originalCategory?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Goal {
    _id: string;
    userId: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    type: GoalType;
    status: GoalStatus;
    autoRoundup: boolean;
    scheduledAmount: number;
    scheduledFrequency?: GoalFrequency;
    createdAt: string;
    updatedAt: string;
}

// --- API RESPONSES ---
export interface AuthResponse {
    token: string;
    user: User;
}

export interface AnalyticsSummary {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: number;
}

export interface ExpenseByCategory {
    _id: string; // The category name
    total: number;
    count: number;
}
