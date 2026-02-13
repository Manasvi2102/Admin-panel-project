import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../config.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};