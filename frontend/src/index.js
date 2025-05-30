import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { KeycloakProvider } from './auth/KeycloakProvider';
// Kept for compatibility but no longer does anything
import { setupAuthInterceptors } from './services/authInterceptor';

// Set up is kept for compatibility
setupAuthInterceptors();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <KeycloakProvider>
        <App />
    </KeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
