import { describe, it, expect } from 'vitest';
import {
  isValidObjectId,
  validateObjectId,
  isValidUrl,
  validateUrl,
  isValidSku,
  validateSku,
  validateDate,
  validateDateRange,
  batchValidate,
} from '../../src/validation/client';

describe('Validation Utilities - Advanced', () => {
  describe('Object ID Validation', () => {
    describe('isValidObjectId', () => {
      it('should return true for valid MongoDB ObjectId', () => {
        expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      });

      it('should return false for invalid ObjectId', () => {
        expect(isValidObjectId('invalid')).toBe(false);
        expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // 23 chars
        expect(isValidObjectId('507f1f77bcf86cd7994390111')).toBe(false); // 25 chars
      });
    });

    describe('validateObjectId', () => {
      it('should return valid for correct ObjectId', () => {
        expect(validateObjectId('507f1f77bcf86cd799439011').valid).toBe(true);
      });

      it('should return error for empty ObjectId', () => {
        const result = validateObjectId('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('ID is required');
      });

      it('should use custom field name in error', () => {
        const result = validateObjectId('', 'User ID');
        expect(result.error).toBe('User ID is required');
      });
    });
  });

  describe('URL Validation', () => {
    describe('isValidUrl', () => {
      it('should return true for valid URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://localhost:3000')).toBe(false);
      });
    });

    describe('validateUrl', () => {
      it('should return error for empty URL', () => {
        const result = validateUrl('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('URL is required');
      });
    });
  });

  describe('SKU Validation', () => {
    describe('isValidSku', () => {
      it('should return true for valid SKUs', () => {
        expect(isValidSku('PROD-001')).toBe(true);
        expect(isValidSku('ABC123')).toBe(true);
      });
    });

    describe('validateSku', () => {
      it('should return error for empty SKU', () => {
        const result = validateSku('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('SKU is required');
      });
    });
  });

  describe('Date Validation', () => {
    describe('validateDate', () => {
      it('should return valid for correct date', () => {
        expect(validateDate('2024-01-15').valid).toBe(true);
        expect(validateDate(new Date()).valid).toBe(true);
      });

      it('should return error for invalid date', () => {
        const result = validateDate('not-a-date');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid date format');
      });
    });

    describe('validateDateRange', () => {
      it('should return valid for correct date range', () => {
        const result = validateDateRange('2024-01-01', '2024-12-31');
        expect(result.valid).toBe(true);
      });

      it('should return error for invalid start date', () => {
        const result = validateDateRange('invalid', '2024-12-31');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid start date');
      });

      it('should return error for invalid end date', () => {
        const result = validateDateRange('2024-01-01', 'invalid');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid end date');
      });

      it('should return error when start is after end', () => {
        const result = validateDateRange('2024-12-31', '2024-01-01');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Start date must be before end date');
      });
    });
  });

  describe('Batch Validation', () => {
    describe('batchValidate', () => {
      it('should return valid when all validations pass', () => {
        const result = batchValidate([{ valid: true }, { valid: true }]);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should collect all errors', () => {
        const result = batchValidate([
          { valid: false, error: 'Error 1' },
          { valid: true },
          { valid: false, error: 'Error 2' },
        ]);
        expect(result.valid).toBe(false);
        expect(result.errors).toEqual(['Error 1', 'Error 2']);
      });
    });
  });
});
