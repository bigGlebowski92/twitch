const MS = 1;
const SECOND = 1000 * MS;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const YEAR = 365.25 * DAY;

const UNIT_TO_MS: Record<string, number> = {};

function registerUnits(multiplier: number, units: string[]): void {
  for (const unit of units) {
    UNIT_TO_MS[unit.toLowerCase()] = multiplier;
  }
}

registerUnits(MS, [
  'ms',
  'msec',
  'msecs',
  'msecond',
  'mseconds',
  'milli',
  'millis',
  'millisecond',
  'milliseconds',
]);

registerUnits(SECOND, [
  's',
  'sc',
  'sec',
  'secs',
  'second',
  'seconds',
  'secnd',
  'secnds',
]);

registerUnits(MINUTE, ['m', 'min', 'mins', 'minute', 'minutes']);

registerUnits(HOUR, ['h', 'hr', 'hrs', 'hour', 'hours', 'hr.', 'hrs.']);

registerUnits(DAY, ['d', 'dy', 'day', 'days']);

registerUnits(WEEK, ['w', 'wk', 'wks', 'week', 'weeks']);

registerUnits(YEAR, ['y', 'yr', 'yrs', 'year', 'years', 'yr.', 'yrs.']);

const PARSE_PATTERN = /^(-?(?:\d+(?:\.\d+)?|\.\d+))\s*([a-zA-Z.]+)?$/;

const FORMAT_UNITS: Array<{ ms: number; short: string }> = [
  { ms: YEAR, short: 'y' },
  { ms: WEEK, short: 'w' },
  { ms: DAY, short: 'd' },
  { ms: HOUR, short: 'h' },
  { ms: MINUTE, short: 'm' },
  { ms: SECOND, short: 's' },
  { ms: MS, short: 'ms' },
];

export function parseMs(value: string): number | undefined {
  const input = value.trim();

  if (!input) {
    return undefined;
  }

  const match = input.match(PARSE_PATTERN);

  if (!match) {
    return undefined;
  }

  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase();

  if (!Number.isFinite(amount)) {
    return undefined;
  }

  if (!unit) {
    return amount;
  }

  const multiplier = UNIT_TO_MS[unit];

  if (multiplier === undefined) {
    return undefined;
  }

  return Math.round(amount * multiplier);
}

export function formatMs(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (value === 0) {
    return '0ms';
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  for (const unit of FORMAT_UNITS) {
    if (abs >= unit.ms && abs % unit.ms === 0) {
      return `${sign}${abs / unit.ms}${unit.short}`;
    }
  }

  for (const unit of FORMAT_UNITS) {
    if (abs >= unit.ms) {
      return `${sign}${Math.round(abs / unit.ms)}${unit.short}`;
    }
  }

  return `${sign}${abs}ms`;
}

export function ms(value: string): number | undefined;
export function ms(value: number): string;
export function ms(value: string | number): number | string | undefined {
  if (typeof value === 'string') {
    return parseMs(value);
  }

  return formatMs(value);
}

export function msOrThrow(value: string): number {
  const result = parseMs(value);

  if (result === undefined) {
    throw new Error(`Invalid duration: "${value}"`);
  }

  return result;
}

export const MS_UNITS = Object.freeze({ ...UNIT_TO_MS });
