const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    // Removed deprecated options
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Prisma Client for MySQL
const prisma = new PrismaClient();

module.exports = { connectMongoDB, prisma };
