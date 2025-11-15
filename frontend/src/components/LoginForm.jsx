import { Formik, Form, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Alert } from 'react-bootstrap'
import { login } from '../store/slices/authSlice.jsx'
import { toast } from 'react-toastify'
import { loginSchema } from '../validation/schemas'

const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.auth)

  const handleSubmit = async (values, { setSubmitting, setStatus, setErrors }) => {
    setSubmitting(true)
    setStatus(null)

    try {
      // Используем dispatch для логина
      const result = await dispatch(login({
        username: values.username.trim(),
        password: values.password,
      })).unwrap()

      toast.success('Вход выполнен успешно')

      // Если логин успешен - редирект на чат
      if (result) {
        navigate('/')
      }
    }
    catch (error) {
      // Обработка ошибок авторизации
      if (error?.status === 401) {
        setStatus({ error: 'Неверные имя пользователя или пароль' })
        // Также можно подсветить поля
        setErrors({
          username: ' ',
          password: ' ',
        })
      }
      else {
        setStatus({ error: 'Ошибка авторизации. Попробуйте еще раз.' })
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div className="w-100">
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema} // Добавляем валидацию
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting, errors, touched, status }) => (
            <Form className="col-12">
              <h1 className="text-center mb-4">Войти</h1>

              {/* Общее сообщение об ошибке авторизации */}
              {status?.error && (
                <Alert variant="danger" className="mb-3">
                  {status.error}
                </Alert>
              )}

              {/* Поле для имени пользователя */}
              <div className="form-floating mb-3">
                <Field
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Введите имя пользователя"
                  autoComplete="off"
                  required
                  className={`form-control ${(touched.username && errors.username) ? 'is-invalid' : ''}`}
                />
                <label htmlFor="username">Ваш ник</label>
                {touched.username && errors.username && (
                  <div className="invalid-tooltip" style={{ display: 'block' }}>
                    {errors.username}
                  </div>
                )}
              </div>

              {/* Поле для пароля */}
              <div className="form-floating mb-4">
                <Field
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Введите пароль"
                  autoComplete="off"
                  required
                  className={`form-control ${(touched.password && errors.password) ? 'is-invalid' : ''}`}
                />
                <label htmlFor="password">Пароль</label>
                {touched.password && errors.password && (
                  <div className="invalid-tooltip" style={{ display: 'block' }}>
                    {errors.password}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="outline-primary"
                className="w-100 mb-3"
                disabled={isSubmitting || loading}
              >
                Войти
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default LoginForm
