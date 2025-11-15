import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage } from '../store/slices/messageSlice.jsx'
import { filterProfanity } from '../utils/wordsfilter.js'

const MessageForm = () => {
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()

  const { currentChannelId } = useSelector(state => state.channels)
  const username = useSelector(state =>
    state.auth?.username
    || state.auth?.user?.username
    || state.user?.username,
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    try {
      const filteredMessage = filterProfanity(message.trim())
      await dispatch(sendMessage({
        channelId: currentChannelId,
        body: filteredMessage,
        username: username,
      })).unwrap()
      setMessage('') // Очищаем поле после отправки
    }
    catch {
    }
  }

  return (
    <div className="mt-auto px-5 py-3">
      <form onSubmit={handleSubmit} className="py-1 border rounded-2">
        <div className="input-group">
          <input
            autoComplete="off"
            name="body"
            value={message}
            onChange={e => setMessage(e.target.value)}
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
            className="border-0 p-0 ps-2 form-control"
          />
          <button
            type="submit"
            className="btn btn-group-vertical"
            disabled={!message.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
            </svg>
            <span className="visually-hidden">Отправить</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm
