import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../styles/Auth.css';

const Unauthorized = () => {
    return (
        <div className="auth-container">
            <div className="auth-card unauthorized-card">
                <div className="unauthorized-icon">
                    <FaExclamationTriangle />
                </div>
                <h1>Access Denied</h1>
                <p>You don't have permission to access this page.</p>
                <Link to="/" className="auth-button">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
