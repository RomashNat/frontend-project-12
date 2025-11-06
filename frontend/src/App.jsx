import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import store from './store.js';
import i18n from './locales/i18n.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import RegistrationPage from './pages/RegistrationPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/ProtectedRoute';
import { useRollbar } from '@rollbar/react';
import { useEffect } from 'react';

const App = () => {
  const rollbar = useRollbar();

  useEffect(() => {
    // Логируем запуск приложения
    rollbar.info('Приложение запущено', {
      environment: process.env.NODE_ENV,
      path: window.location.pathname
    });
  }, [rollbar]);

  // Функция для тестирования Rollbar
  const testRollbar = () => {
    try {
      throw new Error('Тестовая ошибка для проверки Rollbar!');
    } catch (error) {
      rollbar.error('Тест ошибки из App компонента', error, {
        component: 'App',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {/* Кнопка для тестирования Rollbar */}
          <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            zIndex: 10000 
          }}>
            <button 
              onClick={testRollbar}
              className="btn btn-warning btn-sm"
              style={{ fontSize: '12px', padding: '2px 6px' }}
            >
              Test Rollbar
            </button>
          </div>
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegistrationPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

export default App;