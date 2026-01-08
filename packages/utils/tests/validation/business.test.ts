import { describe, it, expect } from 'vitest';
import {
  isValidCouponCode,
  validateCouponCode,
  validatePrice,
  validateQuantity,
  validateRating,
  validateDiscountPercentage,
  validatePagination,
} from '../../src/validation/client';

describe('Validation Utilities - Business', () => {
  describe('Coupon Code Validation', () => {
    describe('isValidCouponCode', () => {
      it('should return true for valid coupon codes', () => {
        expect(isValidCouponCode('SAVE20')).toBe(true);
        expect(isValidCouponCode('SUMMER2024')).toBe(true);
      });
    });

    describe('validateCouponCode', () => {
      it('should return valid for correct code', () => {
        expect(validateCouponCode('SAVE20').valid).toBe(true);
      });

      it('should return error for empty code', () => {
        const result = validateCouponCode('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Coupon code is required');
      });
    });
  });

  describe('Price Validation', () => {
    describe('validatePrice', () => {
      it('should return valid for correct price', () => {
        expect(validatePrice(99.99).valid).toBe(true);
        expect(validatePrice('49.99').valid).toBe(true);
        expect(validatePrice(0).valid).toBe(true);
      });

      it('should return error for non-numeric price', () => {
        const result = validatePrice('abc');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Price must be a valid number');
      });

      it('should return error for negative price', () => {
        const result = validatePrice(-10);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Price cannot be negative');
      });

      it('should return error for price exceeding max', () => {
        const result = validatePrice(1000000);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Price exceeds maximum allowed value');
      });
    });
  });

  describe('Quantity Validation', () => {
    describe('validateQuantity', () => {
      it('should return valid for correct quantity', () => {
        expect(validateQuantity(10).valid).toBe(true);
        expect(validateQuantity('5').valid).toBe(true);
        expect(validateQuantity(0).valid).toBe(true);
      });

      it('should return error for non-numeric quantity', () => {
        const result = validateQuantity('abc');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Quantity must be a valid number');
      });

      it('should return error for negative quantity', () => {
        const result = validateQuantity(-5);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Quantity cannot be negative');
      });
    });
  });

  describe('Rating Validation', () => {
    describe('validateRating', () => {
      it('should return valid for correct rating', () => {
        expect(validateRating(4.5).valid).toBe(true);
        expect(validateRating(0).valid).toBe(true);
        expect(validateRating(5).valid).toBe(true);
      });

      it('should return error for non-numeric rating', () => {
        const result = validateRating('abc');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Rating must be a valid number');
      });

      it('should return error for out-of-range rating', () => {
        expect(validateRating(-1).valid).toBe(false);
        expect(validateRating(6).valid).toBe(false);
      });
    });
  });

  describe('Discount Validation', () => {
    describe('validateDiscountPercentage', () => {
      it('should return valid for correct discount', () => {
        expect(validateDiscountPercentage(25).valid).toBe(true);
        expect(validateDiscountPercentage(0).valid).toBe(true);
        expect(validateDiscountPercentage(100).valid).toBe(true);
      });

      it('should return error for non-numeric discount', () => {
        const result = validateDiscountPercentage('abc');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Discount must be a valid number');
      });

      it('should return error for out-of-range discount', () => {
        expect(validateDiscountPercentage(-10).valid).toBe(false);
        expect(validateDiscountPercentage(150).valid).toBe(false);
      });
    });
  });

  describe('Pagination Validation', () => {
    describe('validatePagination', () => {
      it('should return valid for correct pagination', () => {
        const result = validatePagination(1, 10);
        expect(result.valid).toBe(true);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
      });

      it('should use defaults for invalid values', () => {
        const result = validatePagination(null, null);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
      });

      it('should return error for page less than 1', () => {
        const result = validatePagination(0, 10);
        expect(result.valid).toBe(true);
        expect(result.error).toBe(undefined);
      });

      it('should return error for limit exceeding max', () => {
        const result = validatePagination(1, 200);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Limit cannot exceed 100');
      });
    });
  });
});
