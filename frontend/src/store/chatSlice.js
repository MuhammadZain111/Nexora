import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [], // list of chat threads: { userId, name, lastMessage, unreadCount }
  messages: {}, // keyed by conversationId/userId -> array of messages
  activeConversationId: null,
  onlineUsers: [], // array of userIds currently online
  isConnected: false,
  selectedChatData: null,
  chats: [],
  isLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConnected(state, action) {
      state.isConnected = action.payload;
    },

    selectedChatData(state, action) {
      state.selectedChatData = action.payload;
    },

    setSelectedChat(state, action) {
      state.selectedChatData = action.payload;
    },

    closeChat(state) {
      state.selectedChatData = null;
    },

    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },

    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
      // reset unread count when opening a conversation
      const convo = state.conversations.find(
        (c) => c.userId === action.payload,
      );
      if (convo) convo.unreadCount = 0;
    },

    setConversations(state, action) {
      state.conversations = action.payload;
    },

    setMessages(state, action) {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },

    // Add a single new message (incoming or outgoing)
    addMessage(state, action) {
      const message = action.payload;
      const conversationId = message.conversationId || message.senderId;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);

      // update conversation preview
      const convo = state.conversations.find(
        (c) => c.userId === conversationId,
      );
      if (convo) {
        convo.lastMessage = message.text;
        if (state.activeConversationId !== conversationId) {
          convo.unreadCount = (convo.unreadCount || 0) + 1;
        }
      }
    },

    // Optimistic UI: mark a locally-sent message as delivered/failed once server acks
    updateMessageStatus(state, action) {
      const { conversationId, tempId, status, realId } = action.payload;
      const thread = state.messages[conversationId];
      if (!thread) return;
      const msg = thread.find((m) => m.tempId === tempId);
      if (msg) {
        msg.status = status;
        if (realId) msg._id = realId;
      }
    },

    clearChat(state) {
      return initialState;
    },
  },
});

export const {
  setConnected,
  setOnlineUsers,
  setActiveConversation,
  setConversations,
  setMessages,
  addMessage,
  updateMessageStatus,
  clearChat,
  setSelectedChat,
  closeChat,
  setChats,
} = chatSlice.actions;

export default chatSlice.reducer;
