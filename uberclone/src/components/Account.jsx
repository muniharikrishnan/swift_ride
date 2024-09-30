import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
    // Handle logout logic (e.g., clearing tokens)
    // For now, just navigating to the signup page
    navigate('/signup'); // Redirect to signup page
  };

  return (
    <div className="account-container">
      <h1>Manage Account</h1>
      {user ? (
        <div className="account-options">
          <div className="option">
            <Link to="/dashboard" className="btn btn-primary">
              <FontAwesomeIcon icon={faUser} /> View Profile
            </Link>
          </div>
          <div className="option">
            <button onClick={handleLogout} className="btn btn-danger">
              <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
            </button>
          </div>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default Account;
