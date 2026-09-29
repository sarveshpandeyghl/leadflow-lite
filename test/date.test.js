import test from 'node:test';
import assert from 'node:assert/strict';
import { parseISODate, zonedTimeToUtc } from '../src/utils/date.js';

test('parseISODate returns a local calendar date', () => {
  const d = parseISODate('2026-03-08');
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 2);
  assert.equal(d.getDate(), 8);
});

test('zonedTimeToUtc converts wall-clock time in a timezone', () => {
  assert.equal(
    zonedTimeToUtc('2026-10-15', '09:30', 'America/New_York').toISOString(),
    '2026-10-15T13:30:00.000Z',
  );
  assert.equal(
    zonedTimeToUtc('2026-10-15', '09:30', 'Asia/Kolkata').toISOString(),
    '2026-10-15T04:00:00.000Z',
  );
});
