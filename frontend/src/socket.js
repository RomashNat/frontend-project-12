import { io } from 'socket.io-client'

const socket = io('http://localhost:5001', {
  path: '/socket.io',
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token'),
  },
})

if (localStorage.getItem('token')) {
  socket.connect()
}

export default socket