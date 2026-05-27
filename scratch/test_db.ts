import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const testConn = async () => {
    const uri = process.env.MONGO_URI;
    console.log('Testing connection to:', uri?.replace(/:([^@]+)@/, ':****@')); // Hide password
    try {
        await mongoose.connect(uri!);
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    } catch (err: any) {
        console.error('ERROR:', err.message);
        if (err.errorResponse) {
            console.error('Atlas Response:', JSON.stringify(err.errorResponse, null, 2));
        }
        process.exit(1);
    }
};

testConn();
