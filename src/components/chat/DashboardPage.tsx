// src/components/chat/DashboardPage.tsx
import React, { useState, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../redux/authSlice';
import { selectChatroom, setSearchTerm, addChatroom, deleteChatroom } from '../../redux/chatroomsSlice';
import { setLoading, addToast } from '../../redux/uiSlice';
import ThemeToggle from '../ui/ThemeToggle';
import useDebounce from '../../hooks/useDebounce';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import useFocusManagement from '../../hooks/useFocusManagement';
import type { Chatroom } from '../../types';
import { UI_CONSTANTS, TOAST_MESSAGES, ERROR_MESSAGES, KEYBOARD_SHORTCUTS } from '../../constants';
import { generateId } from '../../utils/idUtils';

const DashboardPage = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const chatrooms = useAppSelector(state => state.chatrooms.list);
  const searchTerm = useAppSelector(state => state.chatrooms.searchTerm);
  const user = useAppSelector(state => state.auth.user);
  const userId = user?.id;
  const isCreatingChatroom = useAppSelector(state => state.ui.loading.chatroomCreate);

  const [newChatroomTitle, setNewChatroomTitle] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createFormError, setCreateFormError] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [chatroomToDelete, setChatroomToDelete] = useState<{id: string, title: string} | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, UI_CONSTANTS.DEBOUNCE_DELAY);

  // Memoize filtered chatrooms for performance
  const filteredChatrooms = useMemo(() => 
    chatrooms.filter((room: Chatroom) =>
      room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [chatrooms, debouncedSearchTerm]
  );

  // Focus management for modals
  const { containerRef: createModalRef } = useFocusManagement(showCreateModal, {
    trapFocus: true,
    restoreFocus: true,
    autoFocus: true,
  });

  const { containerRef: deleteModalRef } = useFocusManagement(showDeleteModal, {
    trapFocus: true,
    restoreFocus: true,
    autoFocus: true,
  });

  const handleCreateChatroom = useCallback(async () => {
    if (!newChatroomTitle.trim()) {
      setCreateFormError(ERROR_MESSAGES.EMPTY_CHATROOM_TITLE);
      return;
    }
    setCreateFormError('');
    dispatch(setLoading({ chatroomCreate: true }));
    dispatch(addToast({ message: TOAST_MESSAGES.CHATROOM_CREATING, type: 'info' }));

    await new Promise(resolve => setTimeout(resolve, UI_CONSTANTS.CHATROOM_CREATE_DELAY));

    const newRoom: Chatroom = {
      id: generateId(),
      title: newChatroomTitle.trim(),
      messages: [],
    };
    dispatch(addChatroom(newRoom));
    dispatch(addToast({ message: TOAST_MESSAGES.CHATROOM_CREATED(newRoom.title), type: 'success' }));
    setNewChatroomTitle('');
    setShowCreateModal(false);
    dispatch(setLoading({ chatroomCreate: false }));
  }, [newChatroomTitle, dispatch]);

  const handleDeleteChatroom = useCallback(async (id: string, title: string) => {
    dispatch(addToast({ message: TOAST_MESSAGES.CHATROOM_DELETING(title), type: 'info' }));
    await new Promise(resolve => setTimeout(resolve, UI_CONSTANTS.CHATROOM_DELETE_DELAY));
    dispatch(deleteChatroom(id));
    dispatch(addToast({ message: TOAST_MESSAGES.CHATROOM_DELETED(title), type: 'success' }));
    setShowDeleteModal(false);
    setChatroomToDelete(null);
  }, [dispatch]);

  const handleDeleteClick = useCallback((id: string, title: string) => {
    setChatroomToDelete({ id, title });
    setShowDeleteModal(true);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(addToast({ message: TOAST_MESSAGES.LOGOUT_SUCCESS, type: 'info' }));
  }, [dispatch]);

  // Keyboard shortcuts for better accessibility
  useKeyboardShortcuts({
    [KEYBOARD_SHORTCUTS.NEW_CHATROOM]: () => {
      setShowCreateModal(true);
    },
    [KEYBOARD_SHORTCUTS.ESCAPE]: () => {
      if (showCreateModal) {
        setShowCreateModal(false);
      } else if (showDeleteModal) {
        setShowDeleteModal(false);
        setChatroomToDelete(null);
      }
    },
    [KEYBOARD_SHORTCUTS.SEARCH]: () => {
      document.getElementById('chatroom-search')?.focus();
    },
    [KEYBOARD_SHORTCUTS.LOGOUT]: () => {
      handleLogout();
    }
  });

  return (
    <div className="min-h-screen bg-[var(--primary-color)] text-[var(--text-color)]">
      {/* Header */}
      <header className="bg-[var(--primary-color)] flex justify-between items-center" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-medium text-[var(--text-color)]">Chat Manager</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-[var(--subheading-color)]" role="status" aria-label="Current user">{userId}</span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--secondary-color)] hover:bg-[var(--secondary-hover-color)] text-[var(--text-color)] transition-all duration-200 focus:outline-none hover:shadow-md"
              aria-label="Logout from application"
            >
              <span className="material-symbols-rounded text-[20px]">logout</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8" role="main">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="chatroom-search" className="sr-only">Search chatrooms</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[var(--placeholder-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="chatroom-search"
                type="text"
                placeholder="Search your chats"
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="w-full pl-12 pr-4 py-3 bg-[var(--secondary-color)] border-none rounded-full text-[var(--text-color)] focus:outline-none focus:bg-[var(--secondary-hover-color)] transition-all duration-200 placeholder-[var(--placeholder-color)]"
                aria-label="Search chatrooms by title"
                aria-describedby="search-description"
              />
            </div>
            <p id="search-description" className="sr-only">
              Type to filter chatrooms by title. {filteredChatrooms.length} chatroom{filteredChatrooms.length !== 1 ? 's' : ''} found.
            </p>
          </div>
        </div>

        {/* Your Chats Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-[var(--text-color)]">Your Chats</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none"
              aria-label="Open create new chatroom dialog"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          <div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="region"
            aria-label="Chatrooms list"
            aria-live="polite"
          >
            {filteredChatrooms.length > 0 ? (
              filteredChatrooms.map((room: Chatroom) => (
                <div
                  key={room.id}
                  className="group bg-[var(--secondary-color)] rounded-xl hover:bg-[var(--secondary-hover-color)] transition-all duration-200 cursor-pointer"
                  role="article"
                  aria-label={`Chatroom: ${room.title}`}
                  onClick={() => {
                    dispatch(selectChatroom(room.id));
                    navigate(`/chat/${room.id}`);
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {room.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[var(--text-color)] truncate group-hover:text-blue-600 transition-colors duration-200">
                            {room.title}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(room.id, room.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--placeholder-color)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 focus:opacity-100 focus:outline-none"
                        aria-label={`Delete chatroom ${room.title}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-[var(--secondary-color)] rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-[var(--secondary-hover-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--placeholder-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--text-color)] mb-2">
                  {searchTerm ? 'No matching chats' : 'Create your first chat'}
                </h3>
                <p className="text-[var(--subheading-color)] mb-4">
                  {searchTerm 
                    ? `No chats match "${searchTerm}". Try a different search term.`
                    : 'Start a conversation with AI to get help with anything you need.'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create your first chat
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Chatroom Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
            }
          }}
        >
          <div ref={createModalRef as React.RefObject<HTMLDivElement>} className="bg-[var(--secondary-color)] rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 id="modal-title" className="text-lg font-medium text-[var(--text-color)] mb-4">Create new chat</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateChatroom();
              }}>
                <div className="mb-4">
                  <input
                    id="chatroom-title"
                    type="text"
                    placeholder="Chat name"
                    value={newChatroomTitle}
                    onChange={(e) => setNewChatroomTitle(e.target.value)}
                    className="w-full px-6 py-3 bg-[var(--secondary-hover-color)] border-none rounded-full text-[var(--text-color)] focus:outline-none focus:bg-[var(--primary-color)] transition-all duration-200 placeholder-[var(--placeholder-color)]"
                    aria-describedby={createFormError ? "title-error" : undefined}
                    autoFocus
                  />
                  {createFormError && (
                    <p id="title-error" className="text-red-500 text-sm mt-2" role="alert">
                      {createFormError}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-[var(--subheading-color)] hover:text-[var(--text-color)] font-medium transition-colors duration-200"
                    aria-label="Cancel creating chatroom"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingChatroom}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Create new chatroom"
                  >
                    {isCreatingChatroom ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
                        Creating...
                      </>
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && chatroomToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
              setChatroomToDelete(null);
            }
          }}
        >
          <div ref={deleteModalRef as React.RefObject<HTMLDivElement>} className="bg-[var(--secondary-color)] rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 id="delete-modal-title" className="text-lg font-medium text-[var(--text-color)] mb-4">Delete Chat</h2>
              <p className="text-[var(--text-color)] mb-6">
                Are you sure you want to delete "<span className="font-semibold">{chatroomToDelete.title}</span>"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setChatroomToDelete(null);
                  }}
                  className="px-4 py-2 text-[var(--subheading-color)] hover:text-[var(--text-color)] font-medium transition-colors duration-200"
                  aria-label="Cancel deletion"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteChatroom(chatroomToDelete.id, chatroomToDelete.title)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors duration-200 flex items-center justify-center"
                  aria-label="Confirm deletion"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DashboardPage;