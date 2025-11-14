import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('en')

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text
  return leoProfanity.clean(text)
}

export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false
  return leoProfanity.check(text)
}
