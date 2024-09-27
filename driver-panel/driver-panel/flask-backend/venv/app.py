# Import necessary libraries
from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import os
import requests
from requests_oauthlib import OAuth2Session
import json

# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456srikrishna$@localhost:5432/taxi'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with a secure secret key for JWT encoding

# Google OAuth configuration


# Initialize SQLAlchemy
db = SQLAlchemy(app)
# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Define User and Driver models
class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())

class Driver(db.Model):
    __tablename__ = 'drivers'
    driver_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    license_number = db.Column(db.String(50), nullable=False)
    vehicle_number = db.Column(db.String(50), nullable=False)
    vehicle_type = db.Column(db.String(50), nullable=False)

    user = db.relationship('User', backref=db.backref('driver', uselist=False))

# Login endpoint
@app.route('/api/driver/login', methods=['POST'])
def login_driver():
    try:
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        # Query user by username
        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            # Generate JWT token
            token = jwt.encode({'user_id': user.user_id}, app.config['SECRET_KEY'], algorithm='HS256')
            return jsonify({'success': True, 'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Registration endpoint
@app.route('/api/driver/register', methods=['POST'])
def register_driver():
    data = request.get_json()

    # Extract data from JSON request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    license = data.get('license')
    vehicle_number = data.get('vehicleNumber')
    vehicle_type = data.get('vehicleType')

    # Validate input data
    if not username or not email or not password or not phone or not license or not vehicle_number or not vehicle_type:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create new User and Driver objects
    new_user = User(username=username, email=email, password=hashed_password, phone=phone)
    new_driver = Driver(license_number=license, vehicle_number=vehicle_number, vehicle_type=vehicle_type)

    try:
        # Add new User and Driver to the database
        db.session.add(new_user)
        db.session.commit()

        # Assign user_id to the driver
        new_driver.user_id = new_user.user_id

        # Add new Driver to the database
        db.session.add(new_driver)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Registration successful'}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Registration failed: Email already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500

# Google Sign-In endpoints
@app.route('/api/auth/google/driver', methods=['GET'])
def google_login():
    google_client_id = app.config['GOOGLE_CLIENT_ID']
    google_client_secret = app.config['GOOGLE_CLIENT_SECRET']
    google_discovery_url = app.config['GOOGLE_DISCOVERY_URL'] 

    # Discover the OAuth 2.0 authorization endpoint
    discovery_response = requests.get(google_discovery_url)
    discovery_data = discovery_response.json()
    authorization_endpoint = discovery_data['authorization_endpoint']
    
    # Create an OAuth2Session instance
    oauth = OAuth2Session(
        client_id=google_client_id,
        redirect_uri=url_for('google_callback', _external=True),
        scope=['openid', 'email', 'profile']
    )

    # Generate the authorization URL
    authorization_url, state = oauth.authorization_url(authorization_endpoint)

    return redirect(authorization_url)

@app.route('/api/auth/google/driver/callback', methods=['GET'])
def google_callback():
    google_client_id = app.config['GOOGLE_CLIENT_ID']
    google_client_secret = app.config['GOOGLE_CLIENT_SECRET']
    google_discovery_url = app.config['GOOGLE_DISCOVERY_URL']

    # Discover the OAuth 2.0 token endpoint
    discovery_response = requests.get(google_discovery_url)
    discovery_data = discovery_response.json()
    token_endpoint = discovery_data['token_endpoint']
    user_info_endpoint = discovery_data['userinfo_endpoint']

    # Create an OAuth2Session instance
    oauth = OAuth2Session(
        client_id=google_client_id,
        redirect_uri=url_for('google_callback', _external=True),
        scope=['openid', 'email', 'profile']
    )

    # Fetch the authorization response
    token = oauth.fetch_token(
        token_endpoint,
        client_secret=google_client_secret,
        authorization_response=request.url
    )

    user_info = oauth.get(user_info_endpoint).json()

    email = user_info.get('email')
    username = user_info.get('name')

    user = User.query.filter_by(email=email).first()
    if not user:
        # Register user if not exists
        user = User(username=username, email=email, password='', phone='', created_at=None)
        db.session.add(user)
        db.session.commit()

    token = jwt.encode({'user_id': user.user_id}, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'success': True, 'message': 'Login successful', 'token': token}), 200

# Dashboard endpoint
@app.route('/api/driver/dashboard', methods=['GET'])
def driver_dashboard():
    try:
        token = request.headers.get('Authorization').split()[1]  # Extract token from Authorization header
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
        
        # Query driver details based on user_id from JWT
        driver = Driver.query.filter_by(user_id=user_id).first()

        if not driver:
            return jsonify({'success': False, 'message': 'Driver not found'}), 404
        
        # Dashboard summary data
        dashboard_summary = {
            'driver_name': driver.user.username,
            'license_number': driver.license_number,
            'vehicle_number': driver.vehicle_number,
            'vehicle_type': driver.vehicle_type,
            'today_earnings': 0.0,  # Replace with actual logic to calculate earnings for today
            'earnings_history': [],  # Replace with actual logic to fetch earnings history
            'wallet_earnings': 0.0,  # Replace with actual logic to calculate wallet earnings
            'completed_rides': 0,  # Replace with actual logic to count completed rides
            'help_and_support': 'Contact support@example.com for assistance'
        }

        return jsonify({'success': True, 'data': dashboard_summary}), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# New endpoint to fetch driver data and store in files
@app.route('/api/driver/data', methods=['GET'])
def fetch_driver_data():
    try:
        # Fetch driver details from the database
        drivers = Driver.query.all()

        drivers_data = []
        drivers_history_data = []

        # Extract relevant information for drivers
        for driver in drivers:
            drivers_data.append({
                'driver_id': driver.driver_id,
                'license_number': driver.license_number,
                'vehicle_number': driver.vehicle_number,
                'vehicle_type': driver.vehicle_type,
            })

            # Example historical data for drivers; replace with actual logic if needed
            drivers_history_data.append({
                'driver_id': driver.driver_id,
                'date': '2024-09-01',
                'earnings': 100.00,
            })

        # Return driver data in the response
        return jsonify({
            'success': True,
            'drivers': drivers_data,
            'drivers_history': drivers_history_data
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# Run the application
if __name__ == '__main__':
    app.run(debug=True)
