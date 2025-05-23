"use client"

import { useEffect } from "react"

import { setGlobalChatContext } from "@/hooks/use-chat-with-tools"
import { useContactChat } from "@/hooks/use-contact-chat"

import { MarketingChatBotErrorMessage } from "@/components/app/marketing-chat-bot-error-message"
import { MarketingChatInput } from "@/components/app/marketing-chat-input"
import { MarketingChatMessages } from "@/components/app/marketing-chat-messages"
import { MarketingSuggestedPrompts } from "@/components/app/marketing-suggeted-prompts"
import { Card } from "@/components/ui/card"

export function MarketingChatBot() {
  const {
    chatContext,
    messages,
    hasError,
    errorMessage,
    isLoading,
    isCancelling,
    showSuggestions,
    handleSuggestionClick,
    messagesEndRef,
    input,
    handleInputChange,
    handleFormSubmit,
    handleKeyDown,
    isMessageLimitReached,
    chatContainerRef,
  } = useContactChat()

  useEffect(() => {
    setGlobalChatContext(chatContext)
  }, [chatContext])

  // Prevent auto-scrolling when component mounts
  useEffect(() => {
    // Ensure we're at the top of the page when the component loads
    window.scrollTo(0, 0)
  }, [])

  const chatContextForInput = {
    input,
    handleInputChange,
    handleFormSubmit: (e: React.FormEvent) =>
      handleFormSubmit(e as React.FormEvent<HTMLFormElement>),
    handleKeyDown,
  }

  return (
    <Card
      id="chat-container"
      className="bg-primary-foreground flex h-[600px] w-full flex-col overflow-hidden rounded-none"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <MarketingChatMessages
          messages={messages}
          isLoading={isLoading}
          isCancelling={isCancelling}
          messagesEndRef={messagesEndRef}
          chatContainerRef={chatContainerRef}
        />

        {showSuggestions && messages.length === 1 && (
          <MarketingSuggestedPrompts
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>

      {!isMessageLimitReached && (
        <div className="flex-shrink-0 border-t p-4">
          {hasError && (
            <div className="mb-2 flex justify-center">
              <MarketingChatBotErrorMessage message={errorMessage} />
            </div>
          )}
          <MarketingChatInput
            chatContext={chatContextForInput}
            isLoading={isLoading}
            isCancelling={isCancelling}
          />
        </div>
      )}
    </Card>
  )
}
