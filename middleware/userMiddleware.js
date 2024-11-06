// middleware/userMiddleware.js
const { verifyToken } = require('../services/auth/AccessToken');
const logger = require('../services/logger');

const userMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.error('Token not provided');
    return res.status(401).json({ message: 'Token not provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.error('Invalid or expired token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;

  // Logge den dekodierten Token-Inhalt
  logger.info('User authenticated:', req.user);
  logger.info('Decoded token:', decoded);

  next();
};

module.exports = userMiddleware;
