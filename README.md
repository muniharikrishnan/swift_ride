🚕 Swift Ride - Online Taxi Service App
Swift Ride is a dynamic and feature-rich online taxi service application that provides seamless booking services for passengers while offering an intuitive platform for drivers and administrators. Built with modern web technologies, this project is powered by React.js for the front-end interface, Flask as the back-end framework, and PostgreSQL for database management.

🚀 Features
For Passengers (User Panel)
User Registration and Authentication: Sign up and log in securely using your credentials.
Taxi Booking: Easily book taxis by selecting pickup and drop-off locations.
Real-time Notifications: Get notifications on booking status and driver availability.
Fare Estimation: View estimated fare based on distance and ride type.
Ride History: Access your previous rides and track completed trips.

For Drivers (Driver Panel)
Driver Registration and Authentication: Sign up to drive and log in to manage rides.
Ride Requests: View and accept ride requests in real-time.
Trip Management: Update trip status (e.g., en route, arrived, trip completed).
Earnings Dashboard: View daily, weekly, and monthly earnings, including ride details.

For Admin (Admin Panel)
Dashboard: Manage both users and drivers, monitor trips, and oversee the overall platform health.
User Management: Add, edit, or delete users from the platform.
Driver Management: Approve new drivers, track their performance, and resolve complaints.
Data Analytics: Visualize key metrics such as active users, completed trips, and earnings.
System Notifications: Manage notifications and updates for users and drivers.

🛠️ Tech Stack

Frontend: React.js
Hooks, Router, Context API for state management
Axios for API requests
SCSS for styling

Backend: Flask (Python)
RESTful API
Flask-JWT for authentication
Flask-CORS for cross-origin resource sharing

Database: PostgreSQL
SQLAlchemy ORM for database interaction
PostgreSQL for scalable relational database management
Version Control: Git and GitHub
Deployment: Docker for containerization, Nginx for reverse proxy

📂 Project Structure

swift-ride/
├── client/                 # React Frontend (Passenger, Driver, Admin Panels)
│   ├── public/             # Public assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Pages for different user types
│   │   ├── styles/         # SCSS stylesheets
│   └── package.json        # React dependencies
├── server/                 # Flask Backend
│   ├── app/
│   │   ├── controllers/    # API routes and controllers
│   │   ├── models/         # Database models (User, Driver, Ride, etc.)
│   │   ├── utils/          # Helper functions
│   │   └── config.py       # Flask configuration (e.g., DB URI, JWT settings)
│   └── requirements.txt    # Python dependencies
├── db/
│   ├── migrations/         # Database migrations
│   └── schema.sql          # SQL schema for PostgreSQL
└── docker-compose.yml      # Docker configuration for multi-container setup


