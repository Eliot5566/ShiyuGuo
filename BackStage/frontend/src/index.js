import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HelmetProvider>
          <Routes>
            <Route path="/*" element={<App/>}/>
          </Routes>
        </HelmetProvider>
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
