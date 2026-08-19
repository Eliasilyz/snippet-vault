'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * The directory where snippet data is stored.
 * Defaults to ~/.snippet-vault/
 */
const VAULT_DIR = process.env.SNIPPET_VAULT_DIR || path.join(os.homedir(), '.snippet-vault');

/**
 * The path to the snippets JSON file.
 */
const SNIPPETS_FILE = path.join(VAULT_DIR, 'snippets.json');

/**
 * Ensures the vault directory and snippets file exist.
 * Creates them if they do not.
 */
function ensureVaultExists() {
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }
  if (!fs.existsSync(SNIPPETS_FILE)) {
    fs.writeFileSync(SNIPPETS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Reads all snippets from the local JSON store.
 * @returns {Array<Object>} Array of snippet objects.
 */
function readSnippets() {
  ensureVaultExists();
  try {
    const raw = fs.readFileSync(SNIPPETS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading snippets file:', err.message);
    return [];
  }
}

/**
 * Writes the given array of snippets to the local JSON store.
 * @param {Array<Object>} snippets - The full list of snippets to persist.
 */
function writeSnippets(snippets) {
  ensureVaultExists();
  try {
    fs.writeFileSync(SNIPPETS_FILE, JSON.stringify(snippets, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing snippets file:', err.message);
    process.exit(1);
  }
}

/**
 * Finds a snippet by its unique name (case-insensitive).
 * @param {Array<Object>} snippets - The list of all snippets.
 * @param {string} name - The snippet name to look for.
 * @returns {Object|undefined} The matching snippet, or undefined if not found.
 */
function findByName(snippets, name) {
  return snippets.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

module.exports = {
  readSnippets,
  writeSnippets,
  findByName,
  VAULT_DIR,
  SNIPPETS_FILE,
};
