/**
 * Formats a given amount into Indian Rupee currency string.
 * Uses strict typing to ensure no `any` parameters are allowed.
 * 
 * @param amount - The numerical amount to format (e.g., 50000)
 * @param includeSymbol - Whether to include the ₹ prefix
 * @returns Formatted string (e.g., "₹50,000")
 */
export const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
  if (isNaN(amount)) return includeSymbol ? '₹0' : '0';
  
  const formatted = amount.toLocaleString('en-IN');
  return includeSymbol ? `₹${formatted}` : formatted;
};

/**
 * Calculates the progress percentage of a goal.
 * Safely handles divide by zero and negative numbers.
 * 
 * @param current - Current amount saved
 * @param target - Target amount
 * @returns Percentage between 0 and 100
 */
export const calculateProgressPercentage = (current: number, target: number): number => {
  if (target <= 0) return 0;
  if (current < 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(Math.round(percentage), 100);
};
