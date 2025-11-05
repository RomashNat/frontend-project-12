import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';
import { removeMessageListener, connectSocket, joinChannel, leaveChannel } from '../socket';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(routes.messagesPath(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, body }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(routes.addMessagePath(), {
      channelId,
      body
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Чистим сообщение от двоеточия если оно есть
    const cleanMessage = {
      ...response.data,
      body: response.data.body.startsWith(': ') ? response.data.body.slice(2) : response.data.body
    };

    return cleanMessage;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      // Проверяем, нет ли уже такого сообщения
      const existingMessage = state.messages.find(msg => msg.id === action.payload.id);
      if (!existingMessage) {
        state.messages.push(action.payload);
      }
    },
    removeChannelMessages: (state, action) => {
      state.messages = state.messages.filter(message => message.channelId !== action.payload);
    },
    // Новые экшены для WebSocket
    initSocket: (state) => {
      // Подключаем сокет
      connectSocket();
    },
    removeSocket: () => {
      removeMessageListener();
    },
    joinChannelSocket: (state, action) => {
      joinChannel(action.payload);
    },
    leaveChannelSocket: (state, action) => {
      leaveChannel(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Сообщение уже пришло через WebSocket, но на всякий случай проверяем
        const existingMessage = state.messages.find(msg => msg.id === action.payload.id);
        if (!existingMessage) {
          state.messages.push(action.payload);
        }
      });
  }
});

export const { addMessage, removeChannelMessages, initSocket, removeSocket, joinChannelSocket, leaveChannelSocket } = messagesSlice.actions;
export default messagesSlice.reducer;