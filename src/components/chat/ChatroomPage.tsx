// src/components/chat/ChatroomPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGlobalDispatch, useGlobalState } from '../../App';
import ThemeToggle from '../ui/ThemeToggle';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import useThrottle from '../../hooks/useThrottle';
import type { Message, Chatroom } from '../../types';

interface ChatroomPageProps {
  onBackToDashboard: () => void;
}

const ChatroomPage: React.FC<ChatroomPageProps> = ({ onBackToDashboard }) => {
  const dispatch = useGlobalDispatch();
  const { chatrooms, messages, ui } = useGlobalState();
  const selectedChatroomId = chatrooms.selectedChatroomId;
  const isLoadingOlderMessages = ui.loading.messageSend;
  const isTyping = ui.isTyping;

  const chatroom: Chatroom | undefined = chatrooms.list.find(room => room.id === selectedChatroomId);
  const currentChatMessages: Message[] = messages[selectedChatroomId || ''] || [];

  const [messageInput, setMessageInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastAiResponseTime = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    if (!isLoadingOlderMessages) {
      scrollToBottom();
    }
  }, [currentChatMessages, isLoadingOlderMessages, scrollToBottom]);

  const fetchOlderMessages = useCallback(async () => {
    if (isLoadingOlderMessages) return;

    dispatch({ type: 'ui/setLoading', payload: { messageSend: true } });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const dummyOlderMessages: Message[] = [];

    if (dummyOlderMessages.length > 0) {
      dispatch({ type: 'messages/prependMessages', payload: { chatroomId: selectedChatroomId!, messages: dummyOlderMessages.reverse() } });
    }
    dispatch({ type: 'ui/setLoading', payload: { messageSend: false } });
  }, [dispatch, isLoadingOlderMessages, selectedChatroomId]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      if (chatContainer.scrollTop === 0 && !isLoadingOlderMessages && currentChatMessages.length > 0) {
        fetchOlderMessages();
      }
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, [fetchOlderMessages, isLoadingOlderMessages, currentChatMessages.length]);

  const sendAiResponseThrottled = useThrottle((userMessage: string) => {
    const aiResponses: string[] = [
      "That's an interesting point!",
      "I understand. How can I assist further?",
      "Could you elaborate on that?",
      "I'm still learning, but I'll do my best to help.",
      "Thanks for your message!",
      "I'm here to chat. What's on your mind?",
    ];
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

    const aiMessage: Message = {
      id: Date.now() + '-ai',
      sender: 'ai',
      content: randomResponse,
      timestamp: new Date().toLocaleTimeString(),
      type: 'text',
    };
    dispatch({ type: 'messages/addMessage', payload: { chatroomId: selectedChatroomId!, message: aiMessage } });
    dispatch({ type: 'ui/setTypingIndicator', payload: false });
    lastAiResponseTime.current = Date.now();
  }, 2000);

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedImage) return;

    dispatch({ type: 'ui/setLoading', payload: { messageSend: true } });
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageInput.trim(),
      image: selectedImage,
      timestamp: new Date().toLocaleTimeString(),
      type: selectedImage ? 'image' : 'text',
    };

    dispatch({ type: 'messages/addMessage', payload: { chatroomId: selectedChatroomId!, message: newMessage } });
    dispatch({ type: 'chatrooms/addMessageToChatroom', payload: { chatroomId: selectedChatroomId!, messageId: newMessage.id } });

    setMessageInput('');
    setSelectedImage(null);
    dispatch({ type: 'ui/addToast', payload: { message: 'Message sent!', type: 'success' } });

    dispatch({ type: 'ui/setTypingIndicator', payload: true });

    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      sendAiResponseThrottled(newMessage.content);
    }, delay);

    dispatch({ type: 'ui/setLoading', payload: { messageSend: false } });
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      dispatch({ type: 'ui/addToast', payload: { message: 'Message copied!', type: 'info' } });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      dispatch({ type: 'ui/addToast', payload: { message: 'Failed to copy message.', type: 'error' } });
    });
  };

  if (!chatroom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <p className="text-xl text-slate-600 dark:text-slate-400">Chatroom not found. Please go back to dashboard.</p>
        <button
          onClick={onBackToDashboard}
          className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center">
        <button
          onClick={() => {
            onBackToDashboard();
            dispatch({ type: 'messages/clearMessages' });
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          &larr; Back
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{chatroom.title}</h2>
        <ThemeToggle />
      </header>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {isLoadingOlderMessages && (
          <div className="text-center py-2">
            <LoadingSkeleton count={3} className="h-12 w-full mb-2" />
          </div>
        )}
        {currentChatMessages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`relative p-3 rounded-lg shadow-md max-w-[70%] group ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-bl-none'
            }`}>
              {msg.type === 'text' && msg.content && <p className="text-sm break-words">{msg.content}</p>}
              {msg.type === 'image' && msg.image && (
                <img src={msg.image} alt="Uploaded" className="max-w-full h-auto rounded-md mt-2" />
              )}
              <span className={`block text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {msg.timestamp}
              </span>
              <button
                onClick={() => copyToClipboard(msg.content)}
                className="absolute top-1 right-1 p-1 rounded-full bg-slate-300/50 dark:bg-slate-600/50 text-slate-800 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Copy message"
              >
                📋
              </button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg shadow-md bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-bl-none text-sm italic">
              Gemini is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 shadow-lg flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={handleImageUploadClick}
          className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
          aria-label="Upload image"
        >
          🖼️
        </button>
        <button
          onClick={handleSendMessage}
          disabled={ui.loading.messageSend || (!messageInput.trim() && !selectedImage)}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Send message"
        >
          {ui.loading.messageSend ? (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent"></span>
          ) : '🚀'}
        </button>
      </div>
    </div>
  );
};

export default ChatroomPage;