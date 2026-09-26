# modular-clipboard

![Version](https://img.shields.io/visual-studio-marketplace/v/maxs-lab-of-things.modular-clipboard) ![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

Modular Clipboard is a VS Code extension for keeping named reusable text boxes in a workspace sidebar and copying their contents to the clipboard. It is published on the VS Code Marketplace as [`maxs-lab-of-things.modular-clipboard`](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.modular-clipboard); the Marketplace version is 1.5.2, matching this repository.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/modular-clipboard.gif)

**Objective:** keep repeated snippets, prompts, commands or notes close to the editor and copyable from a VS Code Activity Bar view.

**Inputs:** VS Code 1.80.0 or newer and an open workspace folder. Boxes are stored in `.vscode/modular-clipboard.json` under the first workspace folder.

**Files:**

- [`src/extension.ts`](src/extension.ts): activation, Activity Bar tree view and command handlers
- [`src/storage.ts`](src/storage.ts): workspace JSON storage for boxes
- [`src/treeView.ts`](src/treeView.ts): tree item and tree data provider classes
- [`src/types.ts`](src/types.ts): clipboard box data types
- [`package.json`](package.json): extension manifest, Marketplace metadata, Activity Bar view contribution, commands, menus and scripts
- [`CHANGELOG.md`](CHANGELOG.md): release notes
- [`tsconfig.json`](tsconfig.json): TypeScript compiler settings

**Try it:** install with `ext install maxs-lab-of-things.modular-clipboard`, open a workspace and click the Modular Clipboard Activity Bar view.

## Usage

Open the Modular Clipboard Activity Bar view and click the plus icon to create a box. Give the box a title, then use the box actions to edit, rename, delete or copy it.

Clicking a box or running **Copy Box Content** writes the box content to the VS Code clipboard. Editing opens the current content in an editor tab; saving that tab updates the stored box content.

## Commands, menus and view

| Contribution | Identifier | What it does |
| --- | --- | --- |
| Activity Bar container | `modular-clipboard` | adds the Modular Clipboard view container |
| Tree view | `modularClipboard.boxesView` | lists clipboard boxes |
| Command | `modularClipboard.addBox` | creates a new box after prompting for a title |
| Command | `modularClipboard.copyBox` | copies a box's content to the clipboard |
| Command | `modularClipboard.editBox` | opens a box's content for editing |
| Command | `modularClipboard.renameBox` | renames a box |
| Command | `modularClipboard.deleteBox` | deletes a box after confirmation |

The view title contributes **Add New Box**. Item context menus contribute edit, rename and delete actions; the copy command is attached to each tree item.

## Storage

Boxes are stored as JSON in `.vscode/modular-clipboard.json` in the first workspace folder. Each box has an `id`, `title`, `content`, `createdAt` timestamp and `updatedAt` timestamp.

The extension uses VS Code global state only to remember whether it has already shown its welcome message.

## Development

The repository includes the scripts `npm run compile`, `npm run watch`, `npm run lint` and `npm run vscode:prepublish`. The extension entry point is configured as `./out/extension.js`.

## Links

- [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.modular-clipboard)
- [Demo video](https://youtu.be/scZh06HVZ9s)
- [MLoT product page](https://mlot.ai/modular-clipboard/)
- [Privacy policy](https://mlot.ai/privacy)
- Publisher: [Max's Lab of Things](https://mlot.ai/)

## License

MIT. See [`LICENSE`](LICENSE).
