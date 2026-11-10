
import React from 'react';

import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './auth/AuthContext';
import './styles/index.css';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
 
  <React.StrictMode>
    <BrowserRouter basename={routerBasename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
