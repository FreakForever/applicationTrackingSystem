const express = require('express');
const { login,register } = require('/Users/ashwin.s/Desktop/Application/ats-ml/src/Backend/controllers/authControllers.js');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);



module.exports = router;
