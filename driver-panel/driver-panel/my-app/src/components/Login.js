import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/taxi.css';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission for traditional login
    const handleSubmit = (e) => {
        e.preventDefault();

        // Fetch request for traditional login
        fetch('http://localhost:5000/api/driver/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('token', data.token);  
                // Redirect to Dashboard upon successful login
                navigate('/dashboard');
            } else {
                alert("Login failed: " + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // Handle Google login redirect
    const handleGoogleLogin = () => {
        // Redirect the user to your backend for Google OAuth
        window.location.href = 'http://localhost:5000/api/auth/google/driver';
    };

    return (
        <div className="container">
            <h1>Driver Login</h1>
            <form id="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    onChange={handleChange}
                />
                
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                />
                
                <button type="submit">Login</button>
            </form>

            <div id="google-login">
                <button 
                    type="button" 
                    id="google-login-button" 
                    onClick={handleGoogleLogin}>
                    Login with Google
                </button>
            </div>
            
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
}

export default Login;
