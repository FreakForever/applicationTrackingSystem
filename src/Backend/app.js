const express = require('express');
const { connectMongoDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');  // Import authentication routes
const matchRoutes = require('./routes/matchRoutes.js');  // Import matching routes
const cors = require('cors');
require('dotenv').config();  // Load environment variables

const app = express();

// Middleware
app.use(cors());  // Enable CORS to allow cross-origin requests
app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB
connectMongoDB();

// Define routes
app.use('/api/auth', authRoutes);  // Routes for signup/signin
app.use('/api/match', matchRoutes);  // Routes for resume/job description matching

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
