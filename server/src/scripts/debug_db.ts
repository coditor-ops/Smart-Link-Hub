import mongoose from 'mongoose';
import LinkHub from '../models/LinkHub';
import Link from '../models/Link';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

mongoose.connect(process.env.MONGO_URI!).then(async () => {
    const hubs = await LinkHub.find({});
    const links = await Link.find({});

    const output = {
        hubs,
        links
    };

    fs.writeFileSync('debug_output.json', JSON.stringify(output, null, 2));
    console.log('Dumped to debug_output.json');
    process.exit(0);
});
