import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUser, faWallet, faTag, faHeadset, faGear } from '@fortawesome/free-solid-svg-icons';
// import './styles.css'; // Add any custom styles if needed

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Swift Ride</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/my-trips">
                <FontAwesomeIcon icon={faCar} /> My Trips
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/account">
                <FontAwesomeIcon icon={faUser} /> Account
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/wallet">
                <FontAwesomeIcon icon={faWallet} /> Wallet
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/offers">
                <FontAwesomeIcon icon={faTag} /> Offers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">
                <FontAwesomeIcon icon={faHeadset} /> Support
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">
                <FontAwesomeIcon icon={faGear} /> Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
