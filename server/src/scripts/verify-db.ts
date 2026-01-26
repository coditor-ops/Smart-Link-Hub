
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LinkHub from '../models/LinkHub';
import Link from '../models/Link';
import { connectDB } from '../config/database';

dotenv.config();

const verifyDB = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const slugsToCheck = ['my portfolio', 'my%20portfolio'];

        for (const slug of slugsToCheck) {
            console.log(`\n--- Checking Hub: "${slug}" ---`);
            const hub = await LinkHub.findOne({ slug });

            if (!hub) {
                console.log('Hub NOT found.');
                continue;
            }

            console.log(`Hub Found: ID=${hub._id}, Owner=${hub.ownerId}`);

            const links = await Link.find({ hubId: hub._id });
            console.log(`Links Found: ${links.length}`);

            links.forEach(link => {
                console.log(` - [${link._id}] "${link.title}" (OriginalURL: ${link.originalUrl}) Priority: ${link.priority}, Active: ${link.isActive}`);
                if (link.rules && link.rules.length > 0) {
                    console.log(`   Rules: ${JSON.stringify(link.rules)}`);
                }
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyDB();
