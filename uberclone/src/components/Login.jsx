import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password) {
      setError('Please fill in all the fields.');
      return;
    }

    const userDetails = { email, password };

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        const data = await response.json();
        // Save token in localStorage
        localStorage.setItem('token', data.access_token); // Store token in localStorage
        navigate('/dashboard'); // Redirect to dashboard after successful login
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to login. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>

      <p className="no-account">
        Don't have an account?{' '}
        <Link to="/signup" className="signup-link">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
