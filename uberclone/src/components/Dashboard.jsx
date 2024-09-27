// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const token = localStorage.getItem('token'); // Get JWT from local storage
      const response = await fetch('/api/rides', {
        headers: {
          'Authorization': `Bearer ${token}`, // Send JWT for authorization
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRides(data.rides); // Set the fetched rides
      }
    };

    fetchRides();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Your Rides:</h3>
      {rides.length > 0 ? (
        <ul>
          {rides.map((ride, index) => (
            <li key={index}>{ride.pickup} to {ride.dropoff} - Fare: {ride.fare}</li>
          ))}
        </ul>
      ) : (
        <p>No rides found</p>
      )}
    </div>
  );
};

export default Dashboard;
