import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// Create a root container
const root = createRoot(document.getElementById('root'));

// Render the components inside a flex container
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);