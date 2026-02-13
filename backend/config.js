import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const mongoDBURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/booknest';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

