// routes/ride.js
const express = require('express');
const Ride = require('../models/Ride');
const auth = require('../middleware/auth'); // JWT authentication middleware

const router = express.Router();

// Fetch trips for the logged-in user
router.get('/user/trips', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id }); // Assuming `Ride` model stores rides and is linked to the user
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching trips' });
  }
});

module.exports = router;
