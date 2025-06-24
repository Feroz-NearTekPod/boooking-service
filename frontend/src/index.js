import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { KeycloakProvider } from './auth/KeycloakProvider';
import './services/axiosConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <KeycloakProvider>
        <App />
    </KeycloakProvider>
);
