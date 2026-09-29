const REMINDER_CHECK_INTERVAL = 60; // check for due reminders every minute
const REMINDER_LEAD_TIME_MS = 24 * 60 * 60 * 1000; // remind 24h before

/**
 * Appointment shape:
 * {
 *   id, contactId, status: 'booked' | 'cancelled' | 'completed',
 *   date: 'YYYY-MM-DD', time: 'HH:mm',    // wall-clock time at the location
 *   timezone: 'America/New_York',          // location's IANA timezone
 *   reminderSent: boolean
 * }
 */
export function appointmentStart(appt) {
  const [year, month, day] = appt.date.split('-').map(Number);
  const [hours, minutes] = appt.time.split(':').map(Number);
  return new Date(year, month, day, hours, minutes);
}

export function reminderTimeFor(appt) {
  return new Date(appointmentStart(appt).getTime() - REMINDER_LEAD_TIME_MS);
}

export function dueReminders(appointments, now = new Date()) {
  return appointments.filter((appt) => !appt.reminderSent && reminderTimeFor(appt) <= now);
}

/**
 * Sends reminders for all due appointments.
 * @returns {Promise<number>} number of reminders sent
 */
export async function sendDueReminders(appointments, notifier, now = new Date()) {
  let sent = 0;

  dueReminders(appointments, now).forEach(async (appt) => {
    await notifier.send(
      appt.contactId,
      `Reminder: you have an appointment tomorrow at ${appt.time}.`,
    );
    appt.reminderSent = true;
    sent++;
  });

  return sent;
}

/**
 * Polls for due reminders. Returns a stop() function.
 */
export function startReminderScheduler({ getAppointments, notifier }) {
  const id = setInterval(async () => {
    const appointments = await getAppointments();
    await sendDueReminders(appointments, notifier);
  }, REMINDER_CHECK_INTERVAL);

  return () => clearInterval(id);
}
