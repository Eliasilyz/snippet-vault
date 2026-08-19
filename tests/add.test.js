'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const TEST_VAULT_DIR = path.join(
  os.tmpdir(),
  `snippet-vault-add-test-${process.pid}`,
);

process.env.SNIPPET_VAULT_DIR = TEST_VAULT_DIR;

const SNIPPETS_FILE = path.join(
  TEST_VAULT_DIR,
  'snippets.json',
);

const CLI_PATH = path.join(__dirname, '../src/cli.js');

function resetVault(data = []) {
  fs.mkdirSync(TEST_VAULT_DIR, { recursive: true });

  fs.writeFileSync(
    SNIPPETS_FILE,
    JSON.stringify(data, null, 2),
    'utf8',
  );
}

function runCLI(args, input = '') {
  return spawnSync(
    process.execPath,
    [CLI_PATH, ...args],
    {
      input,
      encoding: 'utf8',
      env: {
        ...process.env,
        SNIPPET_VAULT_DIR: TEST_VAULT_DIR,
      },
    },
  );
}

afterEach(() => {
  if (fs.existsSync(SNIPPETS_FILE)) {
    fs.unlinkSync(SNIPPETS_FILE);
  }
});

afterAll(() => {
  fs.rmSync(TEST_VAULT_DIR, {
    recursive: true,
    force: true,
  });
});

describe('add command', () => {
  test('accepts a valid snippet name', () => {
    resetVault();

    const result = runCLI(
      ['add', 'valid-name'],
      'console.log("hello");\n',
    );

    expect(result.status).toBe(0);

    const snippets = JSON.parse(
      fs.readFileSync(SNIPPETS_FILE, 'utf8'),
    );

    expect(snippets).toHaveLength(1);
    expect(snippets[0].name).toBe('valid-name');
  });

  test('accepts a snippet name with exactly 64 characters', () => {
    resetVault();

    const name = 'a'.repeat(64);

    const result = runCLI(
      ['add', name],
      'console.log("hello");\n',
    );

    expect(result.status).toBe(0);

    const snippets = JSON.parse(
      fs.readFileSync(SNIPPETS_FILE, 'utf8'),
    );

    expect(snippets).toHaveLength(1);
    expect(snippets[0].name).toBe(name);
  });

  test('rejects a snippet name longer than 64 characters', () => {
    resetVault();

    const name = 'a'.repeat(65);

    const result = runCLI([
      'add',
      name,
    ]);

    expect(result.status).toBe(1);

    expect(result.stderr).toContain(
      'cannot exceed 64 characters',
    );

    const snippets = JSON.parse(
      fs.readFileSync(SNIPPETS_FILE, 'utf8'),
    );

    expect(snippets).toHaveLength(0);
  });

  test('rejects a snippet name containing invalid characters', () => {
    resetVault();

    const result = runCLI([
      'add',
      'my@snippet!',
    ]);

    expect(result.status).toBe(1);

    expect(result.stderr).toContain(
      'letters, numbers, hyphens and underscores',
    );

    const snippets = JSON.parse(
      fs.readFileSync(SNIPPETS_FILE, 'utf8'),
    );

    expect(snippets).toHaveLength(0);
  });
});