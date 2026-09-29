import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeInvoice } from '../src/services/invoiceService.js';

test('summarizeInvoice computes subtotal', () => {
  const invoice = {
    currency: 'USD',
    items: [
      { name: 'Setup', unitPriceCents: 5000, quantity: 1 },
      { name: 'Seat', unitPriceCents: 2500, quantity: 2 },
    ],
  };
  assert.equal(summarizeInvoice(invoice).subtotal, 10000);
});
