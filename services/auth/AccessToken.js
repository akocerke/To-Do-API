// services/auth/AccessToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallbackSecret',
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallbackSecret');
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
