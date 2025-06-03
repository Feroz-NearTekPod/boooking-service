import { createContext, useContext, useState, useEffect } from 'react';
import keycloak from './KeycloakService';

const KeycloakContext = createContext();

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [showTwoFactorSettings, setShowTwoFactorSettings] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        // Initialize Keycloak without automatic login
        keycloak.init({ onLoad: 'check-sso' }).then(auth => {
            setAuthenticated(auth);
        });
    }, []);

    const login = () => {
        keycloak.login();
    };

    const logout = () => {
        keycloak.logout({ redirectUri: window.location.origin });
    };

    const toggleTwoFactorSettings = () => {
        setShowTwoFactorSettings(!showTwoFactorSettings);
    };

    const toggleTwoFactor = () => {
        if (!twoFactorEnabled) {
            window.location.href = 'http://localhost:8080/realms/HotelRealm/account/#/account-security/signing-in';
        } else {
            setTwoFactorEnabled(false);
        }
    };

    return (
        <KeycloakContext.Provider value={{
            keycloak,
            authenticated,
            login,
            logout,
            showTwoFactorSettings,
            toggleTwoFactorSettings,
            twoFactorEnabled,
            toggleTwoFactor
        }}>
            {children}
        </KeycloakContext.Provider>
    );
};
