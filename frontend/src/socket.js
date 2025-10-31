import { io } from 'socket.io-client'

const socket = io('http://localhost:5001', {
  path: '/socket.io',
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

// Автоподключение если есть токен
if (localStorage.getItem('token')) {
  connectSocket();
}

export default socket;