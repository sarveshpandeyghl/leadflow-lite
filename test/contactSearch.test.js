import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMatcher, highlight, paginate } from '../src/ui/contactSearch.js';

const jane = { id: '1', firstName: 'Jane', lastName: 'Cooper', email: 'jane@acme.io' };

test('buildMatcher matches name case-insensitively', () => {
  assert.equal(buildMatcher('coop')(jane), true);
});

test('buildMatcher matches email', () => {
  assert.equal(buildMatcher('acme')(jane), true);
});

test('buildMatcher rejects non-matching contacts', () => {
  assert.equal(buildMatcher('zzz')(jane), false);
});

test('highlight wraps matches in <mark>', () => {
  assert.equal(highlight('Jane Cooper', 'coo'), 'Jane <mark>Coo</mark>per');
});

test('paginate slices by page', () => {
  const items = Array.from({ length: 40 }, (_, i) => i);
  const p2 = paginate(items, 2);
  assert.equal(p2.items[0], 20);
  assert.equal(p2.totalPages, 2);
});
