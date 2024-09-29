// config.js
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Create a new instance of PrismaClient
const prisma = new PrismaClient();

// MongoDB configuration (if you need it later)
const mongoConfig = {
  url: process.env.MONGO_URL,
};

// Export the configurations
module.exports = {
  prisma,
  mongoConfig,
  jwtSecret: process.env.JWT_SECRET,
};
