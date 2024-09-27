import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUser, faWallet, faTag, faHeadset, faGear, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import MyTrips from './components/MyTrips';
import RideBooked from './components/RideBooked';
import Wallet from './components/Wallet';
import { Modal, Button } from 'react-bootstrap';

// Importing assets for vehicle images
import tukTukImage from './assets/TukTuk_Green_v1.png';
import uberGoImage from './assets/UberGo_v1.png';
import primeSUVImage from './assets/package_UberComfort_new_2022.png';
import bikeImage from './assets/Uber_Moto_India1.png';

// Initialize Socket.IO client
const socket = io('http://localhost:4000'); // Replace with your backend URL

// Load Google Maps script
const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMaps');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBj5sw5W0sZmVjeu6TrXa1SPaev957gThI&libraries=places`;
    script.id = 'googleMaps';
    script.async = true;
    script.defer = true;
    script.onload = () => callback();
    document.body.appendChild(script);
  } else {
    callback(); // Script already exists
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [rideVisible, setRideVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState('Auto'); // Default vehicle

  // Define available vehicle types
  const vehicleTypes = [
    { name: 'Auto', baseFare: 50, farePerKm: 10, image: tukTukImage },
    { name: 'Prime Sedan', baseFare: 70, farePerKm: 15, image: uberGoImage },
    { name: 'Prime SUV', baseFare: 100, farePerKm: 20, image: primeSUVImage },
    { name: 'Bike', baseFare: 30, farePerKm: 5, image: bikeImage },
  ];

  useEffect(() => {
    socket.on('rideUpdate', (message) => {
      setResponseMessage(message);
    });

    return () => {
      socket.off('rideUpdate');
    };
  }, []);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const mapOptions = {
              center: { lat: userLat, lng: userLng },
              zoom: 14,
            };

            const userMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);
            const directionsServiceInstance = new window.google.maps.DirectionsService();
            const directionsRendererInstance = new window.google.maps.DirectionsRenderer({ map: userMap });

            setMap(userMap);
            setDirectionsService(directionsServiceInstance);
            setDirectionsRenderer(directionsRendererInstance);

            new window.google.maps.places.Autocomplete(document.getElementById('pick'));
            new window.google.maps.places.Autocomplete(document.getElementById('drop'));

            new window.google.maps.Marker({
              position: { lat: userLat, lng: userLng },
              map: userMap,
              title: 'You are here!',
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              },
            });
          },
          (error) => {
            console.error('Error getting current location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    });
  }, []);

  const search = () => {
    setRideVisible(true);
  };

  const requestAuto = async () => {
    const pickup = document.getElementById('pick').value;
    const dropoff = document.getElementById('drop').value;

    if (directionsService && directionsRenderer) {
      const request = {
        origin: pickup,
        destination: dropoff,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, async (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          const calculatedDistance = result.routes[0].legs[0].distance.value / 1000; // in km
          setDistance(calculatedDistance);

          const calculatedFare = calculateFare(calculatedDistance);
          setFare(`₹ ${calculatedFare.toFixed(2)}`);

          const rideData = { pickup, dropoff, fare: calculatedFare, vehicle: selectedVehicle };

          try {
            const response = await fetch('/api/book_ride', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(rideData),
            });

            const data = await response.json();
            if (response.ok) {
              setResponseMessage(data.message || 'Ride requested successfully');
              socket.emit('newRideRequest', { pickup, dropoff });
              navigate('/ride-booked');
            } else {
              setResponseMessage('Error booking ride');
            }
          } catch (error) {
            setResponseMessage('Error booking ride');
          }
        } else {
          alert('Directions request failed: ' + status);
        }
      });
    }
  };

  const calculateFare = (distance) => {
    const selectedVehicleDetails = vehicleTypes.find(v => v.name === selectedVehicle);
    const baseFare = selectedVehicleDetails.baseFare;
    const farePerKm = selectedVehicleDetails.farePerKm;
    return baseFare + farePerKm * (distance - 1);
  };

  const handlePaymentClick = () => {
    setModalShow(true);
  };

  const PaymentModal = (props) => {
    return (
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Select a Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="payment-options">
            <a href="#">Credit Card</a>
            <a href="#">Net Banking</a>
            <a href="#">UPI</a>
            <a href="#">Cash</a>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="entire-body">
      <div className="row g-3">
        <div className="col-sm-3 r">
          <div className="container">
            <div className="container-text2">
              <h1>Book a Ride!</h1>
              <form>
                <div className="input-icon">
                  <div className="fa">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <input type="text" id="pick" name="pick" placeholder="Enter your pickup location" autoComplete="off" />
                </div>
                <div className="input-icon">
                  <div className="fa">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <input type="text" id="drop" name="drop" placeholder="Enter your drop location" autoComplete="off" />
                </div>
                <button type="button" className="btn btn-outline-warning" id="search-button" onClick={search}>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {rideVisible && (
          <div className="col-sm-4 r" id="ride">
            <div className="container-rides">
              <h2 style={{ marginBottom: '30px' }}>Choose a Ride</h2>
              {vehicleTypes.map((vehicle, index) => (
                <div className="vehicle" tabIndex="0" key={index} onClick={() => setSelectedVehicle(vehicle.name)}>
                  <img src={vehicle.image} alt={vehicle.name} />
                  <div className="details">
                    <h3>{vehicle.name}</h3>
                    <p>4 mins away</p>
                    <h5>No bargaining, doorstep pick-up</h5>
                  </div>
                  <h4>{vehicle.name === selectedVehicle ? fare || `₹${vehicle.baseFare}` : `₹${vehicle.baseFare}`}</h4>
                </div>
              ))}
              <div className="payment">
                <a href="#" onClick={handlePaymentClick}>
                  <FontAwesomeIcon icon={faWallet} /> Add Payment Method
                </a>
                <div className="req">
                  <button onClick={requestAuto}>Request {selectedVehicle}</button>
                  <p>{responseMessage}</p> {/* Show response message */}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-sm-5 map">
          <div id="map" style={{ height: '100%', width: '100%' }}></div> {/* Google Maps container */}
        </div>
      </div>

      <PaymentModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        <header className="header">
          <nav className="navbar">
            <Link to="/" className="logo">TAXI</Link>
            <Link to="/"><FontAwesomeIcon icon={faCar} style={{ color: '#f0b429' }} /> Ride</Link>
          </nav>
          <div className="navbar2">
            <Link to="/trips">My Trips</Link>
            <div className="dropdown">
              <button className="btn" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.75rem', color: '#f0b429' }} />
              </button>
              <div className="dropdown-content">
                <Link className="dropdown-item" to="/wallet"><FontAwesomeIcon icon={faWallet} /> Wallet</Link>
                <Link className="dropdown-item" to="/promos"><FontAwesomeIcon icon={faTag} /> Promos</Link>
                <Link className="dropdown-item" to="/account"><FontAwesomeIcon icon={faUser} /> Manage account</Link>
                <Link className="dropdown-item" to="/support"><FontAwesomeIcon icon={faHeadset} /> Support</Link>
                <Link className="dropdown-item" to="/settings"><FontAwesomeIcon icon={faGear} /> Settings</Link>
              </div>
            </div>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/ride-booked" element={<RideBooked />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;