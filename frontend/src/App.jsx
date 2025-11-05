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

const App = () => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
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

export default App;