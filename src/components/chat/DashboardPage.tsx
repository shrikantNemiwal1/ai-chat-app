// src/components/chat/DashboardPage.tsx
import React, { useState } from 'react';
import { useGlobalDispatch, useGlobalState } from '../../App';
import ThemeToggle from '../ui/ThemeToggle';
import useDebounce from '../../hooks/useDebounce';
import type { Chatroom } from '../../types';

interface DashboardPageProps {
  onSelectChatroom: (id: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectChatroom }) => {
  const dispatch = useGlobalDispatch();
  const { chatrooms, auth, ui } = useGlobalState();
  const searchTerm = chatrooms.searchTerm;
  const userId = auth.phone;
  const isCreatingChatroom = ui.loading.chatroomCreate;

  const [newChatroomTitle, setNewChatroomTitle] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createFormError, setCreateFormError] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredChatrooms = chatrooms.list.filter(room =>
    room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleCreateChatroom = async () => {
    if (!newChatroomTitle.trim()) {
      setCreateFormError('Chatroom title cannot be empty.');
      return;
    }
    setCreateFormError('');
    dispatch({ type: 'ui/setLoading', payload: { chatroomCreate: true } });
    dispatch({ type: 'ui/addToast', payload: { message: 'Creating chatroom...', type: 'info' } });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRoom: Chatroom = {
      id: Date.now().toString(),
      title: newChatroomTitle.trim(),
      messages: [],
    };
    dispatch({ type: 'chatrooms/addChatroom', payload: newRoom });
    dispatch({ type: 'ui/addToast', payload: { message: `Chatroom '${newRoom.title}' created!`, type: 'success' } });
    setNewChatroomTitle('');
    setShowCreateModal(false);
    dispatch({ type: 'ui/setLoading', payload: { chatroomCreate: false } });
  };

  const handleDeleteChatroom = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete '${title}'?`)) {
      dispatch({ type: 'ui/addToast', payload: { message: `Deleting '${title}'...`, type: 'info' } });
      await new Promise(resolve => setTimeout(resolve, 800));
      dispatch({ type: 'chatrooms/deleteChatroom', payload: id });
      dispatch({ type: 'ui/addToast', payload: { message: `Chatroom '${title}' deleted.`, type: 'success' } });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    dispatch({ type: 'ui/addToast', payload: { message: 'Logged out successfully.', type: 'info' } });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">User ID: {userId}</span>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search chatrooms..."
            value={searchTerm}
            onChange={(e) => dispatch({ type: 'chatrooms/setSearchTerm', payload: e.target.value })}
            className="w-full sm:w-2/3 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Create New Chatroom
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChatrooms.length > 0 ? (
            filteredChatrooms.map((room: Chatroom) => (
              <div
                key={room.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
              >
                <span
                  onClick={() => onSelectChatroom(room.id)}
                  className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {room.title}
                </span>
                <button
                  onClick={() => handleDeleteChatroom(room.id, room.title)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                  aria-label={`Delete chatroom ${room.title}`}
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-slate-600 dark:text-slate-400">No chatrooms found. Create one!</p>
          )}
        </div>
      </div>

      {/* Create Chatroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create New Chatroom</h3>
            <input
              type="text"
              placeholder="Chatroom Title"
              value={newChatroomTitle}
              onChange={(e) => setNewChatroomTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            {createFormError && <p className="text-red-500 text-sm mb-4">{createFormError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChatroom}
                disabled={isCreatingChatroom}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCreatingChatroom ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-solid rounded-full border-r-transparent mr-2"></span>
                ) : ''}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;