import { LRUCache } from '../cache/lruCache.js';

const contactCache = new LRUCache({ max: 500, ttlSeconds: 300 });

/**
 * Wraps a contactsApi so repeated `get` calls are served from memory.
 */
export function withContactCache(contactsApi, cache = contactCache) {
  const keyFor = (contactId) => `contact:${contactId}`;

  return {
    ...contactsApi,

    async get(locationId, contactId) {
      const cached = cache.get(keyFor(contactId));
      if (cached) return cached;

      const contact = await contactsApi.get(locationId, contactId);
      cache.set(keyFor(contactId), contact);
      return contact;
    },

    async update(locationId, contactId, patch) {
      const updated = await contactsApi.update(locationId, contactId, patch);
      cache.delete(contactId); // invalidate so the next get() refetches fresh data
      return updated;
    },
  };
}
