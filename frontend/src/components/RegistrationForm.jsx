import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Alert } from 'react-bootstrap'
import { signup } from '../store/slices/authSlice.jsx'
import { toast } from 'react-toastify'
import { registrationSchema } from '../validation/schemas.js'

const RegistrationForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.auth)

  const [isUsernameTaken, setUsernameTaken] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true)
    setUsernameTaken(false)
    setServerError('')

    const { username, password } = values

    try {
      const result = await dispatch(signup({
        username: username.trim(),
        password,
      })).unwrap()

      if (result && result.token) {
        toast.success('Регистрация выполнена успешно')
        resetForm()
        setTimeout(() => {
          navigate('/')
        }, 100)
      }
    }
    catch (error) { // Добавлен параметр error здесь
      setSubmitting(false) // Важно сбросить submitting при ошибке

      if (error?.status === 409) {
        setUsernameTaken(true)
      }
      else if (error?.status === 400) {
        setServerError('Некорректные данные для регистрации')
        toast.error('Некорректные данные для регистрации')
      }
      else if (error?.status === 500) {
        setServerError('Ошибка сервера. Попробуйте позже')
        toast.error('Ошибка сервера. Попробуйте позже')
      }
      else {
        setServerError('Произошла ошибка при регистрации')
        toast.error('Произошла ошибка при регистрации')
      }
    }
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={registrationSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ errors, touched, isSubmitting, handleBlur, handleChange }) => (
        <Form className="w-50 mx-auto">
          <h1 className="text-center mb-4">Регистрация</h1>

          {serverError && (
            <Alert variant="danger" className="mb-3">
              {serverError}
            </Alert>
          )}

          {/* Поле username */}
          <div className="form-floating mb-3">
            <Field
              type="text"
              name="username"
              autoComplete="username"
              required
              placeholder="От 3 до 20 символов"
              id="username"
              className={`form-control ${(errors.username && touched.username) || isUsernameTaken ? 'is-invalid' : ''}`}
              onBlur={(e) => {
                handleBlur(e)
                setUsernameTaken(false)
              }}
              onChange={(e) => {
                handleChange(e)
                if (isUsernameTaken) {
                  setUsernameTaken(false)
                }
              }}
            />
            <label htmlFor="username">Имя пользователя</label>

            <div className="invalid-feedback" style={{ display: 'block' }}>
              {(errors.username && touched.username) ? errors.username : ''}
            </div>
          </div>

          {/* Поле password */}
          <div className="form-floating mb-3">
            <Field
              type="password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="Не менее 6 символов"
              id="password"
              className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
            />
            <label htmlFor="password">Пароль</label>
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {errors.password ? errors.password : ''}
            </div>
          </div>

          {/* Поле confirmPassword - ВСЕ ошибки показываются здесь */}
          <div className="form-floating mb-4">
            <Field
              type="password"
              name="confirmPassword"
              autoComplete="off"
              required
              placeholder="Пароли должны совпадать"
              id="confirmPassword"
              className={`form-control ${
                ((errors.confirmPassword && touched.confirmPassword)
                  || (errors.username && touched.username)
                  || (errors.password && touched.password)
                  || isUsernameTaken)
                  ? 'is-invalid'
                  : ''
              }`}
            />
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {isUsernameTaken
                ? 'Такой пользователь уже существует'
                : (errors.confirmPassword && touched.confirmPassword)
                    ? errors.confirmPassword
                    : (errors.password && touched.password)
                        ? errors.password
                        : ''}
            </div>
          </div>

          <Button
            type="submit"
            variant="outline-primary"
            className="w-100"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default RegistrationForm
