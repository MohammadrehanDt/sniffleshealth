/**
 * DoctorChatMessages - Messages display area for doctor chat
 * Handles rendering of AI and user messages with auto-scroll
 */

import { RefObject } from "react";
import type { Message } from "@sniffles/types";
import { AIMessage, UserMessage } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat";

interface DoctorChatMessagesProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
  lastMessageRef: RefObject<HTMLDivElement>;
  isWaitingForAnswer?: boolean;
}

export function DoctorChatMessages({
  messages,
  messagesEndRef,
  lastMessageRef,
  isWaitingForAnswer = false,
}: DoctorChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-10">
        <div className="flex flex-col gap-[22px] max-w-[672px] mx-auto">
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
              <div
                key={index}
                ref={isLastMessage ? lastMessageRef : null}
                className={
                  message.type === "ai"
                    ? "w-full"
                    : "w-auto max-w-[80%] self-end"
                }
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {message.type === "ai" ? (
                  <AIMessage
                    text={message.text}
                    sender={message.sender || "Sniffles Health Assistant"}
                    linkText={message.linkText}
                    linkUrl={message.linkUrl}
                  />
                ) : (
                  <UserMessage text={message.text} />
                )}
              </div>
            );
          })}
          {isWaitingForAnswer &&
            messages.length > 0 &&
            messages[messages.length - 1]?.type === "user" && (
              <div className="w-full">
                <TypingIndicator sender="Sniffles Health Assistant" />
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
