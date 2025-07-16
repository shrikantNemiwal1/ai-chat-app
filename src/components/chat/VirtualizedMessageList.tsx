// src/components/chat/OptimizedMessageList.tsx
import React, { memo, useMemo, useCallback } from 'react';
import MessageItem from './MessageItem';
import type { Message } from '../../types';
import { ARIA_ROLES, ARIA_LABELS } from '../../constants';

interface OptimizedMessageListProps {
  messages: Message[];
  onCopyMessage: (content: string) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const OptimizedMessageList: React.FC<OptimizedMessageListProps> = memo(({
  messages,
  onCopyMessage,
  isLoading = false,
  onLoadMore,
  containerRef
}) => {
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && onLoadMore && !isLoading && messages.length > 0) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, messages.length]);

  const memoizedMessages = useMemo(() => {
    return messages.map((message) => (
      <MessageItem 
        key={message.id} 
        message={message} 
        onCopyMessage={onCopyMessage} 
      />
    ));
  }, [messages, onCopyMessage]);

  if (messages.length === 0) {
    return (
      <div 
        className="flex items-center justify-center h-full text-[var(--subheading-color)]"
        role={ARIA_ROLES.STATUS}
        aria-label="No messages"
      >
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      role={ARIA_ROLES.LOG}
      aria-label={ARIA_LABELS.MESSAGE_LIST}
      aria-live="polite"
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      onScroll={handleScroll}
      tabIndex={0}
    >
      {memoizedMessages}
    </div>
  );
});

OptimizedMessageList.displayName = 'OptimizedMessageList';

export default OptimizedMessageList;
