import { toast } from 'react-toastify';
import i18n from '../locales/i18n.js';

export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Специфичные для приложения уведомления
export const notify = {
  // Ошибки
  networkError: () => showError(i18n.t('toast.fetchError')),
  loadError: () => showError(i18n.t('toast.fetchError')),
  
  // Каналы
  channelAdded: () => showSuccess(i18n.t('toast.createdChannel')),
  channelRenamed: () => showSuccess(i18n.t('toast.renamedChannel')),
  channelRemoved: () => showSuccess(i18n.t('toast.removedChannel')),
  
  // Сообщения
  messageSent: () => showSuccess('Сообщение отправлено'),
  messageError: () => showError('Ошибка отправки сообщения'),
  
  // Аутентификация
  loginSuccess: () => showSuccess('Вход выполнен успешно'),
  signupSuccess: () => showSuccess('Регистрация выполнена успешно'),
  authError: (message) => showError(message),
};