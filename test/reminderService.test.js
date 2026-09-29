import test from 'node:test';
import assert from 'node:assert/strict';
import { appointmentStart, dueReminders, sendDueReminders } from '../src/services/reminderService.js';

const appt = (overrides = {}) => ({
  id: 'a1',
  contactId: 'c1',
  status: 'booked',
  date: '2026-10-15',
  time: '09:30',
  timezone: 'America/New_York',
  reminderSent: false,
  ...overrides,
});

test('appointmentStart parses date and time', () => {
  const start = appointmentStart(appt());
  assert.equal(start.getHours(), 9);
  assert.equal(start.getMinutes(), 30);
});

test('dueReminders returns appointments inside the 24h window', () => {
  const soon = appt({ date: '2020-01-01' });
  const later = appt({ id: 'a2', date: '2099-01-01' });
  assert.deepEqual(dueReminders([soon, later]).map((a) => a.id), ['a1']);
});

test('dueReminders skips appointments that were already reminded', () => {
  assert.equal(dueReminders([appt({ date: '2020-01-01', reminderSent: true })]).length, 0);
});

test('sendDueReminders notifies the contact', async () => {
  const sent = [];
  const notifier = { send: async (contactId, msg) => sent.push({ contactId, msg }) };
  await sendDueReminders([appt({ date: '2020-01-01' })], notifier);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].contactId, 'c1');
});
