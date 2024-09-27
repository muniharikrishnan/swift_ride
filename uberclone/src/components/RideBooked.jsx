import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RideBooked.css';
import carToyVideo from '../assets/Car toy.mp4';
import driverImage from '../assets/driver.jpg';

const RideBooked = () => {
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, Math.floor(Math.random() * 2000) + 1000); // Random delay between 1 to 3 seconds
  }, []);

  const handleCancelRide = () => {
    setShowCancelOptions(true);
  };

  const handleCancellationReason = (reason) => {
    alert(`Ride cancelled due to: ${reason}`);
    setShowCancelOptions(false);
    navigate("/"); // Navigate back to the home or appropriate page
  };

  const handleTipSelection = (amount) => {
    alert(`You have selected a tip of ₹${amount}`);
  };

  return (
    <div className="ride-booked-container">
      {loading && (
        <div className="loading-overlay">
          <video autoPlay loop muted className="taxi-loading-animation">
            <source src={carToyVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>Booking your ride...</p>
        </div>
      )}
      {!loading && (
        <>
          <div className="map-section">
            <h1>Map Section (Map integration goes here)</h1>
          </div>
          <div className="ride-details">
            <h2>Your Ride is Booked!</h2><hr></hr>
            <div className="driver-otp">
              <div className="driver-details">
                <h3>Driver Details</h3>
                <img src={driverImage} alt="Driver" className="driver-photo" />
                <p>Name: John Doe</p>
                <p>Car: Toyota Prius</p>
                <p>License Plate: ABC-1234</p>
                <p>Payment Method: Cash</p>
                <p>Cost of Drive: ₹500.00</p>
                <p>Tip Options:</p>
                <div className="dropdown-ride">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="tipDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Select Tip
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="tipDropdown">
                    <li><button className="dropdown-item" onClick={() => handleTipSelection(50)}>₹50</button></li>
                    <li><button className="dropdown-item" onClick={() => handleTipSelection(100)}>₹100</button></li>
                    <li><button className="dropdown-item" onClick={() => handleTipSelection(200)}>₹200</button></li>
                  </ul>
                </div>
              </div>
              <div className="otp">
                <h3>Ride OTP</h3>
                <p>1234</p>
              </div>
            </div>
            <button className="btn btn-danger" onClick={handleCancelRide}>
              Cancel Ride
            </button>
            {showCancelOptions && (
              <div className="dropdown-ride">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="cancelDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  Select a reason for cancellation
                </button>
                <ul className="dropdown-menu" aria-labelledby="cancelDropdown">
                  <li><button className="dropdown-item" onClick={() => handleCancellationReason("Changed my mind")}>Changed my mind</button></li>
                  <li><button className="dropdown-item" onClick={() => handleCancellationReason("Driver taking too long")}>Driver taking too long</button></li>
                  <li><button className="dropdown-item" onClick={() => handleCancellationReason("Found another ride")}>Found another ride</button></li>
                  <li><button className="dropdown-item" onClick={() => handleCancellationReason("Driver demanded extra cash")}>Driver demanded extra cash</button></li>
                  <li><button className="dropdown-item" onClick={() => handleCancellationReason("Need to change location")}>Need to change location</button></li>
                  <li><button className="dropdown-item" onClick={() => handleCancellationReason("Other")}>Other</button></li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RideBooked;
