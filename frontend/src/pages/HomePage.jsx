import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Добро пожаловать в чат!</h1>
      <p>Для доступа необходимо авторизоваться</p>
      <Link to="/login" className="login-link">
        Войти
      </Link>
    </div>
  );
};

export default HomePage;