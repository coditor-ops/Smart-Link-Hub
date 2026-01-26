import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LinkHub from '../models/LinkHub';
import Link from '../models/Link';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-link-hub');
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await LinkHub.deleteMany({});
        await Link.deleteMany({});

        // Create User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        const user = new User({
            username: 'demo_user',
            email: 'demo@example.com',
            passwordHash
        });
        await user.save();
        console.log('User created: demo@example.com / password123');

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
        console.log('Hub created: demo');

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
        console.log('Links created');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
