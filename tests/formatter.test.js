'use strict';

const { formatDate, truncate } = require('../src/formatter');

describe('formatDate', () => {
  test('formats a valid ISO string to YYYY-MM-DD', () => {
    expect(formatDate('2024-03-15T08:30:00.000Z')).toBe('2024-03-15');
  });

  test('returns "unknown" for falsy input', () => {
    expect(formatDate(null)).toBe('unknown');
    expect(formatDate('')).toBe('unknown');
    expect(formatDate(undefined)).toBe('unknown');
  });

  test('returns "invalid date" for a non-date string', () => {
    expect(formatDate('not-a-date')).toBe('invalid date');
  });
});

describe('truncate', () => {
  test('returns the string unchanged if shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  test('truncates and appends ellipsis when string exceeds maxLength', () => {
    const result = truncate('hello world', 8);
    expect(result).toHaveLength(8);
    expect(result.endsWith('…')).toBe(true);
  });

  test('uses default maxLength of 60', () => {
    const longStr = 'a'.repeat(80);
    const result = truncate(longStr);
    expect(result).toHaveLength(60);
    expect(result.endsWith('…')).toBe(true);
  });

  test('returns empty string for falsy input', () => {
    expect(truncate('')).toBe('');
    expect(truncate(null)).toBe('');
  });
});
