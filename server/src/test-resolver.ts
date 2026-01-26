
import { resolveLinks, RequestContext, PopulatedLinkHub } from './services/LinkResolver';
import { ILinkHub } from './models/LinkHub';
import { ILink } from './models/Link';
import { Types } from 'mongoose';

// Mock Data based on DB Verification
const mockHub: PopulatedLinkHub = {
    _id: new Types.ObjectId(),
    slug: 'my portfolio',
    ownerId: new Types.ObjectId(),
    themeConfig: {},
    links: [
        {
            _id: new Types.ObjectId(),
            title: 'linkedin',
            originalUrl: '...',
            priority: 0,
            isActive: true,
            analytics: { clicks: 0 },
            rules: [
                { type: 'time', value: '12:20-12:59', action: 'show' },
                { type: 'device', value: 'mobile', action: 'show' }
            ]
        },
        {
            _id: new Types.ObjectId(),
            title: 'LinkedIn',
            originalUrl: '...',
            priority: 0,
            isActive: true,
            analytics: { clicks: 0 },
            rules: [
                { type: 'time', value: '09:00-18:00', action: 'show' },
                { type: 'device', value: 'mobile', action: 'show' }
            ]
        },
        {
            _id: new Types.ObjectId(),
            title: 'instagram',
            originalUrl: '...',
            priority: 0,
            isActive: true,
            analytics: { clicks: 0 },
            rules: [
                { type: 'time', value: '23:00-00:00', action: 'hide' },
                { type: 'device', value: 'desktop', action: 'show' }
            ]
        }
    ] as ILink[]
} as unknown as PopulatedLinkHub;

// Test Context: Desktop, Daytime (e.g. 14:00)
const context: RequestContext = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    currentTime: new Date('2024-01-25T14:00:00')
};

console.log('--- Testing resolveLinks ---');
console.log(`Context Time: ${context.currentTime}`);

try {
    const result = resolveLinks(mockHub, context);
    console.log(`\nResolved Links Count: ${result.length}`);
    result.forEach(l => console.log(` - ${l.title}`));
} catch (error) {
    console.error('ERROR during resolution:');
    console.error(error);
}
