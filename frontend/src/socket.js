import { io } from 'socket.io-client'

let socket = null

export const connectSocket = () => {
  const token = localStorage.getItem('token')

  // Если нет токена, не подключаемся
  if (!token) {
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
    })

    socket.on('disconnect', (reason) => {
    })

    socket.on('connect_error', (error) => {
    })

    socket.on('error', (error) => {
    })

    return socket
  }
  catch (error) {
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
