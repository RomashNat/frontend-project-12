import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import { useDispatch } from 'react-redux';
import { login } from '../slices/authSlice.jsx';
import { Button, Alert } from 'react-bootstrap';
import socket from '../socket';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    try {
      const response = await axios.post(routes.loginPath(), values);
      const userData = response.data;

      // Сохраняем данные
      localStorage.setItem('token', userData.token);
      localStorage.setItem('username', values.username);

      // Обновляем токен в socket и подключаемся
      socket.auth.token = userData.token;
      socket.connect();

      // Диспатчим успешную авторизацию
      dispatch(login(userData));
      
      setStatus(null); // Очищаем ошибки
      navigate('/');

    } catch (error) {
      console.log(error.message);
      
      // Обработка ошибок авторизации
      if (error.response && error.response.status === 401) {
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginForm;