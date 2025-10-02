# Modular Clipboard

![Version](https://img.shields.io/visual-studio-marketplace/v/maxs-lab-of-things.modular-clipboard)
![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

A VS Code extension that allows you to create, manage, and quickly copy reusable text/code snippets through a convenient sidebar interface.

![Demo](https://raw.githubusercontent.com/incrediblecrab/Packages-and-Extensions-Media/main/modular-clipboard.gif)

## Features

- **Click-to-Copy**: Click any box title to instantly copy its contents to clipboard
- **Unlimited Boxes**: Create as many clipboard boxes as needed
- **Auto-Save**: Changes are automatically saved globally across all projects
- **Rich Editing**: Edit box contents in VS Code editor with full syntax support
- **Global Storage**: Boxes are available across all VS Code workspaces

## Installation

Install from the VS Code Marketplace or build from source.

## Usage

### Creating a Box
1. Click the **+** icon in the Modular Clipboard sidebar
2. Enter a title for your box
3. Box is created and auto-saved

### Copying Content
- **Click** on any box title to copy its content to clipboard

### Editing Content
1. Click the edit icon or right-click a box → "Edit Box Content"
2. Opens in VS Code editor
3. Make changes and **Save** (Cmd/Ctrl+S)
4. Content is auto-saved to the box

### Managing Boxes
- **Rename**: Right-click → "Rename Box"
- **Delete**: Right-click → "Delete Box"

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

## Resources

- 📺 [Watch Demo Video](https://youtu.be/scZh06HVZ9s)
- 🌐 [Visit MLoT Page](https://mlot.ai/modular-clipboard/)
- 🔒 [Privacy Policy](https://mlot.ai/privacy)

## Publisher

**Max's Lab of Things**
Visit us at [mlot.ai](https://mlot.ai/)

## License

MIT
