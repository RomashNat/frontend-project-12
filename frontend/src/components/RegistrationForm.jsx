import { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Alert } from 'react-bootstrap';
import { signup } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [isUsernameTaken, setUsernameTaken] = useState(false);
  const [serverError, setServerError] = useState('');

  const validationSchema = Yup.object().shape({
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
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    setUsernameTaken(false);
    setServerError('');

    const { username, password } = values;

    try {
    const result = await dispatch(signup({
      username: username.trim(),
      password
    })).unwrap();

    toast.success('Регистрация выполнена успешно');
    resetForm();
    
    navigate('/');
    
  } catch (error) {
    if (error?.status === 409) {
      setUsernameTaken(true);
      toast.error('Такой пользователь уже существует');
    } else if (error?.status === 400) {
      setServerError('Некорректные данные для регистрации');
      toast.error('Некорректные данные для регистрации');
    } else if (error?.status === 500) {
      setServerError('Ошибка сервера. Попробуйте позже');
      toast.error('Ошибка сервера. Попробуйте позже');
    } else {
      setServerError('Произошла ошибка при регистрации');
      toast.error('Произошла ошибка при регистрации');
    }
    console.error('Registration error:', error);
  }

  setSubmitting(false);
};

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, touched, isSubmitting, handleBlur, handleChange }) => (
        <Form className="w-50 mx-auto">
          <h1 className="text-center mb-4">Регистрация</h1>

          {serverError && (
            <Alert variant="danger" className="mb-3">
              {serverError}
            </Alert>
          )}

          <div className="form-floating mb-3">
            <Field
              type="text"
              name="username"
              autoComplete="username"
              required
              placeholder="От 3 до 20 символов"
              id="username"
              className={`form-control ${(errors.username && touched.username) || isUsernameTaken ? 'is-invalid' : ''
                }`}
              onBlur={(e) => {
                handleBlur(e);
                setUsernameTaken(false);
              }}
            />
            <label htmlFor="username">Имя пользователя</label>
            <div className="invalid-feedback">
              {isUsernameTaken
                ? 'Такой пользователь уже существует'
                : errors.username || ''
              }
            </div>
          </div>

          <div className="form-floating mb-3">
            <Field
              type="password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="Не менее 6 символов"
              id="password"
              className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''
                }`}
            />
            <label htmlFor="password">Пароль</label>
            <div className="invalid-feedback">
              {errors.password || ''}
            </div>
          </div>

          <div className="form-floating mb-4">
            <Field
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              placeholder="Пароли должны совпадать"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''
                }`}
            />
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <div className="invalid-feedback">
              {errors.confirmPassword || ''}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100 mb-3"
            disabled={isSubmitting || loading}
          >
            {(isSubmitting || loading) ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RegistrationForm;