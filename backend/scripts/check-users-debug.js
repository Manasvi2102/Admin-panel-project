
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUsers = async () => {
    const uri = process.env.MONGODB_URI; // Use MONGODB_URI instead of MONGO_URI
    if (!uri) {
        console.error('MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);
        users.forEach(u => {
            console.log(`- ${u.email} (Verified: ${u.isVerified}, Role: ${u.role})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
