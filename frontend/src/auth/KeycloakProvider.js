import { createContext, useContext, useState, useEffect } from 'react';
import keycloak from './KeycloakService';

const KeycloakContext = createContext();

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        keycloak.init({ onLoad: 'login-required' }).then(auth => {
            setAuthenticated(auth);
        });
    }, []);

    return (
        <KeycloakContext.Provider value={{ keycloak, authenticated }}>
            {children}
        </KeycloakContext.Provider>
    );
};
