import axios from 'axios';
import type {
  User,
  Transaction,
  Goal,
  AuthResponse,
  AnalyticsSummary,
  ExpenseByCategory
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // For demo purposes, don't redirect on 401 errors
      console.warn('API returned 401, but continuing in demo mode');
    } else {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOTP: (email: string, role: 'student' | 'parent'): Promise<{ message: string }> =>
    api.post('/auth/otp', { email, role }).then(res => res.data),

  verifyOTP: (email: string, otp: string, userData?: Partial<User>): Promise<AuthResponse> =>
    api.post('/auth/verify', { email, otp, ...userData }).then(res => res.data),

  login: (email: string, otp: string, userData?: Partial<User>): Promise<AuthResponse> =>
    api.post('/auth/login', { email, otp, ...userData }).then(res => res.data),

  getCurrentUser: (): Promise<User> =>
    api.get('/auth/me').then(res => res.data),
};

// User API
export const userAPI = {
  getProfile: (): Promise<User> =>
    api.get('/users/profile').then(res => res.data),

  updateProfile: (data: Partial<User>): Promise<User> =>
    api.patch('/users/profile', data).then(res => res.data),

  getBalance: (): Promise<{ balance: number }> =>
    api.get('/users/balance').then(res => res.data),

  updateSegment: (segment: string): Promise<User> =>
    api.patch('/users/segment', { segment }).then(res => res.data),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (params?: Record<string, string | number>): Promise<Transaction[]> =>
    api.get('/transactions', { params }).then(res => res.data),

  createTransaction: (data: Partial<Transaction>): Promise<Transaction> =>
    api.post('/transactions', data).then(res => res.data),

  parseSMS: (smsText: string): Promise<Partial<Transaction>> =>
    api.post('/transactions/parse-sms', { smsText }).then(res => res.data),

  mockUPI: (): Promise<Transaction> =>
    api.post('/transactions/mock-upi').then(res => res.data),

  updateCategory: (id: string, category: string): Promise<Transaction> =>
    api.patch(`/transactions/${id}/category`, { category }).then(res => res.data),

  getCategories: (): Promise<string[]> =>
    api.get('/transactions/categories').then(res => res.data),

  deleteTransaction: (id: string): Promise<{ message: string }> =>
    api.delete(`/transactions/${id}`).then(res => res.data),
};

// Goal API
export const goalAPI = {
  getGoals: (status?: string): Promise<Goal[]> =>
    api.get('/goals', { params: status ? { status } : {} }).then(res => res.data),

  createGoal: (data: Partial<Goal>): Promise<Goal> =>
    api.post('/goals', data).then(res => res.data),

  topupGoal: (id: string, amount: number): Promise<Goal> =>
    api.patch(`/goals/${id}/topup`, { amount }).then(res => res.data),

  updateGoal: (id: string, data: Partial<Goal>): Promise<Goal> =>
    api.patch(`/goals/${id}`, data).then(res => res.data),

  deleteGoal: (id: string): Promise<{ message: string }> =>
    api.delete(`/goals/${id}`).then(res => res.data),

  getRecommendations: (): Promise<Partial<Goal>[]> =>
    api.get('/goals/recommendations').then(res => res.data),
};

// Analytics API
export const analyticsAPI = {
  getSummary: (period?: string): Promise<AnalyticsSummary> =>
    api.get('/analytics/summary', { params: period ? { period } : {} }).then(res => res.data),

  getTrends: (period?: string, category?: string): Promise<{ dates: string[], amounts: number[] }> =>
    api.get('/analytics/trends', { params: { period, category } }).then(res => res.data),

  getInsights: (): Promise<{ id: string, title: string, description: string, type: string, actionText?: string }[]> =>
    api.get('/analytics/insights').then(res => res.data),

  getSpendingByCategory: (period?: string): Promise<ExpenseByCategory[]> =>
    api.get('/analytics/spending-by-category', { params: period ? { period } : {} }).then(res => res.data),

  getIncomeVolatility: (): Promise<{ volatilityScore: number, trend: string }> =>
    api.get('/analytics/income-volatility').then(res => res.data),
};

