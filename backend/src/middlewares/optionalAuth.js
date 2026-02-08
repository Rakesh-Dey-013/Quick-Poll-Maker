import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // public user
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('_id name');
  } catch (err) {
    // invalid token → treat as guest
  }

  next();
};

export default optionalAuth;