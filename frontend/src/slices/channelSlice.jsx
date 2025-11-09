import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(routes.getChannelsPath(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(routes.channelsPath(), {
        name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(routes.channelPath(id), {
        name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(routes.channelPath(id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannelId: 1,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload);
      if (state.currentChannelId === action.payload) {
        state.currentChannelId = 1;
      }
    },
    updateChannel: (state, action) => {
      const channel = state.channels.find(ch => ch.id === action.payload.id);
      if (channel) {
        channel.name = action.payload.name;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        а
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
        state.currentChannelId = action.payload.id; // Переходим в новый канал
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = state.channels.find(ch => ch.id === action.payload.id);
        if (channel) {
          channel.name = action.payload.name;
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(channel => channel.id !== action.payload);
        if (state.currentChannelId === action.payload) {
          state.currentChannelId = 1;
        }
      });
  }
});

export const { setCurrentChannel, addChannel, removeChannel, updateChannel } = channelsSlice.actions;
export default channelsSlice.reducer;