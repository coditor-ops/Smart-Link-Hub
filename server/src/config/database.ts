import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';
import LinkHub from '../models/LinkHub';
import Link from '../models/Link';
import bcrypt from 'bcryptjs';

let mongoServer: MongoMemoryServer | null = null;

const seedDatabaseIfEmpty = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already has data. Skipping seed.');
            return;
        }

        console.log('Database is empty. Seeding default demo data...');

        // Create User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        const user = new User({
            username: 'demo_user',
            email: 'demo@example.com',
            passwordHash
        });
        await user.save();
        console.log('Demo User created: demo@example.com / password123');

        // Create Hub
        const hub = new LinkHub({
            slug: 'demo',
            ownerId: user._id,
            themeConfig: {
                backgroundColor: '#0a0a0a',
                textColor: '#e5e5e5',
                buttonColor: '#00ff41'
            }
        });
        await hub.save();
        console.log('Demo Hub created: demo');

        // Create Links
        const links = [
            {
                hubId: hub._id,
                title: 'My Portfolio',
                originalUrl: 'https://github.com',
                priority: 10,
                isActive: true,
                rules: []
            },
            {
                hubId: hub._id,
                title: 'Twitter (X)',
                originalUrl: 'https://twitter.com',
                priority: 8,
                isActive: true,
                rules: []
            },
            {
                hubId: hub._id,
                title: 'Mobile Only Link',
                originalUrl: 'https://www.apple.com/iphone/',
                priority: 5,
                isActive: true,
                rules: [{ type: 'device', value: 'mobile', action: 'show' }]
            },
            {
                hubId: hub._id,
                title: 'Limited Time Offer (09:00-17:00)',
                originalUrl: 'https://example.com/offer',
                priority: 9,
                isActive: true,
                rules: [{ type: 'time', value: '09:00-17:00', action: 'show' }]
            }
        ];

        await Link.insertMany(links);
        console.log('Demo Links created successfully!');
    } catch (seedError) {
        console.error('Error seeding database:', seedError);
    }
};

export const connectDB = async () => {
    let mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-link-hub';
    const useInMemory = process.env.USE_IN_MEMORY_DB === 'true';

    if (useInMemory) {
        console.log('Starting in-memory MongoDB server...');
        try {
            mongoServer = await MongoMemoryServer.create();
            mongoURI = mongoServer.getUri();
            console.log(`In-memory MongoDB started at: ${mongoURI}`);
        } catch (err) {
            console.error('Failed to create in-memory MongoDB server:', err);
        }
    }

    try {
        console.log(`Connecting to MongoDB URI: ${mongoURI.replace(/:[^:@/]+@/, ':****@')}`);
        await mongoose.connect(mongoURI, {
            // Optimization: Increase pool size for better concurrency
            maxPoolSize: 10,
            retryWrites: true,
            connectTimeoutMS: 5000,
        });

        console.log('MongoDB Connected');
        await seedDatabaseIfEmpty();
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        if (!useInMemory) {
            console.log('Attempting fallback to in-memory MongoDB server...');
            try {
                mongoServer = await MongoMemoryServer.create();
                mongoURI = mongoServer.getUri();
                console.log(`In-memory MongoDB fallback started at: ${mongoURI}`);
                await mongoose.connect(mongoURI, {
                    maxPoolSize: 10,
                    connectTimeoutMS: 5000,
                });
                console.log('MongoDB Connected (Fallback to Memory)');
                await seedDatabaseIfEmpty();
                return;
            } catch (fallbackError) {
                console.error('In-memory MongoDB fallback failed:', fallbackError);
                throw fallbackError;
            }
        }
        throw error; // Rethrow to let startServer handle it
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
};
