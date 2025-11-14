import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Fetching channels with token:', token)

      if (!token) {
        console.log('No token found, using mock channels')
        return [
          { id: 1, name: 'general', removable: false },
          { id: 2, name: 'random', removable: false },
        ]
      }

      const response = await axios.get(routes.getChannelsPath(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('Channels response:', response.data)
      return response.data
    }
    catch (error) {
      console.error('Error fetching channels:', error)

      console.log('Returning mock channels due to error')
      return [
        { id: 1, name: 'general', removable: false },
        { id: 2, name: 'random', removable: false },
      ]
    }
  },
)

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(routes.channelsPath(), {
        name,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(routes.channelPath(id), {
        name,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(routes.channelPath(id), {
        headers: { Authorization: `Bearer ${token}` },
      })
      return id
    }
    catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload)
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload)
      if (state.currentChannelId === action.payload) {
        state.currentChannelId = 1
      }
    },
    updateChannel: (state, action) => {
      const channel = state.channels.find(ch => ch.id === action.payload.id)
      if (channel) {
        channel.name = action.payload.name
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false

        // Если каналов нет, создаем системные
        if (action.payload.length === 0) {
          console.log('Creating default system channels...')
          state.channels = [
            { id: 1, name: 'general', removable: false },
            { id: 2, name: 'random', removable: false },
          ]
        }
        else {
          state.channels = action.payload
        }

        // Устанавливаем текущий канал
        if (!state.currentChannelId && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        if (!state.currentChannelId && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id
        }
      })
      .addCase(createChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false
        state.channels.push(action.payload)
        state.currentChannelId = action.payload.id
        console.log('Channel added to state:', action.payload)
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        console.error('Channel creation failed in reducer:', action.payload)
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = state.channels.find(ch => ch.id === action.payload.id)
        if (channel) {
          channel.name = action.payload.name
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(channel => channel.id !== action.payload)
        if (state.currentChannelId === action.payload) {
          state.currentChannelId = 1
        }
      })
  },
})

export const { setCurrentChannel, addChannel, removeChannel, updateChannel } = channelsSlice.actions
export default channelsSlice.reducer
