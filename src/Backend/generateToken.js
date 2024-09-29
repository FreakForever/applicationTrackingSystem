const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

const generateRandomToken = () => {
  const payload = {
    userId: 'randomUser123',  // You can use random or static data
    email: 'random@example.com'
  };

  // Create a token using the secret from environment variables
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  console.log('Generated JWT Token:', token);
};

generateRandomToken();
