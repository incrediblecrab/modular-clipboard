import * as vscode from 'vscode';
import { ClipboardBox, ClipboardData } from './types';

const STORAGE_KEY = 'modularClipboard.boxes';
const STORAGE_VERSION = '1.0.0';

/**
 * Service for managing clipboard box storage using VS Code global state
 */
export class StorageService {
  private context: vscode.ExtensionContext;
  private autoSaveEnabled: boolean = true;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Get all clipboard boxes from storage
   */
  async getBoxes(): Promise<ClipboardBox[]> {
    try {
      const data = this.context.globalState.get<ClipboardData>(STORAGE_KEY);

      if (!data || !data.boxes) {
        return [];
      }

      // Validate data structure
      return data.boxes.filter(box =>
        box &&
        typeof box.id === 'string' &&
        typeof box.title === 'string' &&
        typeof box.content === 'string'
      );
    } catch (error) {
      console.error('Error loading boxes:', error);
      vscode.window.showErrorMessage('Failed to load clipboard boxes');
      return [];
    }
  }

  /**
   * Save all clipboard boxes to storage
   * Auto-saves by default, can be called manually
   */
  async saveBoxes(boxes: ClipboardBox[]): Promise<boolean> {
    try {
      const data: ClipboardData = {
        boxes,
        version: STORAGE_VERSION
      };

      await this.context.globalState.update(STORAGE_KEY, data);
      return true;
    } catch (error) {
      console.error('Error saving boxes:', error);
      vscode.window.showErrorMessage('Failed to save clipboard boxes');
      return false;
    }
  }

  /**
   * Add a new clipboard box
   */
  async addBox(title: string, content: string = ''): Promise<ClipboardBox | null> {
    try {
      const boxes = await this.getBoxes();

      const newBox: ClipboardBox = {
        id: this.generateId(),
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      boxes.push(newBox);

      if (this.autoSaveEnabled) {
        await this.saveBoxes(boxes);
      }

      return newBox;
    } catch (error) {
      console.error('Error adding box:', error);
      vscode.window.showErrorMessage('Failed to add new box');
      return null;
    }
  }

  /**
   * Update an existing clipboard box
   */
  async updateBox(id: string, updates: Partial<Pick<ClipboardBox, 'title' | 'content'>>): Promise<boolean> {
    try {
      const boxes = await this.getBoxes();
      const index = boxes.findIndex(box => box.id === id);

      if (index === -1) {
        vscode.window.showWarningMessage('Box not found');
        return false;
      }

      boxes[index] = {
        ...boxes[index],
        ...updates,
        updatedAt: Date.now()
      };

      if (this.autoSaveEnabled) {
        await this.saveBoxes(boxes);
      }

      return true;
    } catch (error) {
      console.error('Error updating box:', error);
      vscode.window.showErrorMessage('Failed to update box');
      return false;
    }
  }

  /**
   * Delete a clipboard box
   */
  async deleteBox(id: string): Promise<boolean> {
    try {
      const boxes = await this.getBoxes();
      const filteredBoxes = boxes.filter(box => box.id !== id);

      if (filteredBoxes.length === boxes.length) {
        vscode.window.showWarningMessage('Box not found');
        return false;
      }

      if (this.autoSaveEnabled) {
        await this.saveBoxes(filteredBoxes);
      }

      return true;
    } catch (error) {
      console.error('Error deleting box:', error);
      vscode.window.showErrorMessage('Failed to delete box');
      return false;
    }
  }

  /**
   * Get a single box by ID
   */
  async getBox(id: string): Promise<ClipboardBox | null> {
    const boxes = await this.getBoxes();
    return boxes.find(box => box.id === id) || null;
  }

  /**
   * Export boxes as JSON string for editing
   */
  async exportJSON(): Promise<string> {
    const boxes = await this.getBoxes();
    const data: ClipboardData = {
      boxes,
      version: STORAGE_VERSION
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import boxes from JSON string
   */
  async importJSON(json: string): Promise<boolean> {
    try {
      const data = JSON.parse(json) as ClipboardData;

      if (!data.boxes || !Array.isArray(data.boxes)) {
        vscode.window.showErrorMessage('Invalid JSON format');
        return false;
      }

      // Validate each box
      const validBoxes = data.boxes.filter(box =>
        box &&
        typeof box.id === 'string' &&
        typeof box.title === 'string' &&
        typeof box.content === 'string'
      );

      await this.saveBoxes(validBoxes);
      vscode.window.showInformationMessage(`Imported ${validBoxes.length} boxes successfully`);
      return true;
    } catch (error) {
      console.error('Error importing JSON:', error);
      vscode.window.showErrorMessage('Failed to import JSON: Invalid format');
      return false;
    }
  }

  /**
   * Generate a unique ID for a box
   */
  private generateId(): string {
    return `box-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
