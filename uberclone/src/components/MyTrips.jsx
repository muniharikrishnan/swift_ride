import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/MyTrips.css';
import taxiBg from '../assets/taxibg.jpg';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');

    // Fetch trips from MongoDB when the component mounts
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve JWT token
                if (!token) {
                    setError('You must be logged in to view your trips.');
                    return;
                }

                const response = await fetch('/api/user/trips', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the token in the request headers
                    },
                });

                if (response.ok) {
                    const tripsData = await response.json();
                    setTrips(tripsData);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch trips');
                }
            } catch (error) {
                console.error('Error fetching trips:', error);
                setError('An error occurred while fetching your trips.');
            }
        };

        fetchTrips();
    }, []);

    return (
        <div>
            <div className="trips-body" style={{ marginTop: '20px' }}>
                <div className="row g-3">
                    <div className="col-sm-2">
                        <div className="container-trips">
                            <Link to="/tax">Tax profile</Link>
                        </div>
                    </div>
                    <div className="col-sm-7">
                        <div className="history">
                            <div className="card">
                                {error && <p className="card-text text-danger">{error}</p>}
                                {trips.length > 0 ? (
                                    trips.map((trip, index) => (
                                        <div key={index} className="card-body">
                                            <h5 className="card-title">Trip #{index + 1}</h5>
                                            <p className="card-text">From: {trip.from}</p>
                                            <p className="card-text">To: {trip.to}</p>
                                            <p className="card-text">Fare: ₹{trip.fare}</p>
                                            <p className="card-text">Distance: {trip.distance} km</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="card-text">You have not taken any rides yet, take your first ride</p>
                                )}
                                <Link to="/" id="book">Book Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card">
                            <img src={taxiBg} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5>Get a ride in minutes</h5>
                                <p className="card-text">Book a Taxi from a web browser, no app install necessary.</p>
                                <Link to="/" id="book">Request a ride now!</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
