import { Request, Response } from 'express';
import { z } from 'zod';
import LinkHub from '../models/LinkHub';
import Link from '../models/Link';
import { resolveLinks, PopulatedLinkHub, RequestContext } from '../services/LinkResolver';

// Zod Schemas
const CreateHubSchema = z.object({
    slug: z.string().min(1, 'Slug is required'),
    themeConfig: z.object({
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        buttonColor: z.string().optional(),
    }).optional(),
});

const UpdateHubSchema = z.object({
    slug: z.string().optional(),
    themeConfig: z.object({
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        buttonColor: z.string().optional(),
        avatarUrl: z.string().optional(),
    }).optional(),
});


export const HubController = {
    // Create Hub
    createHub: async (req: Request | any, res: Response | any) => {
        try {
            const validatedData = CreateHubSchema.parse(req.body);
            const { slug, themeConfig } = validatedData;

            let hub = await LinkHub.findOne({ slug });
            if (hub) {
                return res.status(400).json({ message: 'Hub with this slug already exists' });
            }

            hub = new LinkHub({
                slug,
                ownerId: req.user.id,
                themeConfig,
            });

            await hub.save();
            res.json(hub);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ errors: err.issues });
            }
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // Get My Hubs
    getMyHubs: async (req: Request | any, res: Response | any) => {
        try {
            const hubs = await LinkHub.find({ ownerId: req.user.id });
            res.json(hubs);
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // Update Hub
    updateHub: async (req: Request | any, res: Response | any) => {
        try {
            const validatedData = UpdateHubSchema.parse(req.body);
            const { id } = req.params;

            let hub = await LinkHub.findById(id);
            if (!hub) return res.status(404).json({ message: 'Hub not found' });
            if (hub.ownerId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (validatedData.slug) hub.slug = validatedData.slug;
            if (validatedData.themeConfig) {
                hub.themeConfig = { ...hub.themeConfig, ...validatedData.themeConfig };
            }

            await hub.save();
            res.json(hub);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ errors: err.issues });
            }
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // PUBLIC: Get Resolved Hub
    getPublicHub: async (req: Request | any, res: Response | any) => {
        try {
            const hub = await LinkHub.findOne({ slug: req.params.slug });
            if (!hub) return res.status(404).json({ message: 'Hub not found' });

            // Background: Increment View Count
            LinkHub.findByIdAndUpdate(hub._id, { $inc: { 'stats.totalViews': 1 } }).exec();

            // Fetch Links
            const links = await Link.find({ hubId: hub._id });

            // Resolve Links
            const populatedHub: PopulatedLinkHub = {
                ...hub.toObject(),
                links
            } as unknown as PopulatedLinkHub;

            let userLocation;
            try {
                const locHeader = req.headers['x-user-location'] as string;
                if (locHeader) {
                    userLocation = JSON.parse(locHeader);
                }
            } catch (e) {
                console.warn('Failed to parse user location header', e);
            }

            const context: RequestContext = {
                userAgent: req.headers['user-agent'] || '',
                location: userLocation,
                currentTime: new Date()
            };

            const resolvedLinks = resolveLinks(populatedHub, context);

            res.json({
                hub,
                links: resolvedLinks
            });
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // ADMIN: Get Full Hub for Management
    getHubAdmin: async (req: Request | any, res: Response | any) => {
        try {
            const hub = await LinkHub.findOne({ slug: req.params.slug });
            if (!hub) return res.status(404).json({ message: 'Hub not found' });

            // Authorization Check
            if (hub.ownerId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // Fetch All Links (No Resolution/Filtering)
            const links = await Link.find({ hubId: hub._id });

            res.json({
                hub,
                links
            });
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
};
