'use strict';

const { readSnippets } = require('../store');
const { formatDate } = require('../formatter');

/**
 * Registers the `snippet search <query>` command.
 *
 * Performs a case-insensitive substring search across snippet names,
 * tags, and content. Prints matching snippets with a short preview.
 *
 * @param {import('commander').Command} program - The root commander program.
 */
function register(program) {
  program
    .command('search <query>')
    .description('Search snippets by name, tag, or content.')
    .option('--name-only', 'Search only snippet names (faster for large vaults)')
    .action((query, options) => {
      const snippets = readSnippets();

      if (snippets.length === 0) {
        console.log('No snippets saved yet. Use `snippet add <name>` to create one.');
        return;
      }

      const q = query.toLowerCase();

      const results = snippets.filter((snippet) => {
        if (snippet.name.toLowerCase().includes(q)) {return true;}
        if (snippet.tags.some((t) => t.toLowerCase().includes(q))) {return true;}
        if (!options.nameOnly && snippet.content.toLowerCase().includes(q)) {return true;}
        return false;
      });

      if (results.length === 0) {
        console.log(`No snippets match "${query}".`);
        return;
      }

      console.log(`Found ${results.length} snippet(s) matching "${query}":\n`);

      for (const snippet of results) {
        const langLabel = snippet.language ? ` [${snippet.language}]` : '';
        const tagsLabel = snippet.tags.length ? `  #${snippet.tags.join(' #')}` : '';
        const preview = buildPreview(snippet.content, q, options.nameOnly);

        console.log(`  ${snippet.name}${langLabel}${tagsLabel}  (${formatDate(snippet.createdAt)})`);
        if (preview) {
          console.log(`    ${preview}`);
        }
        console.log('');
      }
    });
}

/**
 * Builds a short preview string around the first match of the query in content.
 *
 * @param {string} content - The full snippet content.
 * @param {string} query - The lowercase search query.
 * @param {boolean} nameOnly - Skip content preview if true.
 * @returns {string} A preview string, or empty string if not applicable.
 */
function buildPreview(content, query, nameOnly) {
  if (nameOnly) {return '';}

  const idx = content.toLowerCase().indexOf(query);
  if (idx === -1) {return '';}

  const CONTEXT = 40;
  const start = Math.max(0, idx - CONTEXT);
  const end = Math.min(content.length, idx + query.length + CONTEXT);
  const ellipsisStart = start > 0 ? '…' : '';
  const ellipsisEnd = end < content.length ? '…' : '';

  return `${ellipsisStart}${content.slice(start, end).replace(/\n/g, ' ')}${ellipsisEnd}`;
}

module.exports = register;
