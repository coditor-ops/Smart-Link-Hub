import { resolveLinks, PopulatedLinkHub, RequestContext } from './src/services/LinkResolver';
import { ILink } from './src/models/Link';
import mongoose from 'mongoose';

// Mock Data
const mockLinks: Partial<ILink>[] = [
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Always Visible',
        isActive: true,
        priority: 10,
        rules: [],
        analytics: { clicks: 100 }
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Mobile Only',
        isActive: true,
        priority: 5,
        rules: [{ type: 'device', value: 'mobile', action: 'show' }],
        analytics: { clicks: 50 },
        // @ts-ignore
        validate: () => { }
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Working Hours (09-17)',
        isActive: true,
        priority: 8,
        rules: [{ type: 'time', value: '09:00-17:00', action: 'show' }],
        analytics: { clicks: 200 }
    },
    {
        _id: new mongoose.Types.ObjectId(),
        title: 'Hidden',
        isActive: false,
        priority: 20,
        rules: [],
        analytics: { clicks: 0 }
    }
];

const mockHub: PopulatedLinkHub = {
    // @ts-ignore
    links: mockLinks as ILink[],
    slug: 'test-hub'
} as unknown as PopulatedLinkHub;

// Test Cases
const runTests = () => {
    console.log('--- Test 1: Desktop User, 10:00 AM ---');
    const context1: RequestContext = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', // Desktop
        currentTime: new Date('2023-01-01T10:00:00') // Inside working hours
    };
    const result1 = resolveLinks(mockHub, context1);
    console.log('Result:', result1.map(l => `${l.title} (Score: ${l.priority + l.analytics.clicks * 0.05})`));

    console.log('\n--- Test 2: Mobile User, 20:00 PM ---');
    const context2: RequestContext = {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', // Mobile
        currentTime: new Date('2023-01-01T20:00:00') // Outside working hours
    };
    const result2 = resolveLinks(mockHub, context2);
    console.log('Result:', result2.map(l => `${l.title} (Score: ${l.priority + l.analytics.clicks * 0.05})`));
};

runTests();
