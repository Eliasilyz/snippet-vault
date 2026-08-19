'use strict';

const { readSnippets, findByName } = require('../store');

/**
 * Registers the `snippet show <name>` command.
 *
 * Prints the content of a snippet to stdout. If a language is stored
 * with the snippet, a simple language header is printed as context.
 *
 * @param {import('commander').Command} program - The root commander program.
 */
function register(program) {
  program
    .command('show <name>')
    .description("Print a snippet's content to stdout.")
    .option('--no-header', 'Omit the name/language header (useful for piping output)')
    .action((name, options) => {
      const snippets = readSnippets();
      const snippet = findByName(snippets, name);

      if (!snippet) {
        console.error(`Error: No snippet found with the name "${name}".`);
        console.error('Use `snippet list` to see all available snippets.');
        process.exit(1);
      }

      if (options.header !== false) {
        const langLabel = snippet.language ? ` [${snippet.language}]` : '';
        const tagsLabel = snippet.tags.length ? `  tags: ${snippet.tags.join(', ')}` : '';
        console.log(`── ${snippet.name}${langLabel}${tagsLabel} ──`);
        console.log('');
      }

      console.log(snippet.content);
    });
}

module.exports = register;
