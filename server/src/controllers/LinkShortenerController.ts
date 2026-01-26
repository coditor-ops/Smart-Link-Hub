import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
// Assuming Link model exists or creating a simplified interface for this module
// In a real app, you'd import the actual Mongoose model
import Link from '../models/Link';

export const createShortLink = async (req: Request, res: Response) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        // Generate 6-character hash
        const shortHash = nanoid(6);

        // Construct short URL (assuming base URL from env or request host)
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const shortUrl = `${baseUrl}/${shortHash}`;

        // Save to DB
        // This assumes the Link model has 'originalUrl' and 'shortHash' fields
        // If this was a new dedicated "ShortLink" model, we would create that instead.
        // For this module, I'll demonstrate creating a new Link document.

        // Check if Link model is available, otherwise this is conceptual code as requested.
        // implementing via the existing Link model if compatible, or a generic save.

        const newLink = new Link({
            url: originalUrl, // Assuming 'url' field stores the target
            shortHash: shortHash,
            // ... other required fields for the Link model (title, user, etc. might be needed)
            // For this specific module request, I'll focus on the shortener logic.
        });

        // If schema isn't set up for shortHash yet, this part assumes it is or will be.
        // Just in case, I will create a specific ShortLink model concept if the user prefers, 
        // but usually this integrates into the main Link model. 
        // I'll proceed with saving it as if the schema supports it.

        // To be safe and compliant with the "Module" request which asks for the *function*:
        // I will mock the persistence part if the model doesn't strictly match, 
        // but better to write the Mongoose code.

        await newLink.save();

        return res.status(201).json({
            originalUrl,
            shortHash,
            shortUrl
        });

    } catch (error) {
        console.error('Error creating short link:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
