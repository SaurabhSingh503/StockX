import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContextFile';

export const AuthProvider = ({ children }) => {
    const [store, setStore] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedStoreEmail = localStorage.getItem('storeEmail');
        if (storedStoreEmail) {
            setStore({ email: storedStoreEmail });
        } else {
            navigate('/auth'); // Redirect to /auth if no storeEmail
        }
    }, [navigate]);

    const login = (email) => {
        setStore({ email });
        localStorage.setItem('storeEmail', email);
        navigate('/'); // Redirect to home after login
    };

    const logout = () => {
        setStore(null);
        localStorage.removeItem('storeEmail');
        navigate('/auth'); // Redirect to auth after logout
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