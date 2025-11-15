import { hasProfanity, filterProfanity } from '../utils/wordsfilter.js'

// Валидатор для имени канала
export const validateChannelName = (name, channels, currentChannelId = null) => {
  if (!name || name.trim() === '') {
    return 'Обязательное поле'
  }

  const trimmedName = name.trim()
  
  if (trimmedName.length < 3 || trimmedName.length > 20) {
    return 'От 3 до 20 символов'
  }
  
  const isNameUnique = !channels.some(ch =>
    ch.id !== currentChannelId && ch.name.toLowerCase() === trimmedName.toLowerCase()
  )
  
  if (!isNameUnique) {
    return 'Канал с таким именем уже существует'
  }
  
  if (hasProfanity(trimmedName)) {
    return 'Недопустимое название'
  }
  
  return null
}

// Валидатор для создания канала (с цензурой)
export const validateChannelNameForCreation = (name, channels) => {
  if (!name || name.trim() === '') {
    return 'Обязательное поле'
  }

  const trimmedName = name.trim()
  
  if (trimmedName.length < 3 || trimmedName.length > 20) {
    return 'От 3 до 20 символов'
  }
  
  const censoredName = filterProfanity(trimmedName)
  const isNameUnique = !channels.some(channel =>
    channel.name.toLowerCase() === censoredName.toLowerCase()
  )

  if (!isNameUnique) {
    return 'Канал с таким именем уже существует'
  }
  
  return null
}

// Валидатор для сообщений
export const validateMessage = (message) => {
  if (!message || message.trim() === '') {
    return 'Сообщение не может быть пустым'
  }
  
  return null
}
