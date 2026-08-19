'use strict';

/**
 * Formats an ISO date string into a human-readable short date.
 *
 * @param {string} isoString - An ISO 8601 date string (e.g. "2024-01-15T10:30:00.000Z").
 * @returns {string} A formatted date string like "2024-01-15".
 */
function formatDate(isoString) {
  if (!isoString) {return 'unknown';}
  try {
    return new Date(isoString).toISOString().slice(0, 10);
  } catch {
    return 'invalid date';
  }
}

/**
 * Truncates a string to a maximum length, appending "…" if truncated.
 *
 * @param {string} str - The input string.
 * @param {number} [maxLength=60] - Maximum character length before truncation.
 * @returns {string} The (possibly truncated) string.
 */
function truncate(str, maxLength = 60) {
  if (!str) {return '';}
  if (str.length <= maxLength) {return str;}
  return str.slice(0, maxLength - 1) + '…';
}

module.exports = { formatDate, truncate };
