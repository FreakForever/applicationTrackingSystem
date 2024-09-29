// /routes/index.js
const express = require('express');
const authController = require('../controllers/authController');
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Sign-in/Sign-up with SQL (Prisma)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Gemini match results with MongoDB
router.post('/store-match', authMiddleware, matchController.storeMatchResult);

module.exports = router;
