#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const { version } = require('../package.json');

// Register commands
require('./commands/add')(program);
require('./commands/list')(program);
require('./commands/show')(program);
require('./commands/search')(program);
require('./commands/remove')(program);

program
  .name('snippet')
  .description('A local-first CLI tool for saving, organizing, and searching code snippets.')
  .version(version, '-v, --version', 'Output the current version');

program.parse(process.argv);
