# snippet-vault

[![Good First Issues Welcome](https://img.shields.io/badge/good%20first%20issues-welcome-brightgreen.svg)](https://github.com/Eliasilyz/snippet-vault/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
[![CI](https://github.com/Eliasilyz/snippet-vault/actions/workflows/ci.yml/badge.svg)](https://github.com/Eliasilyz/snippet-vault/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-blue)](https://nodejs.org)

**snippet-vault** is a local-first CLI tool for saving, organizing, and searching code snippets directly from your terminal — no account required, no cloud sync, no server. Everything lives in a single `~/.snippet-vault/snippets.json` file on your machine.

Think of it as a personal code notepad that lives in your shell. Tired of digging through old projects to find that one useful regex, bash alias, or API boilerplate? Save it once with `snippet add`, retrieve it instantly with `snippet show` or `snippet search`, and keep your snippets tagged and organized without ever leaving the terminal.

## Features

| Command | Description |
|---|---|
| `snippet add <name>` | Save a new snippet (opens `$EDITOR` or reads from stdin) |
| `snippet list` | List all saved snippets with language, tags, and date |
| `snippet show <name>` | Print a snippet's content to stdout |
| `snippet search <query>` | Search snippets by name, tag, or content |
| `snippet remove <name>` | Delete a snippet (with confirmation) |

## Installation

**Requirements:** Node.js ≥ 18

```bash
# Clone the repository
git clone https://github.com/Eliasilyz/snippet-vault.git
cd snippet-vault

# Install dependencies
npm install

# Link the CLI globally so you can run `snippet` anywhere
npm link
```

### Verify the install

```bash
snippet --version
snippet --help
```

## Usage

```bash
# Save a snippet (opens your $EDITOR)
snippet add my-regex --lang js --tags "regex,validation"

# Save a snippet directly from stdin
echo 'SELECT * FROM users LIMIT 10;' | snippet add sql-debug --lang sql

# List all snippets
snippet list

# Filter by language or tag
snippet list --lang python
snippet list --tag utils

# View a snippet
snippet show my-regex

# Pipe a snippet to another tool (no header)
snippet show sql-debug --no-header | psql mydb

# Search across all snippets
snippet search "array reduce"

# Delete a snippet
snippet remove my-regex

# Delete without confirmation (for scripts)
snippet remove my-regex --force
```

## Data Storage

All snippets are stored locally at:

```
~/.snippet-vault/snippets.json
```

No data ever leaves your machine. You can back up, version-control, or sync this file however you like.

## Contributing

We welcome all contributions — especially from first-time open-source contributors! 🎉

Please read our **[CONTRIBUTING.md](CONTRIBUTING.md)** for details on setting up the dev environment, our branch naming convention, and how to submit a pull request.

Have a look at our [open issues](https://github.com/Eliasilyz/snippet-vault/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) — many are specifically designed for newcomers.

## License

[MIT](LICENSE)
