const express = require('express');
const { processResume } = require('../controllers/matchController'); // Updated controller using OpenAI
const multer = require('multer');

const router = express.Router();

// Use memory storage for uploading files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for processing resume and matching it with the job description
// This expects a POST request with 'resume' file and 'job_description' in the body
router.post('/process_resume', upload.single('resume'), processResume);

module.exports = router;
