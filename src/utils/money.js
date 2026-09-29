/**
 * All money in LeadFlow is represented as integer cents.
 */

export function formatCents(cents, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

/**
 * Parses a user-entered decimal amount ("19.99", "1299") into integer cents.
 * Throws on anything that isn't a plain non-negative decimal with <= 2 fraction digits.
 */
export function toCents(input) {
  const str = String(input).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(str)) {
    throw new TypeError(`Invalid amount: "${input}"`);
  }
  const [whole, fraction = ''] = str.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
