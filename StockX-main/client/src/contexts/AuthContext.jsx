import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContextFile';

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [store, setStore] = useState(null); // Store the user's details

    // Simulate fetching user data from localStorage or an API
    useEffect(() => {
        const storedStoreEmail = localStorage.getItem('storeEmail');
        if (storedStoreEmail) {
            setStore({ email: storedStoreEmail });
        }
    }, []);

    // Login function
    const login = (email) => {
        setStore({ email });
        localStorage.setItem('storeEmail', email);
        localStorage.setItem('')
    };

    // Logout function
    const logout = () => {
        setStore(null);
        localStorage.removeItem('storeEmail');
    };

    return (
        <AuthContext.Provider value={{ store, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};