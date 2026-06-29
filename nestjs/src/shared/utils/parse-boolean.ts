const TRUE_VALUES = new Set([
  '1',
  'true',
  't',
  'yes',
  'y',
  'yeah',
  'yep',
  'yup',
  'on',
  'enable',
  'enabled',
  'active',
  'ok',
  'okay',
  'sure',
  'positive',
  'affirmative',
]);

const FALSE_VALUES = new Set([
  '0',
  'false',
  'f',
  'no',
  'n',
  'nope',
  'nah',
  'off',
  'disable',
  'disabled',
  'inactive',
  'negative',
]);

export function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }

    return undefined;
  }

  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  if (TRUE_VALUES.has(normalized)) {
    return true;
  }

  if (FALSE_VALUES.has(normalized)) {
    return false;
  }

  return undefined;
}

export function parseBooleanOrThrow(value: unknown): boolean {
  const result = parseBoolean(value);

  if (result === undefined) {
    throw new Error(`Invalid boolean: ${formatBooleanInput(value)}`);
  }

  return result;
}

function formatBooleanInput(value: unknown): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'symbol'
  ) {
    return String(value);
  }

  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  return '[object Object]';
}

export function parseBooleanWithDefault(
  value: unknown,
  defaultValue: boolean,
): boolean {
  return parseBoolean(value) ?? defaultValue;
}

export const PARSE_BOOLEAN_TRUE_VALUES = Object.freeze([...TRUE_VALUES]);
export const PARSE_BOOLEAN_FALSE_VALUES = Object.freeze([...FALSE_VALUES]);
