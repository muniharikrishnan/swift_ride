import React, { useState } from 'react';
import '../css/taxi.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        license: '',
        vehicleNumber: '',
        vehicleType: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        fetch('http://127.0.0.1:5000/api/driver/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/login';
            } else {
                alert("Registration failed: " + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    const handleGoogleSignup = () => {
        window.location.href = 'http://127.0.0.1:5000/api/auth/google/driver';
    };

    return (
        <div className="container">
            <h1>Driver Registration</h1>
            <form id="register-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required onChange={handleChange} />
                
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required onChange={handleChange} />
                
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required onChange={handleChange} />
                
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirmPassword" required onChange={handleChange} />
                
                <label htmlFor="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" required onChange={handleChange} />
                
                <label htmlFor="license">License Number:</label>
                <input type="text" id="license" name="license" required onChange={handleChange} />
                
                <label htmlFor="vehicle-number">Vehicle Number:</label>
                <input type="text" id="vehicle-number" name="vehicleNumber" required onChange={handleChange} />
                
                <label htmlFor="vehicle-type">Vehicle Type:</label>
                <input type="text" id="vehicle-type" name="vehicleType" required onChange={handleChange} />
                
                <button type="submit">Register</button>
                <div id="google-signup">
                    <button type="button" id="google-signup-button" onClick={handleGoogleSignup}>Sign Up with Google</button>
                </div>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
}

export default Register;
