// src/components/chat/MessageItem.tsx
import React, { memo } from 'react';
import type { Message } from '../../types';

interface MessageItemProps {
  message: Message;
  onCopyMessage: (content: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = memo(({ message, onCopyMessage }) => {
  // Format timestamp to show only hours and minutes
  const formatTime = (timestamp: string) => {
    try {
      // If timestamp is already in a time format, parse it
      const date = new Date(`1970-01-01 ${timestamp}`);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // If it's a full date string, parse it directly
      const fullDate = new Date(timestamp);
      if (!isNaN(fullDate.getTime())) {
        return fullDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Fallback: return original timestamp
      return timestamp;
    } catch {
      return timestamp;
    }
  };

  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={`Message from ${message.sender === 'user' ? 'you' : 'AI assistant'} at ${message.timestamp}`}
    >
      <div className={`relative px-5 py-4 rounded-3xl max-w-[70%] group ${
        message.sender === 'user'
          ? 'bg-[var(--secondary-color)] text-[var(--text-color)] rounded-tr-sm'
          : 'bg-transparent text-[var(--text-color)] rounded-tl-sm'
      }`}>
        {message.image && (
          <img 
            src={message.image} 
            alt={`Image uploaded by ${message.sender === 'user' ? 'you' : 'AI assistant'}`} 
            className="max-w-full max-h-64 w-auto h-auto rounded-2xl object-cover"
          />
        )}
        {message.content && (
          <p className={`text-sm break-words ${message.image ? 'mt-3' : ''}`} role="text">{message.content}</p>
        )}
        <time 
          className={`block text-xs mt-1 text-[var(--subheading-color)]`}
          dateTime={message.timestamp}
        >
          {formatTime(message.timestamp)}
        </time>
        <button
          onClick={() => onCopyMessage(message.content)}
          className="absolute top-1 right-1 p-1 h-[29px] rounded-full bg-[var(--secondary-hover-color)]/50 text-[var(--text-color)] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 focus:outline-none"
          aria-label={`Copy message: ${message.content.substring(0, 50)}...`}
          tabIndex={0}
        >
          <span className="material-symbols-rounded text-[20px]">content_copy</span>
        </button>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
