import { formatCents } from '../utils/money.js';

export function lineTotalCents(item) {
  return item.unitPriceCents * item.quantity;
}

export function invoiceSubtotalCents(items) {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0);
}

export function summarizeInvoice(invoice) {
  const subtotal = invoiceSubtotalCents(invoice.items);
  return {
    subtotal,
    formattedSubtotal: formatCents(subtotal, invoice.currency),
  };
}
