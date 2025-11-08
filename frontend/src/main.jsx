import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import '../src/locales/i18n.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'

const rollbarConfig = {
  accessToken: '003ec1cf709c4e9e829967984a83a14d083ed8e7e7ba3bdf7eb4fe8d9ef81db12cf7a52dfb725dc894959e944365299c', 
  environment: 'production',
};

const RootApp = () => (
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>
    </ErrorBoundary>
  </RollbarProvider>
);

const container = document.getElementById('chat');
const root = createRoot(container);
root.render(<RootApp />);