'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Use a temp directory so tests never touch the real ~/.snippet-vault
const TEST_VAULT_DIR = path.join(os.tmpdir(), `snippet-vault-test-${process.pid}`);
process.env.SNIPPET_VAULT_DIR = TEST_VAULT_DIR;

// Re-require store AFTER setting the env var
const store = require('../src/store');

const SNIPPETS_FILE = path.join(TEST_VAULT_DIR, 'snippets.json');

/** Wipes the test vault between tests */
function resetVault(data = []) {
  fs.mkdirSync(TEST_VAULT_DIR, { recursive: true });
  fs.writeFileSync(SNIPPETS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

afterEach(() => {
  if (fs.existsSync(SNIPPETS_FILE)) {
    fs.unlinkSync(SNIPPETS_FILE);
  }
});

afterAll(() => {
  fs.rmSync(TEST_VAULT_DIR, { recursive: true, force: true });
});

describe('readSnippets', () => {
  test('returns an empty array when the vault is new', () => {
    // Don't call resetVault — the vault does not exist yet
    if (fs.existsSync(TEST_VAULT_DIR)) {
      fs.rmSync(TEST_VAULT_DIR, { recursive: true, force: true });
    }
    const snippets = store.readSnippets();
    expect(Array.isArray(snippets)).toBe(true);
    expect(snippets).toHaveLength(0);
  });

  test('reads existing snippets from the file', () => {
    const sample = [{ name: 'foo', language: 'js', tags: [], content: 'console.log()', createdAt: new Date().toISOString() }];
    resetVault(sample);
    const snippets = store.readSnippets();
    expect(snippets).toHaveLength(1);
    expect(snippets[0].name).toBe('foo');
  });
});

describe('writeSnippets', () => {
  test('persists snippets to disk', () => {
    resetVault([]);
    const snippets = [{ name: 'bar', language: 'python', tags: ['util'], content: 'print("hi")', createdAt: new Date().toISOString() }];
    store.writeSnippets(snippets);
    const raw = JSON.parse(fs.readFileSync(SNIPPETS_FILE, 'utf8'));
    expect(raw).toHaveLength(1);
    expect(raw[0].name).toBe('bar');
  });
});

describe('findByName', () => {
  test('finds a snippet case-insensitively', () => {
    const snippets = [
      { name: 'MySnippet', content: 'hello', tags: [], createdAt: '' },
    ];
    expect(store.findByName(snippets, 'mysnippet')).toBeDefined();
    expect(store.findByName(snippets, 'MYSNIPPET')).toBeDefined();
  });

  test('returns undefined when no snippet matches', () => {
    const snippets = [{ name: 'alpha', content: '', tags: [], createdAt: '' }];
    expect(store.findByName(snippets, 'beta')).toBeUndefined();
  });
});
