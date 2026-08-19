'use strict';

/**
 * snippet-vault public API.
 *
 * Exposes the store and formatter modules for programmatic use
 * (e.g. in tests or third-party integrations).
 */
const store = require('./store');
const formatter = require('./formatter');

module.exports = { store, formatter };
