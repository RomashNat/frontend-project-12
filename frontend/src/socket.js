import { io } from 'socket.io-client'

let socket = null

export const connectSocket = () => {
  const token = localStorage.getItem('token')

  // Если нет токена, не подключаемся
  if (!token) {
    console.log('No token available for socket connection')
    return null
  }

  // Если сокет уже существует, отключаем его
  if (socket) {
    socket.disconnect()
    socket = null
  }

  try {
    socket = io('', {
      path: '/socket.io',
      autoConnect: true,
      auth: {
        token: token,
      },
    })

    // Добавьте обработчики событий для отладки
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    return socket
  }
  catch (error) {
    console.error('Failed to create socket connection:', error)
    return null
  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const onNewMessage = (callback) => {
  if (socket) {
    socket.on('newMessage', callback)
  }
  else {
    console.warn('Socket not available for message listener')
  }
}

export const removeMessageListener = () => {
  if (socket) {
    socket.off('newMessage')
  }
}

export const joinChannel = (channelId) => {
  if (socket && socket.connected) {
    socket.emit('joinChannel', channelId)
  }
}

export const leaveChannel = (channelId) => {
  if (socket && socket.connected) {
    socket.emit('leaveChannel', channelId)
  }
}

// Получить текущий сокет
export const getSocket = () => {
  return socket
}

// Проверить, подключен ли сокет
export const isSocketConnected = () => {
  return socket && socket.connected
}
