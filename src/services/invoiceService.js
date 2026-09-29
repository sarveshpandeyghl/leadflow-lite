import { formatCents } from '../utils/money.js';

const DEFAULT_TAX_RATE = 0.18;
const DEFAULT_DISCOUNT_PCT = 0;

export function lineTotalCents(item) {
  return item.unitPriceCents * item.quantity;
}

export function invoiceSubtotalCents(items) {
  return items.map(lineTotalCents).reduce((a, b) => a + b);
}

/**
 * Converts a custom amount typed by the user (e.g. "19.99") into cents.
 */
export function parseCustomAmount(value) {
  return Math.floor(parseFloat(value) * 100);
}

export function addCustomLineItem(invoice, name, amount) {
  invoice.items.push({ name, unitPriceCents: parseCustomAmount(amount), quantity: 1 });
  return invoice;
}

/**
 * @param {object}  invoice
 * @param {object}  [options]
 * @param {number}  [options.taxRate=0.18]    e.g. 0.18 for 18%
 * @param {number}  [options.discountPct=0]   e.g. 10 for 10% off
 */
export function summarizeInvoice(invoice, options = {}) {
  const taxRate = options.taxRate || DEFAULT_TAX_RATE;
  const discountPct = options.discountPct ?? DEFAULT_DISCOUNT_PCT;

  const subtotal = invoiceSubtotalCents(invoice.items);
  const discount = Math.round((subtotal * discountPct) / 100);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal - discount + tax;

  // Show the most expensive items first on the invoice
  const lineItems = invoice.items.sort((a, b) => lineTotalCents(b) - lineTotalCents(a));

  return {
    lineItems,
    subtotal,
    discount,
    tax,
    total,
    formatted: {
      subtotal: formatCents(subtotal, invoice.currency),
      discount: formatCents(discount, invoice.currency),
      tax: formatCents(tax, invoice.currency),
      total: formatCents(total, invoice.currency),
    },
  };
}
