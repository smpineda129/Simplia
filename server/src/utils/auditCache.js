export class AuditCache {
  constructor(ttlSeconds = 5) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  // Generate a key for the event
  // Key: userId:eventName:modelName:targetId
  getKey(userId, eventName, modelName, targetId) {
    return `${userId}:${eventName}:${modelName}:${targetId}`;
  }

  shouldLog(userId, eventName, modelName, targetId) {
    const key = this.getKey(userId, eventName, modelName, targetId);
    const now = Date.now();
    const lastLog = this.cache.get(key);

    if (lastLog && (now - lastLog < this.ttl)) {
      return false; // Debounce: Already logged recently
    }

    // Update cache
    this.cache.set(key, now);
    this.cleanup(); // Lazy cleanup
    return true;
  }

  cleanup() {
    const now = Date.now();
    // Simple cleanup: if map gets too big, or just check expiration?
    // To keep it simple and efficient, only iterate if size > 1000
    if (this.cache.size > 1000) {
      for (const [key, timestamp] of this.cache.entries()) {
        if (now - timestamp > this.ttl) {
          this.cache.delete(key);
        }
      }
    }
  }
}

export const auditCache = new AuditCache(5); // 5 seconds TTL
