from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)
CORS(app)  # To handle cross-origin requests

# Configure the PostgreSQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456srikrishna$@localhost:5432/userpanel'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a strong secret key
jwt = JWTManager(app)

db = SQLAlchemy(app)

# Define the User model corresponding to the 'user_details' table
class User(db.Model):
    __tablename__ = 'user_details'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(15), nullable=False)
    password = db.Column(db.Text, nullable=False)  # Storing passwords in plain text
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create API endpoint for signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    # Validate that all fields are provided
    if not all([first_name, last_name, email, phone, password]):
        return jsonify({'message': 'Missing required fields'}), 400

    # Check if the user already exists (by email or phone)
    if User.query.filter((User.email == email) | (User.phone == phone)).first():
        return jsonify({'message': 'User already exists'}), 400

    # Create a new user and add to the session
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        password=password  # Store plain text password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create user', 'error': str(e)}), 500

# API endpoint for login (authentication)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = User.query.filter_by(email=email).first()

    # Verify the password (plain text comparison)
    if user and user.password == password:
        # Create a JWT token for the user
        access_token = create_access_token(identity=user.id)
        return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Get user details (protected by JWT)
@app.route('/api/user', methods=['GET'])
@jwt_required()  # Ensure this route requires a valid JWT token
def get_user_details():
    current_user_id = get_jwt_identity()  # Get the user ID from the token
    user = User.query.get(current_user_id)

    if user:
        return jsonify({
            'firstName': user.first_name,
            'lastName': user.last_name,
            'email': user.email,
            'phone': user.phone
        }), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Ensure tables are created
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Run the server on port 5001
