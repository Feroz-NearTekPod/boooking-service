import { createContext, useContext, useState, useEffect } from 'react';
import keycloak from './KeycloakService';

const KeycloakContext = createContext();

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // Initialize Keycloak without automatic login
        keycloak.init({ onLoad: 'check-sso' }).then(auth => {
            setAuthenticated(auth);
        });
    }, []);

    const login = () => {
        keycloak.login();
    };

    return (
        <KeycloakContext.Provider value={{ keycloak, authenticated, login }}>
            {children}
        </KeycloakContext.Provider>
    );
};
