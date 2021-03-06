import jwt from 'jsonwebtoken';

import { getSecretKey } from '../utils/env';

export default (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, getSecretKey());
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
