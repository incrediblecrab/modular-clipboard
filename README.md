# Modular Clipboard

A VS Code extension that allows you to create, manage, and quickly copy reusable text/code snippets through a convenient sidebar interface.

## Features

- **Click-to-Copy**: Click any box title to instantly copy its contents to clipboard
- **Unlimited Boxes**: Create as many clipboard boxes as needed
- **Auto-Save**: Changes are automatically saved globally across all projects
- **Manual Save**: Option to manually trigger save via button
- **Rich Editing**: Edit box contents in VS Code editor with full syntax support
- **Bulk Edit**: Export/edit all boxes as JSON for advanced management
- **Global Storage**: Boxes are available across all VS Code workspaces

## Usage

### Creating a Box
1. Click the **+** icon in the Modular Clipboard sidebar
2. Enter a title for your box
3. Box is created and auto-saved

### Copying Content
- **Click** on any box title to copy its content to clipboard
- Or right-click → "Copy Box Content"

### Editing Content
1. Right-click a box → "Edit Box Content"
2. Opens in VS Code editor
3. Make changes and **Save** (Cmd/Ctrl+S)
4. Content is auto-saved to the box

### Managing Boxes
- **Rename**: Right-click → "Rename Box"
- **Delete**: Right-click → "Delete Box"
- **Refresh**: Click refresh icon to reload boxes
- **Save Now**: Click save icon for manual save

### Bulk Editing (JSON)
1. Click the **JSON** icon in toolbar
2. Edit the JSON structure directly
3. Save to apply changes
4. Close without saving to discard

## Development

### Setup
```bash
npm install
```

### Compile
```bash
npm run compile
```

### Watch Mode
```bash
npm run watch
```

### Running the Extension
1. Press **F5** in VS Code to open Extension Development Host
2. The extension will be loaded and active
3. Open the Modular Clipboard view from the Activity Bar

## Architecture

- **Storage**: Global state via VS Code API (persists across workspaces)
- **UI**: Native TreeView in Activity Bar sidebar
- **Auto-Save**: Enabled by default on all operations
- **Stability**: Error handling and validation on all operations

## Data Structure

```typescript
interface ClipboardBox {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}
```

## License

MIT
