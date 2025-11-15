import * as Yup from 'yup'

// Схема валидации для логина
export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .required('Обязательное поле')
    .min(3, 'Имя пользователя должно содержать минимум 3 символа'),
  password: Yup.string()
    .trim()
    .required('Обязательное поле'),
})

// Схема валидации для регистрации
export const registrationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string()
    .trim()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmPassword: Yup.string()
    .trim()
    .required('Обязательное поле')
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
})

// Схема валидации для каналов
export const channelSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
})

export default {
  loginSchema,
  registrationSchema,
  channelSchema,
}
