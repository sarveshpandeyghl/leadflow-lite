import test from 'node:test';
import assert from 'node:assert/strict';
import { toCents, formatCents } from '../src/utils/money.js';

test('toCents parses decimal strings exactly', () => {
  assert.equal(toCents('19.99'), 1999);
  assert.equal(toCents('0.1'), 10);
  assert.equal(toCents('1299'), 129900);
});

test('toCents rejects garbage', () => {
  assert.throws(() => toCents('12,99'));
  assert.throws(() => toCents('-5'));
});

test('formatCents', () => {
  assert.equal(formatCents(129900), '$1,299.00');
});
