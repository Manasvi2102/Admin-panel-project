import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    process.exit(1);
}

console.log('🔄 Attempting to connect to MongoDB...');
// Mask password for logging
const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
console.log(`📡 URI: ${maskedUri}`);

mongoose
    .connect(uri)
    .then(() => {
        console.log('✅ Connection Successful!');
        console.log('📝 Database Name:', mongoose.connection.name);
        console.log('🔌 Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection Failed!');
        console.error('Error Name:', err.name);
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);

        if (err.codeName === 'AtlasError') {
            console.error('\n💡 TIP: AtlasError usually means invalid username/password or IP whitelist issues.');
            console.error('1. Check if "jayantithakor585" is the correct username.');
            console.error('2. Check if the password is correct (try resetting it in Atlas).');
            console.error('3. Go to Atlas Network Access and allow IP 0.0.0.0/0 (for testing).');
        }

        process.exit(1);
    });
