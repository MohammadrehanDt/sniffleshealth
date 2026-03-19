/**
 * Common types used across the application
 */

export type MessageType = "ai" | "user";

export interface Message {
  type: MessageType;
  text: string;
  timestamp?: Date;
  sender?: string;
  linkText?: string;
  linkUrl?: string;
  options?: string[];
  onOptionSelect?: (option: string) => void;
}

export type ConsultationType = "text" | "video";

export interface SocialHistoryItem {
  type: string;
  level: string;
}

