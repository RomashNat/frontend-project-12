import { io } from 'socket.io-client'

const socket = io('', {
  path: '/socket.io', //endpoint
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token'),
  },
})

// Функции для управления сокетом
export const connectSocket = () => {
  const token = localStorage.getItem('token');
  if (token && !socket.connected) {
    socket.auth.token = token;
    socket.connect();
  }
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
}

export const onNewMessage = (callback) => {
  socket.on('newMessage', callback);
}

export const removeMessageListener = () => {
  socket.off('newMessage');
}

export const joinChannel = (channelId) => {
  if (socket.connected) {
    socket.emit('joinChannel', channelId);
  }
}

export const leaveChannel = (channelId) => {
  if (socket.connected) {
    socket.emit('leaveChannel', channelId);
  }
}


export default socket;