import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Alert } from 'react-bootstrap';
import { login } from '../slices/authSlice.jsx';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  // Функция валидации для проверки полей
  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Обязательное поле';
    } else if (values.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа';
    }

    if (!values.password) {
      errors.password = 'Обязательное поле';
    } else if (values.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, setStatus, setErrors }) => {
    setSubmitting(true);
    setStatus(null);
    
    try {
      // Используем dispatch для логина
      const result = await dispatch(login({
        username: values.username.trim(),
        password: values.password
      })).unwrap();

      // Если логин успешен - редирект на чат
      if (result) {
        navigate('/');
      }
    } catch (error) {
      // Обработка ошибок авторизации
      if (error?.status === 401) {
        setStatus({ error: 'Неверные имя пользователя или пароль' });
        // Также можно подсветить поля
        setErrors({
          username: ' ',
          password: ' '
        });
      } else {
        setStatus({ error: 'Ошибка авторизации. Попробуйте еще раз.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div className="w-100">
        <Formik
          initialValues={{ username: "", password: "" }}
          validate={validate} // Добавляем валидацию
          onSubmit={handleSubmit}
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
                  autoComplete="username"
                  required
                  className={`form-control ${(touched.username && errors.username) ? 'is-invalid' : ''}`}
                />
                <label htmlFor="username">Ваш ник</label>
                {touched.username && errors.username && (
                  <div className='invalid-tooltip' style={{ display: 'block' }}>
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
                  autoComplete="current-password"
                  required
                  className={`form-control ${(touched.password && errors.password) ? 'is-invalid' : ''}`}
                />
                <label htmlFor="password">Пароль</label>
                {touched.password && errors.password && (
                  <div className='invalid-tooltip' style={{ display: 'block' }}>
                    {errors.password}
                  </div>
                )}
              </div>

              <Button 
                type='submit' 
                variant='outline-primary' 
                className="w-100 mb-3" 
                disabled={isSubmitting || loading}
              >
                {(isSubmitting || loading) ? 'Вход...' : 'Войти'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginForm;