/**
 * Parses a date-only ISO string ("YYYY-MM-DD") as a *local* calendar date.
 * (new Date("YYYY-MM-DD") parses as UTC midnight, which shifts the day in
 * negative-offset timezones - don't use it for date-only values.)
 */
export function parseISODate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns the UTC instant for a wall-clock time in a given IANA timezone.
 * e.g. zonedTimeToUtc('2026-10-15', '09:30', 'America/New_York')
 */
export function zonedTimeToUtc(isoDate, time, timeZone) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const asUtc = Date.UTC(year, month - 1, day, hours, minutes);
  const offset = tzOffsetMs(new Date(asUtc), timeZone);
  return new Date(asUtc - offset);
}

function tzOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const zoned = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return zoned - date.getTime();
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export function formatDate(date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}
