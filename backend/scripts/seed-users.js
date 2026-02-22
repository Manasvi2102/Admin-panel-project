
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedUsers = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);

        // Check if users exist
        const count = await User.countDocuments();
        if (count > 0) {
            console.log('Users already exist. Skipping seed.');
            process.exit(0);
        }

        console.log('Seeding users...');

        // Hash passwords manually if bypassing Mongoose middleware, but create() triggers middleware so we just pass plain password.
        // Wait, let's double check User.js. It has a pre-save hook.
        // So we can pass plain text password.

        const users = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password', // will be hashed
                role: 'user',
                isVerified: true, // Auto-verify demo users
                phone: '1234567890'
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123', // will be hashed
                role: 'admin',
                isVerified: true, // Auto-verify demo users
                phone: '9876543210'
            }
        ];

        for (const u of users) {
            await User.create(u);
            console.log(`Created user: ${u.email}`);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedUsers();
