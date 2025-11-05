import leoProfanity from 'leo-profanity';

leoProfanity.loadDictionary('ru');

leoProfanity.add(['плохоеслово']); // Добавить свои слова
leoProfanity.remove(['слово']); // Удалить слова из фильтра

// Основная функция фильтрации
export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  return leoProfanity.clean(text);
};

// Проверка на наличие нецензурных слов
export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return leoProfanity.check(text);
};

// Получить список нецензурных слов в тексте
export const getProfanityWords = (text) => {
  if (!text || typeof text !== 'string') return [];
  return leoProfanity.list(text);
};