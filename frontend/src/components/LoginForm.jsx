import React from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../slices/authSlice';
import socket from '../socket';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Отправка данных для авторизации
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();

      // Сохраняем данные
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', values.username);

      // Обновляем токен в socket и подключаемся
      socket.auth.token = data.token;
      socket.connect();

      // Диспатчим успешную авторизацию
      dispatch(login({
        token: data.token,
        username: values.username,
      }));

      // Редирект на чат
      navigate('/chat');

    } catch (error) {
      setStatus({ error: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          <Card style={{ width: '400px' }}>
            <Card.Body>
              <Card.Title className="text-center mb-4">Вход в чат</Card.Title>
              
              <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  status
                }) => (
                  <Form onSubmit={handleSubmit}>
                    {/* Показ ошибок */}
                    {status?.error && (
                      <Alert variant="danger" className="mb-3">
                        {status.error}
                      </Alert>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Имя пользователя</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="username"
                        placeholder="Введите имя пользователя"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.username && errors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control 
                        type="password" 
                        name="password"
                        placeholder="Введите пароль"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Вход...' : 'Войти'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;