'use strict';

const readline = require('readline');
const { readSnippets, writeSnippets, findByName } = require('../store');

/**
 * Registers the `snippet remove <name>` command.
 *
 * Deletes a snippet from the vault after a confirmation prompt.
 * Use --force to skip the confirmation (useful in scripts).
 *
 * @param {import('commander').Command} program - The root commander program.
 */
function register(program) {
  program
    .command('remove <name>')
    .alias('rm')
    .description('Delete a snippet from the vault.')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (name, options) => {
      const snippets = readSnippets();
      const snippet = findByName(snippets, name);

      if (!snippet) {
        console.error(`Error: No snippet found with the name "${name}".`);
        console.error('Use `snippet list` to see all available snippets.');
        process.exit(1);
      }

      if (!options.force) {
        const confirmed = await confirm(`Are you sure you want to delete "${snippet.name}"? [y/N] `);
        if (!confirmed) {
          console.log('Aborted.');
          return;
        }
      }

      const updated = snippets.filter((s) => s.name.toLowerCase() !== name.toLowerCase());
      writeSnippets(updated);
      console.log(`✓ Snippet "${snippet.name}" removed.`);
    });
}

/**
 * Prompts the user for a yes/no confirmation in the terminal.
 *
 * @param {string} message - The prompt message to display.
 * @returns {Promise<boolean>} Resolves to true if the user answered yes.
 */
function confirm(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

module.exports = register;
