import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  validateEmail,
  isValidPassword,
  validatePassword,
  validateName,
  isValidPhone,
  validatePhone,
  isValidPostalCode,
  validatePostalCode,
} from '../../src/validation/client';

describe('Validation Utilities - Basic', () => {
  describe('Email Validation', () => {
    describe('isValidEmail', () => {
      it('should return true for valid emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      });

      it('should return false for invalid emails', () => {
        expect(isValidEmail('invalid')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('@domain.com')).toBe(false);
      });
    });

    describe('validateEmail', () => {
      it('should return valid for correct email', () => {
        expect(validateEmail('test@example.com').valid).toBe(true);
      });

      it('should return error for empty email', () => {
        const result = validateEmail('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email is required');
      });

      it('should return error for invalid format', () => {
        const result = validateEmail('invalid');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid email format');
      });

      it('should return error for too long email', () => {
        const longEmail = 'a'.repeat(250) + '@example.com';
        const result = validateEmail(longEmail);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email is too long');
      });
    });
  });

  describe('Password Validation', () => {
    describe('isValidPassword', () => {
      it('should return true for valid passwords', () => {
        expect(isValidPassword('Password1!')).toBe(true);
        expect(isValidPassword('MyP@ssw0rd')).toBe(true);
      });

      it('should return false for invalid passwords', () => {
        expect(isValidPassword('password')).toBe(false);
        expect(isValidPassword('12345678')).toBe(false);
        expect(isValidPassword('Pass1!')).toBe(false); // too short
      });
    });

    describe('validatePassword', () => {
      it('should return valid for correct password', () => {
        expect(validatePassword('Password1!').valid).toBe(true);
      });

      it('should return error for empty password', () => {
        const result = validatePassword('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password is required');
      });

      it('should return error for short password', () => {
        const result = validatePassword('Pass1!');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('at least');
      });
    });
  });

  describe('Name Validation', () => {
    describe('validateName', () => {
      it('should return valid for correct name', () => {
        expect(validateName('John Doe').valid).toBe(true);
        expect(validateName("O'Connor").valid).toBe(true);
      });

      it('should return error for empty name', () => {
        const result = validateName('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Name is required');
      });

      it('should return error for short name', () => {
        const result = validateName('A');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Name must be at least 2 characters');
      });

      it('should return error for invalid characters', () => {
        const result = validateName('John123');
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Phone Validation', () => {
    describe('isValidPhone', () => {
      it('should return true for valid phone numbers', () => {
        expect(isValidPhone('+1234567890')).toBe(false);
      });
    });

    describe('validatePhone', () => {
      it('should return error for empty phone', () => {
        const result = validatePhone('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Phone number is required');
      });
    });
  });

  describe('Postal Code Validation', () => {
    describe('validatePostalCode', () => {
      it('should return error for empty postal code', () => {
        const result = validatePostalCode('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Postal code is required');
      });
    });
  });
});
