// src/components/chat/OptimizedMessageList.tsx
import React, { memo, useCallback, useMemo } from 'react';
import MessageItem from './MessageItem';
import type { Message } from '../../types';
import { ARIA_LABELS, ARIA_ROLES } from '../../constants';

interface OptimizedMessageListProps {
  messages: Message[];
  onCopyMessage: (text: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

const OptimizedMessageList = memo<OptimizedMessageListProps>(({
  messages,
  onCopyMessage,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false
}) => {
  // Memoize the copy handler to prevent unnecessary re-renders
  const handleCopyMessage = useCallback((text: string) => {
    onCopyMessage(text);
  }, [onCopyMessage]);

  // Handle load more with scroll detection
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;
    
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    // Load more when scrolled to within 100px of the top
    if (scrollTop <= 100 && scrollHeight > clientHeight) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Memoize message items to prevent unnecessary re-renders
  const messageItems = useMemo(() => 
    messages.map((message) => (
      <MessageItem
        key={message.id}
        message={message}
        onCopyMessage={handleCopyMessage}
      />
    )),
    [messages, handleCopyMessage]
  );

  return (
    <div
      className="message-list-container"
      onScroll={handleScroll}
      role={ARIA_ROLES.LOG}
      aria-label={ARIA_LABELS.MESSAGE_LIST}
      aria-live="polite"
    >
      {isLoadingMore && (
        <div 
          className="text-center py-4" 
          aria-label={ARIA_LABELS.LOAD_OLDER_MESSAGES}
        >
          <div className="flex items-center justify-center gap-2 text-[var(--subheading-color)]">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-[var(--subheading-color)] border-solid rounded-full border-r-transparent"></div>
            <span className="text-sm">Loading older messages...</span>
          </div>
        </div>
      )}
      
      {!hasMore && messages.length > 0 && (
        <div className="text-center py-4 text-[var(--subheading-color)] text-sm">
          You've reached the beginning of the conversation
        </div>
      )}
      
      {messageItems}
    </div>
  );
});

OptimizedMessageList.displayName = 'OptimizedMessageList';

export default OptimizedMessageList;
