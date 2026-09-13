const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const RELATIVE_TIME_DIVISIONS = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Infinity, unit: 'years' }
];

// Average days per month over a 400-year Gregorian cycle, used to break a
// millisecond duration down into years/months/days/etc.
const DAYS_PER_MONTH = 146097 / 4800;

function pad (n) {
  return String(n).padStart(2, '0');
}

// YYYY-MM-DDTHH:mm:ss+HH:mm
export function formatDateIso (date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = pad(Math.abs(offsetMinutes) % 60);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${offsetHours}:${offsetMins}`;
}

export function formatDateSql (date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function fromNow (date, now = new Date()) {
  let duration = (date.getTime() - now.getTime()) / 1000;

  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.round(Math.abs(duration)) < division.amount) {
      return RELATIVE_TIME_FORMATTER.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }
}

export function durationParts (ms) {
  const absMs = Math.abs(ms);
  const totalSeconds = Math.floor(absMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  let days = Math.floor(totalHours / 24);

  const totalMonths = Math.floor(days / DAYS_PER_MONTH);
  days -= Math.round(totalMonths * DAYS_PER_MONTH);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, days, hours, minutes, seconds };
}
