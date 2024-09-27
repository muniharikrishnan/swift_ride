import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import App from './App.jsx';

// import 'src\style.css';
import './styles.css'; // Ensure correct relative path



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
