import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
 // Create a separate CSS file for styling
 import '../styles/Account.css';
const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from your API or context (dummy data for now)
    const fetchUserData = async () => {
      // Replace this with your API call
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1234567890',
      };
      setUser(userData);
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Handle logout logic (e.g., clearing tokens, redirecting, etc.)
    // For now, just navigating to the home page
    navigate('/');
  };

  return (
    <div className="account-container">
      <h1>Manage Account</h1>
      {user ? (
        <div className="user-details">
          <div className="detail">
            <FontAwesomeIcon icon={faUser} /> <strong>Name:</strong> {user.name}
          </div>
          <div className="detail">
            <FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {user.email}
          </div>
          <div className="detail">
            <FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong> {user.phone}
          </div>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
      <div className="logout">
        <button onClick={handleLogout} className="btn btn-danger">
          <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Account;
