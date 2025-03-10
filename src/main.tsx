// main.tsx

// Styles
import './index.css';
// React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Components
import App from './App.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
