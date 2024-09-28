import React, { useState, useEffect } from 'react';
import '../styles//Dashboard.css'; // Ensure you import the CSS file

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const [user, setUser] = useState(null); // State for storing user details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndRides = async () => {
      const token = localStorage.getItem('token'); // Get JWT token from local storage

      if (!token) {
        setError('User not logged in');
        setLoading(false); // Stop loading
        return;
      }

      try {
        // Fetch user details
        const userResponse = await fetch('http://localhost:5001/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`, // Send JWT for authorization
          },
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.message || 'Failed to fetch user details');
        }
        setUser(userData); // Set the user details

        // Fetch user's rides
        const ridesResponse = await fetch('http://localhost:5001/api/rides', {
          headers: {
            'Authorization': `Bearer ${token}`, // Send JWT for authorization
          },
        });

        const ridesData = await ridesResponse.json();
        if (!ridesResponse.ok) {
          throw new Error(ridesData.message || 'Failed to fetch rides');
        }
        setRides(ridesData.rides); // Set the fetched rides
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };

    fetchUserAndRides();
  }, []);

  return (
    <div className="dashboard-body">
      <div className="dashboard-sidebar">
        <h1>Dashboard</h1>
        <nav>
          <ul>
            <li><a href="#overview" className="active">Overview</a></li>
            <li><a href="#rides">Your Rides</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
      </div>

      <div className="dashboard-main">
        <h2>User Dashboard</h2>

        {/* Display loading status */}
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            {/* Display error if any */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display user details */}
            {user ? (
              <section className="user-details">
                <h3>Welcome, {user.firstName} {user.lastName}!</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
              </section>
            ) : (
              <p>Failed to load user details.</p>
            )}

            {/* Display rides (if applicable) */}
            <section className="rides-section">
              <h3>Your Rides:</h3>
              <ul>
                {rides.length > 0 ? (
                  rides.map((ride, index) => (
                    <li key={index}>Ride ID: {ride.id}, Status: {ride.status}</li>
                  ))
                ) : (
                  <p>No rides found.</p>
                )}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
