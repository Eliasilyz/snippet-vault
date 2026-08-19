'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { readSnippets, writeSnippets, findByName } = require('../store');

/**
 * Registers the `snippet add <name>` command.
 *
 * Opens $EDITOR for the user to write a snippet, or reads content from stdin
 * when piped. Supports --lang and --tags options.
 *
 * @param {import('commander').Command} program - The root commander program.
 */
function register(program) {
  program
    .command('add <name>')
    .description('Save a new snippet. Opens $EDITOR or reads from stdin.')
    .option('-l, --lang <language>', 'Programming language of the snippet')
    .option('-t, --tags <tags>', 'Comma-separated list of tags (e.g. "utils,array")')
    .action(async (name, options) => {
      const snippets = readSnippets();

      // Validating if name is longer than 64
      if (name.length > 64) {
        console.error(`Error: Snippet name cannot exceed 64 characters (got ${name.length})`);
        process.exit(1);
      }
      
      // Validating if name contains characters other than letters, numbers, hyphens and underscores
      if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
        console.error('Error: A snippet cannot contain characters other than letters, numbers, hyphens and underscores.');
        process.exit(1);
      }

      if (findByName(snippets, name)) {
        console.error(`Error: A snippet named "${name}" already exists. Use a different name or remove the existing one first.`);
        process.exit(1);
      }

      let content = '';

      // Check if stdin has piped data
      if (!process.stdin.isTTY) {
        content = await readStdin();
      } else {
        content = await openEditor(name);
      }

      content = content.trim();

      if (!content) {
        console.error('Error: Snippet content cannot be empty.');
        process.exit(1);
      }

      const tags = options.tags
        ? options.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      /** @type {Object} */
      const snippet = {
        name,
        language: options.lang || null,
        tags,
        content,
        createdAt: new Date().toISOString(),
      };

      snippets.push(snippet);
      writeSnippets(snippets);

      console.log(`✓ Snippet "${name}" saved successfully.`);
    });
}

/**
 * Reads all content from stdin (for piped input).
 * @returns {Promise<string>} The full stdin content as a string.
 */
function readStdin() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin });
    const lines = [];
    rl.on('line', (line) => lines.push(line));
    rl.on('close', () => resolve(lines.join('\n')));
  });
}

/**
 * Opens the user's $EDITOR with a temporary file and returns its contents.
 * Falls back to nano, then vi if $EDITOR is not set.
 *
 * @param {string} snippetName - Used to name the temp file for context.
 * @returns {Promise<string>} The content the user entered in the editor.
 */
function openEditor(snippetName) {
  return new Promise((resolve) => {
    const editor = process.env.EDITOR || process.env.VISUAL || 'vi';
    const tmpFile = path.join(os.tmpdir(), `snippet-vault-${snippetName}-${Date.now()}.txt`);

    // Write a helpful header comment to the temp file
    fs.writeFileSync(tmpFile, '# Enter your snippet below. Lines starting with # are ignored.\n\n', 'utf8');

    try {
      execSync(`${editor} "${tmpFile}"`, { stdio: 'inherit' });
    } catch {
      console.error('Error: Could not open editor. Try piping content instead: echo "code" | snippet add <name>');
      fs.unlinkSync(tmpFile);
      process.exit(1);
    }

    const raw = fs.readFileSync(tmpFile, 'utf8');
    fs.unlinkSync(tmpFile);

    // Strip comment lines
    const content = raw
      .split('\n')
      .filter((line) => !line.startsWith('#'))
      .join('\n');

    resolve(content);
  });
}

module.exports = register;
