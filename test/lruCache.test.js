import test from 'node:test';
import assert from 'node:assert/strict';
import { LRUCache } from '../src/cache/lruCache.js';
import { withContactCache } from '../src/api/cachedContactsApi.js';

test('stores and returns values', () => {
  const cache = new LRUCache({ max: 2 });
  cache.set('a', 1);
  assert.equal(cache.get('a'), 1);
});

test('evicts the least recently used entry when full', () => {
  const cache = new LRUCache({ max: 2 });
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);
  assert.equal(cache.get('a'), undefined);
  assert.equal(cache.get('b'), 2);
  assert.equal(cache.get('c'), 3);
});

test('withContactCache only hits the API once for repeated gets', async () => {
  let calls = 0;
  const api = withContactCache(
    { get: async (_loc, id) => { calls++; return { id, tags: [] }; } },
    new LRUCache({ max: 10 }),
  );
  await api.get('loc_1', 'c1');
  await api.get('loc_1', 'c1');
  assert.equal(calls, 1);
});
