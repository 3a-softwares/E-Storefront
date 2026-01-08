import { describe, it, expect } from 'vitest';
import {
  PORT_CONFIG,
  SERVICE_URLS,
  DEFAULT_CORS_ORIGINS,
  JWT_CONFIG,
  PAGINATION,
  PRODUCT_CONFIG,
  ORDER_CONFIG,
  COUPON_CONFIG,
  HTTP_STATUS,
} from '../../src/constants';

describe('Constants', () => {
  describe('PORT_CONFIG', () => {
    it('should have all service ports defined', () => {
      expect(PORT_CONFIG.AUTH_SERVICE).toBe(3011);
      expect(PORT_CONFIG.PRODUCT_SERVICE).toBe(3014);
      expect(PORT_CONFIG.ORDER_SERVICE).toBe(3015);
      expect(PORT_CONFIG.CATEGORY_SERVICE).toBe(3012);
      expect(PORT_CONFIG.COUPON_SERVICE).toBe(3013);
      expect(PORT_CONFIG.GRAPHQL_GATEWAY).toBe(4000);
    });

    it('should have all app ports defined', () => {
      expect(PORT_CONFIG.STOREFRONT_APP).toBe(3000);
      expect(PORT_CONFIG.ADMIN_APP).toBe(3001);
      expect(PORT_CONFIG.SELLER_APP).toBe(3002);
      expect(PORT_CONFIG.SHELL_APP).toBe(3003);
    });
  });

  describe('SERVICE_URLS', () => {
    it('should have all service URLs defined', () => {
      expect(SERVICE_URLS.AUTH_SERVICE).toContain('localhost');
      expect(SERVICE_URLS.PRODUCT_SERVICE).toContain('localhost');
      expect(SERVICE_URLS.GRAPHQL_GATEWAY).toContain('graphql');
    });
  });

  describe('DEFAULT_CORS_ORIGINS', () => {
    it('should have default CORS origins', () => {
      expect(DEFAULT_CORS_ORIGINS).toBeInstanceOf(Array);
      expect(DEFAULT_CORS_ORIGINS.length).toBeGreaterThan(0);
      expect(DEFAULT_CORS_ORIGINS).toContain('http://localhost:3000');
    });
  });

  describe('JWT_CONFIG', () => {
    it('should have JWT configuration', () => {
      expect(JWT_CONFIG.ACCESS_TOKEN_EXPIRY).toBe('1h');
      expect(JWT_CONFIG.REFRESH_TOKEN_EXPIRY).toBe('7d');
      expect(JWT_CONFIG.PASSWORD_MIN_LENGTH).toBe(8);
      expect(JWT_CONFIG.PASSWORD_PATTERN).toBeInstanceOf(RegExp);
    });
  });

  describe('PAGINATION', () => {
    it('should have pagination defaults', () => {
      expect(PAGINATION.DEFAULT_PAGE).toBe(1);
      expect(PAGINATION.DEFAULT_LIMIT).toBe(10);
      expect(PAGINATION.MAX_PAGE_SIZE).toBe(100);
      expect(PAGINATION.MIN_PAGE_SIZE).toBe(1);
    });
  });

  describe('PRODUCT_CONFIG', () => {
    it('should have product configuration', () => {
      expect(PRODUCT_CONFIG.MIN_PRICE).toBe(0);
      expect(PRODUCT_CONFIG.MAX_PRICE).toBe(999999.99);
      expect(PRODUCT_CONFIG.MAX_RATING).toBe(5);
      expect(PRODUCT_CONFIG.ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
    });
  });

  describe('ORDER_CONFIG', () => {
    it('should have order configuration', () => {
      expect(ORDER_CONFIG.TAX_RATE).toBe(0.1);
      expect(ORDER_CONFIG.SHIPPING_COST_STANDARD).toBe(50);
      expect(ORDER_CONFIG.SHIPPING_COST_EXPRESS).toBe(150);
    });
  });

  describe('COUPON_CONFIG', () => {
    it('should have coupon configuration', () => {
      expect(COUPON_CONFIG.CODE_LENGTH).toBe(6);
      expect(COUPON_CONFIG.CODE_UPPERCASE).toBe(true);
      expect(COUPON_CONFIG.MAX_DISCOUNT_PERCENTAGE).toBe(100);
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });
});
