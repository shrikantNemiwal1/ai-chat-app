// src/redux/messagesSlice.ts
import type { Message, MessagesState, MessagesActions } from '../types';

const messagesReducer = (state: MessagesState, action: MessagesActions): MessagesState => {
  switch (action.type) {
    case 'messages/addMessage':
      const { chatroomId, message } = action.payload;
      return {
        ...state,
        [chatroomId]: [...(state[chatroomId] || []), message],
      };
    case 'messages/prependMessages':
      const { chatroomId: prependChatroomId, messages: newMessages } = action.payload;
      return {
        ...state,
        [prependChatroomId]: [...newMessages, ...(state[prependChatroomId] || [])],
      };
    case 'messages/clearMessages':
      // This action clears all messages from the state for simplicity on chatroom exit
      return {};
    default:
      return state;
  }
};
export default messagesReducer;