import { UAParser } from 'ua-parser-js';
import { isWithinInterval, parse, set } from 'date-fns';
import { ILinkHub } from '../models/LinkHub';
import { ILink } from '../models/Link';

export interface UserLocation {
    country?: string;
    region?: string; // State
    city?: string;
    postalCode?: string;
}

export interface RequestContext {
    userAgent: string;
    location?: UserLocation; // Detailed location object
    currentTime?: Date; // Allow passing time for testing/simulation
}

// Helper type that includes the populated links
export interface PopulatedLinkHub extends ILinkHub {
    links: ILink[];
}
// Helper: Location Matching Logic
const shouldShowLink = (targetLocations: string[], userLocation?: UserLocation, fallback: boolean = false): boolean => {
    // If no user location is provided (e.g. permission denied/ip lookup failed), use fallback
    if (!userLocation) return fallback;

    const normalize = (s?: string) => s?.toLowerCase().trim() || '';

    for (const target of targetLocations) {
        const t = normalize(target);
        if (!t) continue;

        // 1. Exact Match: Postal Code
        if (normalize(userLocation.postalCode) === t) return true;

        // 2. Broad Match: City or Region (State)
        if (normalize(userLocation.city) === t) return true;
        if (normalize(userLocation.region) === t) return true;

        // 3. Hierarchy Match: Country
        if (normalize(userLocation.country) === t) return true;
    }

    return false;
};

export const resolveLinks = (hub: PopulatedLinkHub, context: RequestContext): ILink[] => {
    const { userAgent, currentTime = new Date() } = context;
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const deviceType = device.type || 'desktop'; // Default to desktop if undefined (common for desktops)

    // 1. Filter Links
    const filteredLinks = hub.links.filter((link) => {
        if (!link.isActive) return false;

        console.log(`[LinkResolver] Processing Link: ${link.title} (${link.originalUrl})`);

        // Check all rules
        for (const rule of link.rules) {
            console.log(`  - Checking Rule: ${rule.type} | Value: ${rule.value} | Action: ${rule.action}`);

            if (rule.type === 'time') {
                // Format expected: "HH:mm-HH:mm" (24h)
                const [start, end] = rule.value.split('-');
                if (start && end) {
                    const now = currentTime;
                    const startDate = parse(start, 'HH:mm', now);
                    let endDate = parse(end, 'HH:mm', now);

                    // Handle midnight crossing (e.g. 23:00 - 00:00 or 02:00)
                    if (endDate < startDate) {
                        endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
                        // If 'now' is in the early morning (e.g. 00:30) and the range is 23:00-02:00
                        // we need to check if we should shift the window back or forward.
                        // Simple check: if now < startDate, maybe we are in the "next day" part of the window?
                        // Alternatively, check simple time strings.
                    }

                    // Robust check using pure time comparison for Midnight crossing
                    // If start > end (e.g. 23:00 > 00:00), it's a split range: [start, 23:59] OR [00:00, end]
                    // This is safer than date manipulation.
                    const currentMinutes = now.getHours() * 60 + now.getMinutes();
                    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
                    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);

                    let isWithin = false;
                    if (startMinutes <= endMinutes) {
                        // Normal range (09:00 - 17:00)
                        isWithin = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
                    } else {
                        // Midnight crossing (23:00 - 02:00)
                        isWithin = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
                    }

                    console.log(`    > Time Check: ${isWithin} (Now: ${now.toLocaleTimeString()}, Range: ${start}-${end})`);

                    if (rule.action === 'show' && !isWithin) return false;
                    if (rule.action === 'hide' && isWithin) return false;
                }
            } else if (rule.type === 'device') {
                const targetDevices = rule.value.toLowerCase().split(','); // 'mobile,tablet' -> ['mobile', 'tablet']
                let isMatch = false;

                // Check if ANY of the target devices match the current device type
                for (const target of targetDevices) {
                    const cleanTarget = target.trim();
                    if (cleanTarget === 'mobile' && deviceType === 'mobile') isMatch = true;
                    if (cleanTarget === 'tablet' && deviceType === 'tablet') isMatch = true;
                    if (cleanTarget === 'desktop' && (deviceType === 'desktop' || deviceType === undefined)) isMatch = true;
                }

                console.log(`    > Device Check: Match? ${isMatch} (UserDevice: ${deviceType}, Targets: ${targetDevices.join('|')})`);

                if (rule.action === 'show' && !isMatch) return false;
                if (rule.action === 'hide' && isMatch) return false;
            } else if (rule.type === 'location') {
                const targetLocations = rule.value.split(','); // e.g. "India,Mumbai,10001"

                // Default Fallback: If user location is unknown, should we match?
                // If rule is SHOW, and we don't know where user is -> Safe to Hide? (Access Denied)
                // If rule is HIDE, and we don't know where user is -> Safe to Show?
                // Let's assume strictness: If checking for location, and location is unknown, return false (no match).
                const isMatch = shouldShowLink(targetLocations, context.location, false);

                console.log(`    > Location Check: Match? ${isMatch} (UserLoc: ${JSON.stringify(context.location)}, Targets: ${targetLocations.join('|')})`);

                if (rule.action === 'show' && !isMatch) return false;
                if (rule.action === 'hide' && isMatch) return false;
            }
        }

        return true;
    });

    // 2. Sort/Rank Links (Auto-Promotion)
    return filteredLinks.sort((a, b) => {
        // Calculate effective priority
        // Boost: 5% of clicks added to priority
        const scoreA = a.priority + (a.analytics.clicks * 0.05);
        const scoreB = b.priority + (b.analytics.clicks * 0.05);

        return scoreB - scoreA; // Descending order
    });
};
