/**
 * Hook to automatically scroll to bottom when content changes
 * Only scrolls if user is already at or near the bottom (preserves scroll position)
 * Useful for chat interfaces
 */

import { useEffect, useRef } from "react";

export function useScrollToBottom<T>(dependencies: T[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  const getScrollContainer = (): HTMLElement | null => {
    // Find the scrollable parent container
    if (!messagesEndRef.current) return null;
    let parent = messagesEndRef.current.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  const checkIfAtBottom = (container: HTMLElement): boolean => {
    const threshold = 100; // pixels from bottom to consider "at bottom"
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= threshold;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Track scroll position to detect if user has scrolled up
  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const handleScroll = () => {
      wasAtBottomRef.current = checkIfAtBottom(container);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll only if user was at bottom
  useEffect(() => {
    const container = getScrollContainer();
    if (container) {
      // Check current position before scrolling
      wasAtBottomRef.current = checkIfAtBottom(container);

      if (wasAtBottomRef.current) {
        scrollToBottom();
        // Update after scroll completes
        setTimeout(() => {
          if (container) {
            wasAtBottomRef.current = checkIfAtBottom(container);
          }
        }, 100);
      }
    } else {
      // Fallback: always scroll if container not found
      scrollToBottom();
    }
  }, dependencies);

  return {
    messagesEndRef,
    scrollToBottom,
  };
}