// Parent API
export const parentAPI = {
  inviteParent: (parentEmail: string): Promise<{ message: string }> =>
    api.post('/parent/invite', { parentEmail }).then(res => res.data),

  acceptInvite: (studentId: string): Promise<{ message: string }> =>
    api.post('/parent/accept', { studentId }).then(res => res.data),

  getChildren: (): Promise<User[]> =>
    api.get('/parent/children').then(res => res.data),

  getChildSummary: (childId: string, period?: string): Promise<AnalyticsSummary> =>
    api.get(`/parent/child/${childId}/summary`, { params: period ? { period } : {} }).then(res => res.data),

  removeChild: (childId: string): Promise<{ message: string }> =>
    api.delete(`/parent/child/${childId}`).then(res => res.data),

  getInsights: (): Promise<unknown[]> =>
    api.get('/parent/insights').then(res => res.data),
};

// Allowance API
export const allowanceAPI = {
  getRequests: (status?: string): Promise<unknown[]> =>
    api.get('/allowance', { params: status ? { status } : {} }).then(res => res.data),

  createRequest: (data: Record<string, unknown>): Promise<unknown> =>
    api.post('/allowance', data).then(res => res.data),

  makeDecision: (id: string, status: 'approved' | 'rejected', parentNote?: string): Promise<unknown> =>
    api.post(`/allowance/${id}/decision`, { status, parentNote }).then(res => res.data),

  getRequest: (id: string): Promise<unknown> =>
    api.get(`/allowance/${id}`).then(res => res.data),

  getStats: (): Promise<unknown> =>
    api.get('/allowance/stats').then(res => res.data),
};

// Education API
export const educationAPI = {
  getArticles: (segment?: string): Promise<unknown[]> =>
    api.get('/education/articles', { params: segment ? { segment } : {} }).then(res => res.data),

  getQuizzes: (difficulty?: string): Promise<unknown[]> =>
    api.get('/education/quizzes', { params: difficulty ? { difficulty } : {} }).then(res => res.data),

  getChallenges: (): Promise<unknown[]> =>
    api.get('/education/challenges').then(res => res.data),

  completeArticle: (articleId: string): Promise<unknown> =>
    api.post(`/education/articles/${articleId}/complete`).then(res => res.data),

  submitQuiz: (quizId: string, answers: unknown[]): Promise<unknown> =>
    api.post(`/education/quizzes/${quizId}/submit`, { answers }).then(res => res.data),

  getProgress: (): Promise<unknown> =>
    api.get('/education/progress').then(res => res.data),
};

// ML API
export const mlAPI = {
  categorize: (data: Record<string, unknown>): Promise<{ category: string, confidence: number }> =>
    api.post('/ml/categorize', data).then(res => res.data),

  getStats: (): Promise<unknown> =>
    api.get('/ml/stats').then(res => res.data),

  predictIncome: (data: Record<string, unknown>): Promise<unknown> =>
    api.post('/ml/predict-income', data).then(res => res.data),

  getRecommendations: (segment: string): Promise<unknown[]> =>
    api.get('/ml/recommendations', { params: { segment } }).then(res => res.data),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (): Promise<unknown[]> =>
    api.get('/notifications').then(res => res.data),

  markAsRead: (id: string): Promise<unknown> =>
    api.patch(`/notifications/${id}/read`).then(res => res.data),

  markAllAsRead: (): Promise<{ message: string }> =>
    api.patch('/notifications/read-all').then(res => res.data),

  updatePreferences: (preferences: Record<string, boolean>): Promise<unknown> =>
    api.patch('/notifications/preferences', preferences).then(res => res.data),
};

// Settings API
export const settingsAPI = {
  updateSettings: (settings: Record<string, unknown>): Promise<unknown> =>
    api.patch('/settings', settings).then(res => res.data),

  getSettings: (): Promise<unknown> =>
    api.get('/settings').then(res => res.data),

  updatePassword: (data: Record<string, unknown>): Promise<{ message: string }> =>
    api.patch('/settings/password', data).then(res => res.data),

  deleteAccount: (): Promise<{ message: string }> =>
    api.delete('/settings/account').then(res => res.data),
};