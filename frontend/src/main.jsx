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
  accessToken: '1ff37332534165f6cec4795f8ce4708a', 
  environment: 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
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

createRoot(document.getElementById('chat')).render(<RootApp />);