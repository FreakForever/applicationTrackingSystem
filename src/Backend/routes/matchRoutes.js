const express = require('express');
const multer = require('multer');
const { processResume } = require('/Users/ashwin.s/Desktop/Application/ats-ml/src/Backend/controllers/matchController.js'); // Adjust the path as needed

const router = express.Router();

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Route to handle resume processing and job matching
router.post('/process_resume', upload.single('uploadedFile'), processResume);

module.exports = router;
