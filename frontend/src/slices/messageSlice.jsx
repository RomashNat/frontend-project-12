import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';
import { removeMessageListener, connectSocket, joinChannel, leaveChannel } from '../socket';
import { filterProfanity } from '../utils/wordsfilter.js';


export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(routes.messagesPath(), {
        headers: { Authorization: `Bearer ${token}` }
      });
            const filteredMessages = response.data.map(message => ({
        ...message,
        body: filterProfanity(message.body)
      }));
      
      return filteredMessages;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, body, username }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
        const filteredBody = filterProfanity(body);
      const response = await axios.post(routes.addMessagePath(), {
        channelId,
        body: filteredBody,
        username
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Чистим сообщение от двоеточия если оно есть
      const cleanMessage = {
        ...response.data,
        body: response.data.body.startsWith(': ') ? response.data.body.slice(2) : response.data.body
      };

      return cleanMessage;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
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
      const filteredMessage = {
          ...action.payload,
          body: filterProfanity(action.payload.body)
        };
        state.messages.push(filteredMessage);
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
        state.messages = action.payload; // Уже отфильтрованные сообщения
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Сообщение уже пришло через WebSocket, но на всякий случай проверяем
        const existingMessage = state.messages.find(msg => msg.id === action.payload.id);
        if (!existingMessage) {
          // Фильтруем сообщение еще раз для надежности
          const filteredMessage = {
            ...action.payload,
            body: filterProfanity(action.payload.body)
          };
          state.messages.push(filteredMessage);
        }
      });
  }
});

export const { addMessage, removeChannelMessages, initSocket, removeSocket, joinChannelSocket, leaveChannelSocket } = messagesSlice.actions;
export default messagesSlice.reducer;