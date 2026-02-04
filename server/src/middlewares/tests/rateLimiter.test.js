import { createRateLimiter, registerRateLimiter, refreshRateLimiter } from '../rateLimiter.js';
import { jest } from '@jest/globals';

describe('Rate Limiter Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Unique IP for each test to ensure clean state
    const uniqueIp = `127.0.0.${Math.floor(Math.random() * 255)}`;
    req = {
      headers: {},
      socket: { remoteAddress: uniqueIp },
      ip: uniqueIp
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('should allow requests within limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 2 });

    // First request
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    // Second request
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
  });

  test('should block requests exceeding limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 });

    // First request
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    // Second request (should fail)
    next.mockClear();
    limiter(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false
    }));
  });

  test('should reset limit after window expires', async () => {
    // Use fake timers to test time window
    jest.useFakeTimers();
    const limiter = createRateLimiter({ windowMs: 1000, max: 1 });

    // First request
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    // Advance time beyond window
    jest.advanceTimersByTime(1100);

    // Should allow request again
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  test('registerRateLimiter should limit to 5 requests per hour', () => {
     // We cannot easily test the exact windowMs without mocking Date.now inside the module closure or exporting options.
     // But we can test the count limit (max=5).

     for (let i = 0; i < 5; i++) {
        registerRateLimiter(req, res, next);
     }
     expect(next).toHaveBeenCalledTimes(5);

     // 6th request should fail
     next.mockClear();
     registerRateLimiter(req, res, next);
     expect(next).not.toHaveBeenCalled();
     expect(res.status).toHaveBeenCalledWith(429);
  });

  test('refreshRateLimiter should limit to 20 requests per hour', () => {
     for (let i = 0; i < 20; i++) {
        refreshRateLimiter(req, res, next);
     }
     expect(next).toHaveBeenCalledTimes(20);

     // 21st request should fail
     next.mockClear();
     refreshRateLimiter(req, res, next);
     expect(next).not.toHaveBeenCalled();
     expect(res.status).toHaveBeenCalledWith(429);
  });
});
