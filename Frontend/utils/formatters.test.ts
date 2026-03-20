import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateProgressPercentage } from './formatters';

describe('formatters utility', () => {

  describe('formatCurrency()', () => {
    it('should format numbers with comma separation according to Indian numbering system', () => {
      expect(formatCurrency(100000)).toBe('₹1,00,000');
      expect(formatCurrency(5000)).toBe('₹5,000');
    });

    it('should include or exclude the currency symbol based on the parameter', () => {
      expect(formatCurrency(500, false)).toBe('500');
      expect(formatCurrency(500, true)).toBe('₹500');
    });

    it('should handle zero cleanly', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });
  });

  describe('calculateProgressPercentage()', () => {
    it('should calculate the correct percentage', () => {
      expect(calculateProgressPercentage(50, 100)).toBe(50);
      expect(calculateProgressPercentage(25, 100)).toBe(25);
    });

    it('should cap the percentage at 100% even if current exceeds target', () => {
      expect(calculateProgressPercentage(150, 100)).toBe(100);
    });

    it('should handle divide by zero or negative target by returning 0', () => {
      expect(calculateProgressPercentage(50, 0)).toBe(0);
      expect(calculateProgressPercentage(50, -10)).toBe(0);
    });
    
    it('should handle negative current amount by returning 0', () => {
      expect(calculateProgressPercentage(-50, 100)).toBe(0);
    });
  });

});
