import React from 'react'
import LoginForm from '../components/LoginForm.jsx'

const LoginPage = () => (
  <div className="login-page">
    <div className="login-container">
      <div className="logo-section">
        <img src="/logo.svg" alt="Логотип чата" />
      </div>
      <LoginForm />
    </div>
    <div className="login-footer">
      <div className="registration-link">
        <span>Нет аккаунта?</span>
        <a href="/register">Регистрация</a>
      </div>
    </div>
  </div>
)

export default LoginPage