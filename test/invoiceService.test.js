import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeInvoice, parseCustomAmount, addCustomLineItem } from '../src/services/invoiceService.js';

const makeInvoice = () => ({
  currency: 'USD',
  items: [
    { name: 'Setup', unitPriceCents: 5000, quantity: 1 },
    { name: 'Seat', unitPriceCents: 2500, quantity: 2 },
  ],
});

test('summarizeInvoice computes subtotal', () => {
  assert.equal(summarizeInvoice(makeInvoice()).subtotal, 10000);
});

test('summarizeInvoice applies discount and tax', () => {
  const summary = summarizeInvoice(makeInvoice(), { discountPct: 10, taxRate: 0.18 });
  assert.equal(summary.discount, 1000);
  assert.equal(summary.tax, 1800);
  assert.equal(summary.total, 10800);
  assert.equal(summary.formatted.total, '$108.00');
});

test('summarizeInvoice uses default tax rate', () => {
  assert.equal(summarizeInvoice(makeInvoice()).tax, 1800);
});

test('line items are sorted by amount, highest first', () => {
  const invoice = makeInvoice();
  invoice.items.push({ name: 'Big', unitPriceCents: 9000, quantity: 1 });
  assert.equal(summarizeInvoice(invoice).lineItems[0].name, 'Big');
});

test('parseCustomAmount converts to cents', () => {
  assert.equal(parseCustomAmount('25'), 2500);
  assert.equal(parseCustomAmount('12.50'), 1250);
});

test('addCustomLineItem appends an item', () => {
  const invoice = addCustomLineItem(makeInvoice(), 'Rush fee', '15');
  assert.equal(invoice.items.at(-1).unitPriceCents, 1500);
});
