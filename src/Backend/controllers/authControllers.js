const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('/Users/ashwin.s/Desktop/Application/ats-ml/src/Backend/config/config.js'); // Importing prisma from config
const { sendSuccess, sendError } = require('../utils/responseUtils.js');

// User Registration
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return sendSuccess(res, 201, 'User registered successfully', { token });
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 'P2002') { // Prisma unique constraint error
      return sendError(res, 400, 'User already exists');
    }
    return sendError(res, 500, 'Server error');
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required');
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Validate user credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return sendSuccess(res, 200, 'Login successful', { token });
  } catch (error) {
    return sendError(res, 500, 'Server error');
  }
};
