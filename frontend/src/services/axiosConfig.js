import axios from 'axios';
import keycloak from '../auth/KeycloakService';

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        // If we have a token, add it to the request headers
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshed = await keycloak.updateToken(70);
                if (refreshed) {
                    // If token was refreshed, retry the original request
                    originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
                    return axios(originalRequest);
                }
            } catch (err) {
                // If refresh fails, redirect to login
                keycloak.login();
            }
        }

        return Promise.reject(error);
    }
);

export default axios; 