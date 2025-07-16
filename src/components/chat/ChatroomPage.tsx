// src/components/chat/ChatroomPage.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { selectChatroom } from '../../redux/chatroomsSlice';
import { addMessage } from '../../redux/messagesSlice';
import { addMessageToChatroom } from '../../redux/chatroomsSlice';
import { setLoading, addToast, setTypingIndicator } from '../../redux/uiSlice';
import { useMessagePagination } from '../../hooks/useMessagePagination';
import ThemeToggle from '../ui/ThemeToggle';
import ShimmerEffect from '../ui/ShimmerEffect';
import OptimizedMessageList from './OptimizedMessageList';
import useThrottle from '../../hooks/useThrottle';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import useFocusManagement from '../../hooks/useFocusManagement';
import type { Message, Chatroom } from '../../types';
import { MESSAGE_CONSTANTS, AI_RESPONSES, SCROLL_BEHAVIOR, KEYBOARD_SHORTCUTS } from '../../constants';
import { getCurrentTimestamp } from '../../utils/dateUtils';
import { generateId, generateAiMessageId } from '../../utils/idUtils';

const ChatroomPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: chatroomId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const chatrooms = useAppSelector(state => state.chatrooms.list);
  const isTyping = useAppSelector(state => state.ui.isTyping);
  const isMessageSending = useAppSelector(state => state.ui.loading.messageSend);
  const selectedChatroomId = chatroomId;

  // Use the pagination hook for message management
  const {
    currentMessages,
    isLoading: isLoadingOlderMessages,
    hasMore,
  } = useMessagePagination(selectedChatroomId);

  const chatroom: Chatroom | undefined = useMemo(() => 
    chatrooms.find((room) => room.id === selectedChatroomId),
    [chatrooms, selectedChatroomId]
  );

  // Focus management for accessibility
  useFocusManagement(true, {
    autoFocus: false,
    restoreFocus: true,
  });

  // Update the selected chatroom in global state when route changes
  useEffect(() => {
    if (chatroomId) {
      dispatch(selectChatroom(chatroomId));
    }
  }, [chatroomId, dispatch]);

  const [messageInput, setMessageInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastAiResponseTime = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);
  const hasScrolledManually = useRef<boolean>(false);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? SCROLL_BEHAVIOR.SMOOTH : SCROLL_BEHAVIOR.INSTANT,
        block: SCROLL_BEHAVIOR.BLOCK_END,
      });
    }
  }, []);

  // Initialize scroll to bottom immediately when chatroom changes
  useEffect(() => {
    if (selectedChatroomId) {
      isInitialLoad.current = true;
      hasScrolledManually.current = false;
      
      // Set container to bottom immediately to prevent visual jump
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [selectedChatroomId]);

  // Handle initial messages load - ensure stays at bottom
  useEffect(() => {
    if (currentMessages.length > 0 && isInitialLoad.current && !isLoadingOlderMessages) {
      // Multiple attempts to ensure scroll to bottom on initial load
      const scrollToBottomImmediate = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        scrollToBottom(false);
      };
      
      // Immediate scroll
      scrollToBottomImmediate();
      
      // Backup scroll after short delay
      setTimeout(() => {
        scrollToBottomImmediate();
        isInitialLoad.current = false;
      }, MESSAGE_CONSTANTS.SCROLL_TIMEOUT);
    }
  }, [currentMessages.length, isLoadingOlderMessages, scrollToBottom]);

  // Auto-scroll for new messages only if user hasn't manually scrolled up
  useEffect(() => {
    if (!isLoadingOlderMessages && !isInitialLoad.current && currentMessages.length > 0) {
      const chatContainer = chatContainerRef.current;
      if (chatContainer && !hasScrolledManually.current) {
        // Check if user is near bottom (within threshold)
        const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < MESSAGE_CONSTANTS.SCROLL_THRESHOLD;
        if (isNearBottom) {
          scrollToBottom(true);
        }
      }
    }
  }, [currentMessages.length, isLoadingOlderMessages, scrollToBottom]);

  const sendAiResponseThrottled = useThrottle(() => {
    const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)] || "I'm here to help!";

    const aiMessage: Message = {
      id: generateAiMessageId(),
      sender: 'ai',
      content: randomResponse,
      timestamp: getCurrentTimestamp(),
      type: 'text',
    };
    dispatch(addMessage({ chatroomId: selectedChatroomId!, message: aiMessage }));
    dispatch(setTypingIndicator(false));
    lastAiResponseTime.current = Date.now();
  }, 2000);

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedImage) return;

    dispatch(setLoading({ messageSend: true }));
    const newMessage: Message = {
      id: generateId(),
      sender: 'user',
      content: messageInput.trim(),
      image: selectedImage,
      timestamp: getCurrentTimestamp(),
      type: selectedImage ? 'image' : 'text',
    };

    dispatch(addMessage({ chatroomId: selectedChatroomId!, message: newMessage }));
    dispatch(addMessageToChatroom({ chatroomId: selectedChatroomId!, messageId: newMessage.id }));

    setMessageInput('');
    setSelectedImage(null);
    dispatch(addToast({ message: 'Message sent!', type: 'success' }));

    dispatch(setTypingIndicator(true));

    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      sendAiResponseThrottled();
    }, delay);

    dispatch(setLoading({ messageSend: false }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          dispatch(addToast({ message: 'Message copied!', type: 'info' }));
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          dispatch(addToast({ message: 'Failed to copy message', type: 'error' }));
        });
    },
    [dispatch]
  );

  // Keyboard shortcuts for better accessibility
  useKeyboardShortcuts({
    enter: () => {
      if (messageInput.trim() || selectedImage) {
        handleSendMessage();
      }
    },
    [KEYBOARD_SHORTCUTS.SEND_MESSAGE]: () => {
      if (messageInput.trim() || selectedImage) {
        handleSendMessage();
      }
    },
    [KEYBOARD_SHORTCUTS.ESCAPE]: () => {
      if (selectedImage) {
        setSelectedImage(null);
      }
    },
    'ctrl+b': () => {
      navigate('/dashboard');
    },
    'ctrl+k': () => {
      document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
    },
  });

  if (!chatroom) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[var(--primary-color)]"
        role="alert"
      >
        <div className="text-center">
          <p className="text-xl text-[var(--subheading-color)] mb-4">
            Chatroom not found. Please go back to dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors duration-200 focus:outline-none"
            aria-label="Navigate back to dashboard"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--primary-color)] text-[var(--text-color)]">
      <header
        className="fixed top-0 left-0 right-0 z-10 bg-[var(--primary-color)] p-4 flex justify-between items-center"
        role="banner"
      >
        <button
          onClick={() => {
            navigate('/dashboard');
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--secondary-color)] hover:bg-[var(--secondary-hover-color)] text-[var(--text-color)] transition-all duration-200 focus:outline-none hover:shadow-md"
          aria-label="Navigate back to dashboard"
        >
          <span className="material-symbols-rounded text-[20px]">arrow_back</span>
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-[var(--text-color)]" aria-live="polite">
          {chatroom.title}
        </h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center flex-col pt-17 pb-20 bg-[var(--primary-color)]" role="main">
        <div
          ref={chatContainerRef}
          className="flex-1 max-w-4xl size-full overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[var(--primary-color)]"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          style={{ 
            scrollBehavior: isInitialLoad.current ? 'auto' : 'smooth',
            overscrollBehavior: 'contain'
          }}
        >
          {isLoadingOlderMessages && (
            <div className="text-center py-4" aria-label="Loading older messages">
              <div className="flex items-center justify-center gap-2 text-[var(--subheading-color)]">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-[var(--subheading-color)] border-solid rounded-full border-r-transparent"></div>
                <span className="text-sm">Loading older messages...</span>
              </div>
            </div>
          )}
          {!hasMore && currentMessages.length > 0 && (
            <div className="text-center py-4 text-[var(--subheading-color)] text-sm">
              You've reached the beginning of the conversation
            </div>
          )}

          {currentMessages.length === 0 && !isLoadingOlderMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-12 px-6 max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
                  <span className="material-symbols-rounded text-[48px] text-[var(--text-color)] opacity-60">chat_bubble_outline</span>
                </div>
                <h3 className="text-2xl font-semibold text-[var(--text-color)] mb-3">
                  Start the conversation
                </h3>
                <p className="text-[var(--subheading-color)] mb-8 leading-relaxed text-base">
                  Send your first message to get started with AI assistance. Ask anything you'd like
                  to know!
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--secondary-color)] hover:bg-[var(--secondary-hover-color)] text-[var(--text-color)] rounded-2xl text-sm font-medium transition-colors duration-200 shadow-sm">
                  <span className="material-symbols-rounded text-[20px] text-blue-500">lightbulb</span>
                  <span>Type your message below and press Enter</span>
                </div>
              </div>
            </div>
          ) : (
            <OptimizedMessageList
              messages={currentMessages}
              onCopyMessage={copyToClipboard}
              hasMore={hasMore}
              isLoadingMore={isLoadingOlderMessages}
            />
          )}
          {isTyping && (
              <ShimmerEffect />
          )}
          {/* Scroll anchor for auto-scroll to bottom */}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        <div className="fixed w-full left-0 bottom-0 z-10 p-4 bg-[var(--primary-color)]">
          {/* Image Preview */}
          {selectedImage && (
            <div className="max-w-4xl mx-auto mb-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--secondary-color)] rounded-2xl">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected image preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-color)] font-medium">Image selected</p>
                  <p className="text-xs text-[var(--subheading-color)]">Ready to send with your message</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded-full hover:bg-[var(--secondary-hover-color)] text-[var(--text-color)] transition-colors duration-200 focus:outline-none"
                  aria-label="Remove selected image"
                >
                  <span className="material-symbols-rounded text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}
          
          <form
            className="max-w-4xl mx-auto flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            role="form"
            aria-label="Send message form"
          >
            <div className="relative flex-1 h-14">
              <input
                type="text"
                placeholder="Ask Gemini"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full h-full border-none outline-none resize-none text-base text-[var(--text-color)] py-4 pr-16 pl-6 rounded-full bg-[var(--secondary-color)] placeholder-[var(--placeholder-color)] focus:bg-[var(--secondary-hover-color)] transition-colors duration-200"
                aria-label="Type your message"
                disabled={isMessageSending}
                required
              />
              <button
                type="submit"
                disabled={isMessageSending || (!messageInput.trim() && !selectedImage)}
                className={`absolute right-0 top-0 w-14 h-14 flex-shrink-0 cursor-pointer rounded-full flex text-xl text-[var(--text-color)] items-center justify-center bg-transparent border-none outline-none transition-transform duration-200 ${
                  messageInput.trim() || selectedImage ? 'scale-100' : 'scale-0'
                }`}
                aria-label="Send message"
              >
                {isMessageSending ? (
                  <span
                    className="animate-spin inline-block w-5 h-5 border-2 border-[var(--text-color)] border-solid rounded-full border-r-transparent"
                    aria-label="Sending message"
                  ></span>
                ) : (
                  <span className="material-symbols-rounded">send</span>
                )}
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleImageUploadClick}
                className="w-14 h-14 flex-shrink-0 cursor-pointer rounded-full flex text-xl text-[var(--text-color)] items-center justify-center bg-[var(--secondary-color)] hover:bg-[var(--secondary-hover-color)] transition-colors duration-200"
                aria-label="Upload image"
                disabled={isMessageSending}
              >
                <span className="material-symbols-rounded">image</span>
              </button>
            </div>
          </form>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            aria-label="Upload image file"
          />
        </div>
      </main>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatroomPage;
