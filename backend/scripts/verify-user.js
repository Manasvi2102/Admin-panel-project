
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyUser = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const email = 'john@example.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found.`);
        } else {
            console.log(`User found: ${email}. Current status: verified=${user.isVerified}`);
            if (!user.isVerified) {
                user.isVerified = true;
                // We need to be careful not to re-hash password if we save.
                // The pre-save hook checks isModified('password').
                // Since we are not modifying password, it should be fine.
                await user.save();
                console.log(`User ${email} has been manually verified.`);
            } else {
                console.log('User is already verified.');
            }
        }

        // Also verify admin just in case
        const admin = await User.findOne({ email: 'admin@example.com' });
        if (admin && !admin.isVerified) {
            admin.isVerified = true;
            await admin.save();
            console.log('Admin user manually verified.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyUser();
