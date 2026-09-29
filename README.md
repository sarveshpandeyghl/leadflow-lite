# LeadFlow Lite

A small, dependency-free CRM front end written in vanilla JavaScript (ES modules).

- **Contacts** – list, view and edit contacts per location (sub-account)
- **Invoices** – build invoices from line items (all money is stored in integer **cents**)
- **Appointments** – booked per location; every location has its own IANA `timezone`

## Project layout

```
src/
  api/        HTTP client + resource APIs
  services/   pure business logic (invoices, reminders, ...)
  ui/         DOM rendering
  utils/      shared helpers (escapeHtml, money, date)
test/         node:test unit tests
```

## Conventions

- Money is always integer cents. Use `utils/money.js` for parsing/formatting.
- Any user-provided string rendered with `innerHTML` **must** go through `escapeHtml`.
- Dates without a time (`YYYY-MM-DD`) are parsed with `utils/date.js#parseISODate`.
- Every contact belongs to exactly one `locationId`; all contact APIs are location-scoped.

## Running

```bash
npm test
npm start   # serves index.html
```
