import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { StorageService } from './storage';
import { ClipboardBoxProvider, ClipboardBoxTreeItem } from './treeView';
import { ClipboardBox } from './types';

let storageService: StorageService;
let treeDataProvider: ClipboardBoxProvider;

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Modular Clipboard extension is now active');

  // Initialize services
  storageService = new StorageService(context);
  treeDataProvider = new ClipboardBoxProvider(storageService);

  // Register tree view
  const treeView = vscode.window.createTreeView('modularClipboard.boxesView', {
    treeDataProvider: treeDataProvider,
    showCollapseAll: false
  });

  // Register commands
  context.subscriptions.push(
    // Add new box
    vscode.commands.registerCommand('modularClipboard.addBox', async () => {
      const title = await vscode.window.showInputBox({
        prompt: 'Enter a title for the new box',
        placeHolder: 'e.g., API Endpoint, CSS Reset, etc.',
        validateInput: (value) => {
          return value.trim() === '' ? 'Title cannot be empty' : null;
        }
      });

      if (title) {
        const box = await storageService.addBox(title.trim());
        if (box) {
          treeDataProvider.refresh();
          vscode.window.showInformationMessage(`Box "${title}" created`);
        }
      }
    }),

    // Copy box content to clipboard
    vscode.commands.registerCommand('modularClipboard.copyBox', async (item: ClipboardBoxTreeItem | ClipboardBox) => {
      const box = item instanceof ClipboardBoxTreeItem ? item.box : item;

      if (box.content.trim() === '') {
        vscode.window.showWarningMessage(`Box "${box.title}" is empty`);
        return;
      }

      await vscode.env.clipboard.writeText(box.content);
      vscode.window.showInformationMessage(`Copied "${box.title}" to clipboard`);
    }),

    // Edit box content in VS Code editor
    vscode.commands.registerCommand('modularClipboard.editBox', async (item: ClipboardBoxTreeItem) => {
      const box = item.box;

      // Create temporary file
      const tempDir = os.tmpdir();
      const tempFileName = `modular-clipboard-${box.id}.txt`;
      const tempFilePath = path.join(tempDir, tempFileName);

      // Write current content to temp file
      fs.writeFileSync(tempFilePath, box.content, 'utf8');

      // Open temp file in editor
      const doc = await vscode.workspace.openTextDocument(tempFilePath);
      await vscode.window.showTextDocument(doc);

      vscode.window.showInformationMessage(
        `Editing "${box.title}" - Changes auto-save on Cmd/Ctrl+S`,
        'Got it'
      );

      // Watch for saves and auto-save to storage
      const saveDisposable = vscode.workspace.onDidSaveTextDocument(async (savedDoc) => {
        if (savedDoc.uri.fsPath === tempFilePath) {
          const newContent = savedDoc.getText();
          await storageService.updateBox(box.id, { content: newContent });
          treeDataProvider.refresh();
          vscode.window.setStatusBarMessage(`✓ Box "${box.title}" saved`, 2000);
        }
      });

      // Clean up temp file when document is closed
      const closeDisposable = vscode.workspace.onDidCloseTextDocument((closedDoc) => {
        if (closedDoc.uri.fsPath === tempFilePath) {
          saveDisposable.dispose();
          closeDisposable.dispose();

          // Delete temp file
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          } catch (error) {
            console.error('Error deleting temp file:', error);
          }
        }
      });

      context.subscriptions.push(saveDisposable, closeDisposable);
    }),

    // Rename box
    vscode.commands.registerCommand('modularClipboard.renameBox', async (item: ClipboardBoxTreeItem) => {
      const box = item.box;

      const newTitle = await vscode.window.showInputBox({
        prompt: 'Enter new title',
        value: box.title,
        validateInput: (value) => {
          return value.trim() === '' ? 'Title cannot be empty' : null;
        }
      });

      if (newTitle && newTitle.trim() !== box.title) {
        await storageService.updateBox(box.id, { title: newTitle.trim() });
        treeDataProvider.refresh();
        vscode.window.showInformationMessage(`Box renamed to "${newTitle}"`);
      }
    }),

    // Delete box
    vscode.commands.registerCommand('modularClipboard.deleteBox', async (item: ClipboardBoxTreeItem) => {
      const box = item.box;

      const confirmation = await vscode.window.showWarningMessage(
        `Delete box "${box.title}"?`,
        { modal: true },
        'Delete'
      );

      if (confirmation === 'Delete') {
        await storageService.deleteBox(box.id);
        treeDataProvider.refresh();
        vscode.window.showInformationMessage(`Box "${box.title}" deleted`);
      }
    }),

    treeView
  );

  // Show welcome message on first activation
  const hasShownWelcome = context.globalState.get('modularClipboard.hasShownWelcome');
  if (!hasShownWelcome) {
    vscode.window.showInformationMessage(
      'Welcome to Modular Clipboard! Click the + icon to create your first box.',
      'Got it'
    );
    context.globalState.update('modularClipboard.hasShownWelcome', true);
  }
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Modular Clipboard extension deactivated');
}
