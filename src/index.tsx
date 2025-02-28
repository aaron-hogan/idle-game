import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './state/store';
import App from './components/App';
import './styles/index.css';
import './styles/progression.css';

// Import initializers
import { initializeDebugTools } from './debug';
import { initializeEventSystem } from './systems/eventInitializer';
import { initializeProgression } from './data/progression/initializeProgression';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Initialize game systems after render
setTimeout(() => {
  // Initialize debug tools
  initializeDebugTools();

  // Initialize event system
  initializeEventSystem();

  // Initialize progression system
  initializeProgression();

  console.log('All game systems initialized');
}, 1000);
