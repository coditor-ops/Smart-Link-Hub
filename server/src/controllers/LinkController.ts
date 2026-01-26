import { Request, Response } from 'express';
import { z } from 'zod';
import Link from '../models/Link';
import LinkHub from '../models/LinkHub';

// Zod Schemas
const LinkRuleSchema = z.object({
    type: z.enum(['time', 'device', 'location']),
    value: z.string(),
    action: z.enum(['show', 'hide']),
});

const CreateLinkSchema = z.object({
    hubId: z.string().min(1, 'Hub ID is required'),
    originalUrl: z.string().min(1, 'URL is required'), // Relaxed URL check for flexibility, or use .url()
    title: z.string().min(1, 'Title is required'),
    priority: z.number().optional(),
    isActive: z.boolean().optional(),
    rules: z.array(LinkRuleSchema).optional(),
});

const UpdateLinkSchema = z.object({
    originalUrl: z.string().optional(),
    title: z.string().optional(),
    priority: z.number().optional(),
    isActive: z.boolean().optional(),
    rules: z.array(LinkRuleSchema).optional(),
});

export const LinkController = {
    // Create Link
    createLink: async (req: Request | any, res: Response | any) => {
        try {
            // Validate Body
            const validatedData = CreateLinkSchema.parse(req.body);

            // Verify Hub Ownership
            const hub = await LinkHub.findById(validatedData.hubId);
            if (!hub) return res.status(404).json({ message: 'Hub not found' });
            if (hub.ownerId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // VALIDATION: Check for conflicting rules
            if (validatedData.rules) {
                for (let i = 0; i < validatedData.rules.length; i++) {
                    const r1 = validatedData.rules[i];
                    for (let j = i + 1; j < validatedData.rules.length; j++) {
                        const r2 = validatedData.rules[j];

                        // Exact duplicate or same value conflict
                        if (r1.type === r2.type && r1.value === r2.value) {
                            if (r1.action !== r2.action) {
                                return res.status(400).json({ message: `Conflicting rules detected: You cannot both SHOW and HIDE ${r1.type} '${r1.value}'.` });
                            } else {
                                return res.status(400).json({ message: `Duplicate rule detected for ${r1.type} '${r1.value}'.` });
                            }
                        }

                        // Device Overlap Check
                        if (r1.type === 'device' && r2.type === 'device') {
                            const d1 = r1.value.split(',');
                            const d2 = r2.value.split(',');
                            const overlap = d1.filter(d => d2.includes(d));
                            if (overlap.length > 0) {
                                return res.status(400).json({ message: `Redundant or Conflicting Device Rule: Devices '${overlap.join(',')}' are mentioned multiple times.` });
                            }
                        }
                    }
                }
            }

            const newLink = new Link(validatedData);
            const link = await newLink.save();
            res.json(link);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ errors: err.issues });
            }
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // Update Link
    updateLink: async (req: Request | any, res: Response | any) => {
        try {
            const { id } = req.params;
            const validatedData = UpdateLinkSchema.parse(req.body);

            const link = await Link.findById(id);
            if (!link) return res.status(404).json({ message: 'Link not found' });

            const hub = await LinkHub.findById(link.hubId);
            if (!hub || hub.ownerId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // VALIDATION: Check for conflicting rules
            if (validatedData.rules) {
                for (let i = 0; i < validatedData.rules.length; i++) {
                    const r1 = validatedData.rules[i];
                    for (let j = i + 1; j < validatedData.rules.length; j++) {
                        const r2 = validatedData.rules[j];

                        // Exact duplicate or same value conflict
                        if (r1.type === r2.type && r1.value === r2.value) {
                            if (r1.action !== r2.action) {
                                return res.status(400).json({ message: `Conflicting rules detected: You cannot both SHOW and HIDE ${r1.type} '${r1.value}'.` });
                            } else {
                                return res.status(400).json({ message: `Duplicate rule detected for ${r1.type} '${r1.value}'.` });
                            }
                        }

                        // Device Overlap Check
                        if (r1.type === 'device' && r2.type === 'device') {
                            const d1 = r1.value.split(',');
                            const d2 = r2.value.split(',');
                            const overlap = d1.filter(d => d2.includes(d));
                            if (overlap.length > 0) {
                                return res.status(400).json({ message: `Redundant or Conflicting Device Rule: Devices '${overlap.join(',')}' are mentioned multiple times.` });
                            }
                        }
                    }
                }
            }

            const updatedLink = await Link.findByIdAndUpdate(id, { $set: validatedData }, { new: true });
            res.json(updatedLink);
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({ errors: err.issues });
            }
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // Delete Link
    deleteLink: async (req: Request | any, res: Response | any) => {
        try {
            const { id } = req.params;
            const link = await Link.findById(id);
            if (!link) return res.status(404).json({ message: 'Link not found' });

            const hub = await LinkHub.findById(link.hubId);
            if (!hub || hub.ownerId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await Link.findByIdAndDelete(id);
            res.json({ message: 'Link removed' });
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    // Public: Track Click
    trackClick: async (req: Request | any, res: Response | any) => {
        try {
            const { id } = req.params;
            const link = await Link.findById(id);
            if (!link) return res.status(404).json({ message: 'Link not found' });

            link.analytics.clicks += 1;
            await link.save();

            res.json({ message: 'Click recorded', url: link.originalUrl });
        } catch (err: any) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
};
