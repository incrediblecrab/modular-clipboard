import * as vscode from 'vscode';
import { ClipboardBox } from './types';
import { StorageService } from './storage';

/**
 * Tree item representing a clipboard box in the sidebar
 */
export class ClipboardBoxTreeItem extends vscode.TreeItem {
  constructor(
    public readonly box: ClipboardBox,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(box.title, collapsibleState);

    this.tooltip = this.getTooltip();
    this.description = this.getDescription();
    this.contextValue = 'clipboardBox';

    // Click to copy functionality
    this.command = {
      command: 'modularClipboard.copyBox',
      title: 'Copy Box Content',
      arguments: [this.box]
    };

    // Icon
    this.iconPath = new vscode.ThemeIcon('note');
  }

  private getTooltip(): string {
    const contentPreview = this.box.content.length > 100
      ? this.box.content.substring(0, 100) + '...'
      : this.box.content;

    return `${this.box.title}\n\nClick to copy\n\n${contentPreview || '(empty)'}`;
  }

  private getDescription(): string {
    const contentLength = this.box.content.length;
    if (contentLength === 0) {
      return '(empty)';
    }
    const lines = this.box.content.split('\n').length;
    return `${lines} line${lines !== 1 ? 's' : ''}, ${contentLength} char${contentLength !== 1 ? 's' : ''}`;
  }
}

/**
 * Tree data provider for the clipboard boxes view
 */
export class ClipboardBoxProvider implements vscode.TreeDataProvider<ClipboardBoxTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ClipboardBoxTreeItem | undefined | null | void> =
    new vscode.EventEmitter<ClipboardBoxTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ClipboardBoxTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private storageService: StorageService) {}

  /**
   * Refresh the tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get tree item for a given element
   */
  getTreeItem(element: ClipboardBoxTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children (root level boxes)
   */
  async getChildren(element?: ClipboardBoxTreeItem): Promise<ClipboardBoxTreeItem[]> {
    if (element) {
      // No children for individual boxes
      return [];
    }

    const boxes = await this.storageService.getBoxes();

    if (boxes.length === 0) {
      return [];
    }

    return boxes.map(
      box => new ClipboardBoxTreeItem(box, vscode.TreeItemCollapsibleState.None)
    );
  }
}
