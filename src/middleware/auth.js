import jwt from 'jsonwebtoken';
import {tryCatch} from '../utils/tryCatch.js';

const authenticate = tryCatch(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next({
      message: 'Unauthorized. Token not available.'
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode.user;
    next();
  } catch (error) {
    return next({
      message: 'Unauthorized. Error while verifying the token'
    });
  }
});

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next({
      message: 'Unauthorized to access this route'
    });
  }
  next();
};

export { authenticate, authorize };