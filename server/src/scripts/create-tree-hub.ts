
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LinkHub from '../models/LinkHub';
import Link from '../models/Link';
import User from '../models/User';
import { connectDB } from '../config/database';

dotenv.config();

const createTreeHub = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // 1. Check if "tree" hub already exists
        let hub = await LinkHub.findOne({ slug: 'tree' });
        if (hub) {
            console.log('Hub "tree" already exists. No action needed.');
            process.exit(0);
        }

        // 2. Find a user to own the hub (get the first user found or a demo user)
        let user = await User.findOne().sort({ createdAt: -1 });
        if (!user) {
            console.log('No users found in database. Cannot create hub.');
            process.exit(1);
        }

        console.log(`Creating hub "tree" for user: ${user.username} (${user.email})`);

        // 3. Create the Hub
        hub = new LinkHub({
            slug: 'tree',
            ownerId: user._id,
            themeConfig: {
                backgroundColor: '#0a0a0a',
                textColor: '#00ff41',
                buttonColor: '#00ff41'
            }
        });

        await hub.save();
        console.log('Hub "tree" created successfully.');

        // 4. Add some sample links
        const sampleLinks = [
            {
                hubId: hub._id,
                title: 'Main Portfolio',
                originalUrl: 'https://example.com',
                priority: 10,
                isActive: true,
                rules: [],
                analytics: { clicks: 0 }
            },
            {
                hubId: hub._id,
                title: 'Latest Research',
                originalUrl: 'https://openai.com',
                priority: 8,
                isActive: true,
                rules: [],
                analytics: { clicks: 0 }
            }
        ];

        await Link.insertMany(sampleLinks);
        console.log('Sample links added to "tree" hub.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating hub:', err);
        process.exit(1);
    }
};

createTreeHub();
