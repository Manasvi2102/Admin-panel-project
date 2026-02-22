
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const debugLogin = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);

        console.log('Checking user: john@example.com');
        const user = await User.findOne({ email: 'john@example.com' }).select('+password');

        if (!user) {
            console.log('User not found!');
        } else {
            console.log('User found.');
            console.log('Stored Password Hash:', user.password);
            console.log('Is Verified:', user.isVerified);
            console.log('Is Active:', user.isActive);

            const isMatch = await bcrypt.compare('password', user.password);
            console.log('Password "password" match result:', isMatch);

            if (!isMatch) {
                console.log('Trying to re-hash...');
                const salt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash('password', salt);
                console.log('New Hash:', newHash);
                const isMatchNew = await bcrypt.compare('password', newHash);
                console.log('New Hash Match:', isMatchNew);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLogin();
