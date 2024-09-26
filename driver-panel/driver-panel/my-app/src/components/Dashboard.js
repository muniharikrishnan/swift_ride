import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [activeSection, setActiveSection] = useState('dashboard'); // Default to 'dashboard'

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchDashboardData(token);
        } else {
            console.log('User not logged in');
        }
    }, []);

    const fetchDashboardData = async (token) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get('http://localhost:5000/api/driver/dashboard', config);
            console.log('Fetched dashboard data:', response.data); // For debugging purposes
            setDashboardData(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleSetActiveSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <div className="dashboard-body">
            <div className="dashboard-sidebar">
                <h1>Driver Panel</h1>
                <nav>
                    <ul>
                        <li>
                            <button onClick={() => handleSetActiveSection('dashboard')}>Dashboard</button>
                        </li>
                        <li>
                            <button onClick={() => handleSetActiveSection('documents')}>Documents</button>
                        </li>
                        <li>
                            <button onClick={() => handleSetActiveSection('accept-rides')}>Accept and Complete Rides</button>
                        </li>
                        <li>
                            <button onClick={() => handleSetActiveSection('today-earnings')}>Today's Earnings</button>
                        </li>
                        <li>
                            <button onClick={() => handleSetActiveSection('history-earnings')}>Earnings History</button>
                        </li>
                        <li>
                            <button onClick={() => handleSetActiveSection('wallet-earnings')}>Wallet Earnings</button>
                        </li>
                        <li>
                            <button onClick={() => handleSetActiveSection('help-support')}>24/7 Help and Support</button>
                        </li>
                    </ul>
                </nav>
            </div>
            <main id="main-content" className="dashboard-main">
                {dashboardData ? (
                    <>
                        <section id="dashboard" className={activeSection === 'dashboard' ? 'active' : ''}>
                            <h2>Dashboard</h2>
                            <p>Welcome to your dashboard, <span id="driver-name">{dashboardData.driver_name}</span>.</p>
                        </section>
                        <section id="documents" className={activeSection === 'documents' ? 'active' : ''}>
                            <h2>Documents</h2>
                            <p>License Number: {dashboardData.license_number}</p>
                            <p>Vehicle Number: {dashboardData.vehicle_number}</p>
                            <p>Vehicle Type: {dashboardData.vehicle_type}</p>
                        </section>
                        <section id="accept-rides" className={activeSection === 'accept-rides' ? 'active' : ''}>
                            <h2>Accept and Complete Rides</h2>
                            <p>Rides completed: {dashboardData.completed_rides}</p>
                        </section>
                        <section id="today-earnings" className={activeSection === 'today-earnings' ? 'active' : ''}>
                            <h2>Today's Earnings</h2>
                            <p>Earnings for today: ${dashboardData.today_earnings.toFixed(2)}</p>
                        </section>
                        <section id="history-earnings" className={activeSection === 'history-earnings' ? 'active' : ''}>
                            <h2>Earnings History</h2>
                            {dashboardData.earnings_history.length === 0 ? (
                                <p>No earnings history available.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.earnings_history.map((entry, index) => (
                                            <tr key={index}>
                                                <td>{entry.date}</td>
                                                <td>${entry.earnings.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </section>
                        <section id="wallet-earnings" className={activeSection === 'wallet-earnings' ? 'active' : ''}>
                            <h2>Wallet Earnings</h2>
                            <p>Wallet earnings: ${dashboardData.wallet_earnings.toFixed(2)}</p>
                        </section>
                        <section id="help-support" className={activeSection === 'help-support' ? 'active' : ''}>
                            <h2>24/7 Help and Support</h2>
                            <p>{dashboardData.help_and_support}</p>
                        </section>
                    </>
                ) : (
                    <p>Loading dashboard data...</p>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
