import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'

const LoginForm = () => {
  const initialValues = {
    username: '',
    password: '',
  }

  const validateForm = (values) => {
    const errors = {}

    if (!values.username) {
      errors.username = 'Обязательное поле'
    } else if (values.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа'
    }

    if (!values.password) {
      errors.password = 'Обязательное поле'
    } else if (values.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов'
    }

    return errors
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Форма отправлена:', values)
    setSubmitting(false)
  }

  return (
    <div className="login-form">
      <h1>Вход в чат</h1>
      <Formik
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Имя пользователя:</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Введите имя пользователя"
              />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Введите пароль"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginForm