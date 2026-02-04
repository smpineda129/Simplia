export const createRateLimiter = (options = {}) => {
  const rateLimit = new Map();
  const windowMs = options.windowMs || 15 * 60 * 1000; // Default 15 minutes
  const max = options.max || 100; // Default 100 requests
  const message = options.message || 'Demasiados intentos, por favor intente nuevamente más tarde.';

  // Cleanup every windowMs to prevent memory leaks
  // We can just clear the whole map if we want to be simple, or granularly check.
  // For simplicity and performance, granular check is better if window is long.
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimit.entries()) {
      if (now - record.startTime > windowMs) {
        rateLimit.delete(ip);
      }
    }
  }, windowMs).unref();

  return (req, res, next) => {
    // Use X-Forwarded-For if behind proxy, otherwise remoteAddress
    // Or prefer req.ip if available (Express)
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, { count: 1, startTime: now });
      return next();
    }

    const record = rateLimit.get(ip);

    if (now - record.startTime > windowMs) {
      // Reset window
      record.count = 1;
      record.startTime = now;
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    record.count++;
    next();
  };
};

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Demasiados intentos de inicio de sesión. Por favor intente nuevamente en 15 minutos.'
});
