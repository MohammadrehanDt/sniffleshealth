import { useState, useEffect } from "react";
import { useChatStore } from "@/stores";
import type { Message } from "@sniffles/types";

export interface UseChatOptions {
  initialMessages?: Message[];
  autoInitialize?: boolean;
}

export interface UseChatReturn {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: (text: string) => void;
  sendUserMessage: (text: string) => void;
  sendAIMessage: (
    text: string,
    sender?: string,
    options?: string[],
    onOptionSelect?: (option: string) => void,
    linkText?: string,
    linkUrl?: string,
  ) => void;
  clearMessages: () => void;
  initializeMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

/**
 * useChat - Hook for managing chat messages and input
 * Extracts chat logic from components for reusability
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { initialMessages, autoInitialize = false } = options;
  const {
    messages,
    addMessage,
    setMessages,
    clearMessages: clearStoreMessages,
  } = useChatStore();
  const [inputValue, setInputValue] = useState("");

  // Auto-initialize messages if provided and messages are empty
  useEffect(() => {
    if (autoInitialize && initialMessages && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [autoInitialize, initialMessages, messages.length, setMessages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    addMessage({
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    });
    setInputValue("");
  };

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;

    addMessage({
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    });
  };

  const sendAIMessage = (
    text: string,
    sender?: string,
    options?: string[],
    onOptionSelect?: (option: string) => void,
    linkText?: string,
    linkUrl?: string,
  ) => {
    if (!text.trim()) return;

    addMessage({
      type: "ai",
      text: text.trim(),
      sender,
      timestamp: new Date(),
      options,
      onOptionSelect,
      linkText,
      linkUrl,
    });
  };

  const initializeMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const clearMessages = () => {
    clearStoreMessages();
    setInputValue("");
  };

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    sendUserMessage,
    sendAIMessage,
    clearMessages,
    initializeMessages,
    addMessage,
  };
}
