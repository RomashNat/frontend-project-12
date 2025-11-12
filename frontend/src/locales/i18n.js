import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      mainHeader: {
        hexletChat: 'Hexlet Chat',
        signOut: 'Выйти',
      },
      loginPage: {
        header: 'Войти',
        username: 'Ваш ник',
        password: 'Пароль',
        submit: 'Войти',
        success: 'Вход выполнен успешно',
        noSignUpWithLink: 'Нет аккаунта?',
        authError: 'Ошибка авторизации. Попробуйте еще раз.',
        errors: {
          loginError: 'Неверные имя пользователя или пароль',
        },
      },
      signup: {
        header: 'Регистрация',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        submit: 'Регистрация',
        feedbacks: {
          username: 'От 3 до 20 символов',
          password: 'Не менее 6 символов',
          confirmPassword: 'Пароли должны совпадать',
          uniqueUser: 'Такой пользователь уже существует',
          required: 'Обязательное поле',
          error: 'Ошибка при регистрации',
        },
      },
      notFoundPage: {
        title: 'Страница не найдена',
        toMainPage: 'Перейти на главную страницу',
        altText: 'Страница не найдена',
      },
      chat: {
        channels: 'Каналы',
        addChannelBtn: '+',
        noFoundChannel: 'Канал не найден',
        zeroMessages: 'Нет сообщений в этом канале',
        messagesCount_0: '{{count}} сообщение',
        messagesCount_1: '{{count}} сообщения',
        messagesCount_2: '{{count}} сообщений',
        channelMenu: {
          dropdownEl: 'Управление каналом',
          removeBtn: 'Удалить',
          renameBtn: 'Переименовать',
        },
        messageForm: {
          submit: 'Отправить',
          newMessage: 'Новое сообщение',
          placeholder: 'Введите сообщение...',
          formLabel: 'Форма отправки сообщения',
        },
      },
      modal: {
        error: {
          required: 'Обязательное поле',
          length: 'От 3 до 20 символов',
          notOneOf: 'Должно быть уникальным',
          profanity: 'Недопустимое название',
          channelExist: 'Канал создан',
        },
        addChannel: {
          title: 'Добавить канал',
          label: 'Имя канала',
          createBtn: 'Отправить',
          placeholder: 'Имя канала',
        },
        removeChannel: {
          title: 'Удалить канал',
          body: 'Уверены?',
          deleteBtn: 'Удалить',
        },
        renameChannel: {
          title: 'Переименовать канал',
          confirmBtn: 'Отправить',
          label: 'Имя канала',
          placeholder: 'Введите новое название канала',
        },
        confirmBtn: 'Отправить',
        cancelBtn: 'Отменить',
      },
      toast: {
        addChannel: 'Канал создан',
        removedChannel: 'Канал удалён',
        renamedChannel: 'Канал переименован',
        fetchError: 'Ошибка соединения',
        addChannelerror: 'Ошибка при создании канала',
        removeChannelerror: 'Ошибка при удалении канала',
        renameChannelerror: 'Ошибка при переименовании канала',
      },
      validation: {
        username: {
          required: 'Обязательное поле',
          min: 'От 3 до 20 символов',
          max: 'От 3 до 20 символов',
        },
        password: {
          required: 'Обязательное поле',
          min: 'Не менее 6 символов',
        },
        confirmPassword: {
          required: 'Обязательное поле',
          match: 'Пароли должны совпадать',
        },
        channelName: {
          required: 'Обязательное поле',
          length: 'От 3 до 20 символов',
          unique: 'Канал с таким именем уже существует',
          profanity: 'Недопустимое название',
        }
      },
      errors: {
        network: 'Ошибка соединения',
        unauthorized: 'Неверные имя пользователя или пароль',
        conflict: 'Такой пользователь уже существует',
        server: 'Ошибка сервера',
        unknown: 'Произошла ошибка',
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;