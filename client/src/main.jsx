import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
