/**
 * Represents a single clipboard box containing reusable content
 */
export interface ClipboardBox {
  /** Unique identifier for the box */
  id: string;

  /** User-defined title/name for the box */
  title: string;

  /** The actual content stored in the box */
  content: string;

  /** Timestamp when the box was created */
  createdAt: number;

  /** Timestamp when the box was last updated */
  updatedAt: number;
}

/**
 * Collection of all clipboard boxes
 */
export interface ClipboardData {
  boxes: ClipboardBox[];
  version: string;
}
