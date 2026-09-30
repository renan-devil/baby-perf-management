// Age computations. All ages are in months (fractional) unless stated otherwise.

const MS_PER_DAY = 24 * 3600 * 1000;
/** Average month length in days (365.25 / 12). */
export const DAYS_PER_MONTH = 30.4375;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Fractional age in months between birth and a date. */
export function ageInMonths(birthIso: string, atIso: string): number {
  const days = (parseDate(atIso).getTime() - parseDate(birthIso).getTime()) / MS_PER_DAY;
  return days / DAYS_PER_MONTH;
}

/** Calendar age split into years, months and days (as parents say it). */
export function calendarAge(birthIso: string, atIso: string): { years: number; months: number; days: number } {
  const b = parseDate(birthIso);
  const a = parseDate(atIso);
  let years = a.getUTCFullYear() - b.getUTCFullYear();
  let months = a.getUTCMonth() - b.getUTCMonth();
  let days = a.getUTCDate() - b.getUTCDate();
  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), 0)).getUTCDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/**
 * Corrected age for children born before 37 weeks, used until 24 months:
 * corrected = age − (40 − gestational weeks) weeks.
 */
export function correctedAgeInMonths(ageMonths: number, gestationalWeeks?: number | null): number {
  if (!gestationalWeeks || gestationalWeeks >= 37 || ageMonths >= 24) return ageMonths;
  const correctionMonths = ((40 - gestationalWeeks) * 7) / DAYS_PER_MONTH;
  return Math.max(0, ageMonths - correctionMonths);
}

/** Date at which the child is `months` old (used to import month-only records). */
export function dateAtAge(birthIso: string, months: number): string {
  const b = parseDate(birthIso);
  const whole = Math.floor(months);
  const d = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth() + whole, b.getUTCDate()));
  const extraDays = Math.round((months - whole) * DAYS_PER_MONTH);
  return toIsoDate(new Date(d.getTime() + extraDays * MS_PER_DAY));
}

export function todayIso(): string {
  return toIsoDate(new Date());
}
