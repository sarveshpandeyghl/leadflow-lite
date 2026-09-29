/**
 * Small LRU cache with per-entry TTL.
 * Least-recently-used entries are evicted once `max` is reached.
 */
export class LRUCache {
  constructor({ max = 100, ttlSeconds = 300 } = {}) {
    this.max = max;
    this.ttl = ttlSeconds;
    this.map = new Map(); // Map keeps insertion order -> first key is the LRU entry
  }

  get(key) {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value) {
    if (this.map.size >= this.max) {
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
    this.map.set(key, { value, expiresAt: Date.now() + this.ttl });
  }

  delete(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  get size() {
    return this.map.size;
  }
}
