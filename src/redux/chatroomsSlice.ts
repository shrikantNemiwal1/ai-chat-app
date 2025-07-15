// src/redux/chatroomsSlice.ts
import type { Chatroom, ChatroomsState, ChatroomsActions } from '../types';

const chatroomsReducer = (state: ChatroomsState, action: ChatroomsActions): ChatroomsState => {
  switch (action.type) {
    case 'chatrooms/addChatroom':
      return { ...state, list: [...state.list, action.payload] };
    case 'chatrooms/deleteChatroom':
      return { ...state, list: state.list.filter(room => room.id !== action.payload) };
    case 'chatrooms/selectChatroom':
      return { ...state, selectedChatroomId: action.payload };
    case 'chatrooms/setSearchTerm':
      return { ...state, searchTerm: action.payload };
    case 'chatrooms/addMessageToChatroom':
      return {
        ...state,
        list: state.list.map(room =>
          room.id === action.payload.chatroomId
            ? { ...room, messages: [...room.messages, action.payload.messageId] }
            : room
        ),
      };
    default:
      return state;
  }
};
export default chatroomsReducer;