# Contributing to snippet-vault

Thank you for your interest in contributing! 🎉 This document covers everything you need to get started.

> **New to open source?** No problem — many of our issues are specifically designed for first-time contributors. Check out the [Good First Issues](https://github.com/Eliasilyz/snippet-vault/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) label.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Dev Environment Setup](#dev-environment-setup)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Linting](#linting)
- [Submitting a Pull Request](#submitting-a-pull-request)
  - [Branch Naming](#branch-naming)
  - [Commit Convention](#commit-convention)
  - [PR Checklist](#pr-checklist)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior by opening an issue.

---

## Dev Environment Setup

**Requirements**

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9 (bundled with Node.js 18+)
- A terminal (bash, zsh, PowerShell, or similar)

**Steps**

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/Eliasilyz/snippet-vault.git
cd snippet-vault

# 2. Install dependencies
npm install

# 3. Link the CLI locally so you can test it end-to-end
npm link

# 4. Verify everything works
snippet --version   # should print the current version
npm test            # all tests should pass
npm run lint        # no lint errors
```

> **Tip:** The CLI reads/writes from `~/.snippet-vault/snippets.json` by default.
> Set the `SNIPPET_VAULT_DIR` environment variable to point to a different directory
> during development to avoid touching your real snippets.
>
> ```bash
> export SNIPPET_VAULT_DIR=/tmp/my-test-vault
> snippet add test-snippet --lang js
> ```

---

## Project Structure

```
snippet-vault/
├── src/
│   ├── cli.js              # Entry point — registers all commands
│   ├── store.js            # Read/write snippets.json
│   ├── formatter.js        # Shared display utilities
│   └── commands/
│       ├── add.js          # `snippet add`
│       ├── list.js         # `snippet list`
│       ├── show.js         # `snippet show`
│       ├── search.js       # `snippet search`
│       └── remove.js       # `snippet remove`
├── tests/
│   ├── formatter.test.js   # Unit tests for formatter.js
│   └── store.test.js       # Unit tests for store.js
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions: lint + test on PR
├── eslint.config.mjs       # ESLint configuration
├── package.json
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

---

## Running Tests

```bash
npm test
```

Tests live in `tests/` and use [Jest](https://jestjs.io/). Each test file mirrors the source file it covers (e.g. `tests/store.test.js` tests `src/store.js`).

To run tests in watch mode during development:

```bash
npx jest --watch
```

---

## Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

The project uses [ESLint](https://eslint.org/) with the flat config format (`eslint.config.mjs`). Please fix all lint errors before submitting a PR. The CI pipeline will fail on lint errors.

---

## Submitting a Pull Request

### Branch Naming

Use the following prefixes when naming your branch:

| Prefix | When to use |
|---|---|
| `feat/` | A new feature or enhancement |
| `fix/` | A bug fix |
| `docs/` | Documentation-only changes |
| `test/` | Adding or updating tests |
| `chore/` | Tooling, config, or maintenance |

**Examples:**

```
feat/export-snippets-to-markdown
fix/search-unicode-crash
docs/add-jsdoc-to-store
test/add-remove-command-tests
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`

**Examples:**

```
feat(add): support reading snippet from clipboard with --clipboard flag
fix(search): handle Unicode characters in search query
docs(readme): add link to goodfirstissue.dev in contributing section
test(store): add unit tests for writeSnippets error handling
```

Commits should be written in **imperative mood** ("add feature" not "added feature").

### PR Checklist

Before opening a pull request, please make sure you can check all of the following:

- [x] `npm test` passes locally
- [x] `npm run lint` reports no errors
- [x] New functionality has corresponding tests
- [x] Existing JSDoc comments are preserved; new public functions have JSDoc
- [x] The PR description clearly explains **what** changed and **why**
- [x] If this closes an issue, the PR description includes `Closes #<issue-number>`

---

Thank you for contributing to snippet-vault! Every improvement — whether it's a typo fix or a new feature — makes the project better for everyone. 🚀
