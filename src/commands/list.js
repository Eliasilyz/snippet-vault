'use strict';

const { readSnippets } = require('../store');
const { formatDate } = require('../formatter');

/**
 * Registers the `snippet list` command.
 *
 * Lists all saved snippets in a table-like format showing name,
 * language, tags, and date added.
 *
 * @param {import('commander').Command} program - The root commander program.
 */
function register(program) {
  program
    .command('list')
    .description('List all saved snippets.')
    .option('--lang <language>', 'Filter by language')
    .option('--tag <tag>', 'Filter by a specific tag')
    .action((options) => {
      let snippets = readSnippets();

      if (snippets.length === 0) {
        console.log('No snippets saved yet. Use `snippet add <name>` to create one.');
        return;
      }

      if (options.lang) {
        snippets = snippets.filter(
          (s) => s.language && s.language.toLowerCase() === options.lang.toLowerCase(),
        );
      }

      if (options.tag) {
        snippets = snippets.filter((s) =>
          s.tags.some((t) => t.toLowerCase() === options.tag.toLowerCase()),
        );
      }

      if (snippets.length === 0) {
        console.log('No snippets match the given filter.');
        return;
      }

      // Compute column widths for a neat table
      const nameWidth = Math.max(4, ...snippets.map((s) => s.name.length));
      const langWidth = Math.max(8, ...snippets.map((s) => (s.language || '-').length));
      const tagWidth = Math.max(4, ...snippets.map((s) => (s.tags.join(', ') || '-').length));

      const header = [
        'NAME'.padEnd(nameWidth),
        'LANGUAGE'.padEnd(langWidth),
        'TAGS'.padEnd(tagWidth),
        'CREATED',
      ].join('  ');

      const divider = '-'.repeat(header.length);

      console.log(header);
      console.log(divider);

      for (const snippet of snippets) {
        const row = [
          snippet.name.padEnd(nameWidth),
          (snippet.language || '-').padEnd(langWidth),
          (snippet.tags.join(', ') || '-').padEnd(tagWidth),
          formatDate(snippet.createdAt),
        ].join('  ');
        console.log(row);
      }

      console.log(`\n${snippets.length} snippet(s) found.`);
    });
}

module.exports = register;
