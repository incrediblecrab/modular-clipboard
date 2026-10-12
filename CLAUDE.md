# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and GitHub Copilot CLI when working in this repository.

Modular Clipboard is a VS Code extension that keeps named text snippets ("boxes") in an activity-bar tree view, where each can be copied, edited, renamed or deleted. It is published on the Marketplace as `maxs-lab-of-things.modular-clipboard`. The repository is public.

## Commands

```bash
npm run compile      # tsc -p ./ -> out/
npm run watch
npx vsce package     # read the printed file list before publishing
```

Run the extension with F5 from VS Code. There are no tests. `npm run lint` exists but the repository has no ESLint config, so it fails until one is added.

## Structure

Boxes are stored per workspace in `.vscode/modular-clipboard.json` by `src/storage.ts` (`StorageService`), which creates `.vscode/` if needed; the shape is `ClipboardData` in `src/types.ts`. `src/treeView.ts` renders the boxes in the `modularClipboard.boxesView` view inside the `modular-clipboard` activity-bar container. `src/extension.ts` registers the five commands; editing a box writes its content to a temp file in the OS temp directory, opens it as a normal editor, and saves back to storage on `onDidSaveTextDocument`. A one-time welcome message is tracked in `globalState`.

Because the store is a file inside the user's workspace, a change to its shape must still read files written by earlier versions.

## Releasing

`.vscodeignore` is the only control over what ships in the `.vsix`; `.gitignore` is ignored by `vsce`. The managed block in it is rewritten by a standardizing script, so add project-specific exclusions outside that block. The README states the Marketplace version (1.5.2 here), so bump it with `package.json` and `CHANGELOG.md`. The publishing procedure is in `../README.md`.
