import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // 1. Importe o BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolva o <App /> com ele */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);