import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/Layout';
import LinkCard from '../components/LinkCard';
import ProfileHeader from '../components/ProfileHeader';
import Loading from '../components/Loading';
import { Terminal, Shield } from 'lucide-react';

interface Link {
    _id: string;
    title: string;
    originalUrl: string;
    priority: number;
    clicks?: number;
    imageUrl?: string;
}

interface HubData {
    hub: {
        _id: string;
        slug: string;
        themeConfig: any;
        ownerId?: string;
    };
    links: Link[];
}

const PublicProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<HubData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{ status: number, message: string } | null>(null);

    useEffect(() => {
        const fetchHub = async (locationData?: any) => {
            try {
                const headers: any = {};
                if (locationData) {
                    headers['x-user-location'] = JSON.stringify(locationData);
                }
                const response = await api.get(`/hubs/${slug}`, { headers });
                setData(response.data);
            } catch (err: any) {
                console.error(err);
                setError({
                    status: err.response?.status || 500,
                    message: err.response?.data?.message || 'Server Error'
                });
            } finally {
                setLoading(false);
            }
        };

        const attemptLocation = () => {
            if (!navigator.geolocation) {
                fetchHub();
                return;
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
                    const data = await res.json();

                    const locData = {
                        country: data.address?.country,
                        region: data.address?.state,
                        city: data.address?.city || data.address?.town || data.address?.village,
                        postalCode: data.address?.postcode
                    };
                    fetchHub(locData);
                } catch (e) {
                    fetchHub();
                }
            }, () => {
                fetchHub();
            });
        };

        if (slug) {
            attemptLocation();
        }
    }, [slug]);

    const handleLinkClick = async (linkId: string) => {
        try {
            await api.post(`/links/${linkId}/click`);
        } catch (e) {
            console.error("Failed to track click", e);
        }
    };



    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black">
                    <Loading />
                    <span className="mt-4 font-mono text-cyber-green text-xs animate-pulse">Loading...</span>
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        const is404 = error?.status === 404;
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center text-cyber-green bg-cyber-black p-6 text-center">
                    <Terminal className="w-20 h-20 mb-6 opacity-20" />
                    <h1 className="text-4xl font-mono font-black tracking-tighter text-glow">
                        {is404 ? 'Not Found' : 'Server Error'}
                    </h1>
                    <p className="mt-4 text-cyber-text-muted font-mono text-sm max-w-xs leading-relaxed">
                        {is404 
                            ? 'This hub does not exist.' 
                            : 'An unexpected error occurred while accessing the node.'}
                    </p>
                    <a href="/dashboard" className="mt-10 glass px-8 py-3 rounded-full text-xs font-mono hover:text-cyber-green transition-all">
                        Back
                    </a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen px-4 py-12 flex flex-col items-center max-w-2xl mx-auto relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyber-green/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                
                <ProfileHeader
                    username={data.hub.slug}
                    avatarUrl={data.hub.themeConfig?.avatarUrl}
                    isOwner={false}
                />

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full space-y-2 mt-12 mb-20"
                >
                    {data.links.map((link) => (
                        <LinkCard
                            key={link._id}
                            title={link.title}
                            url={link.originalUrl}
                            onClick={() => handleLinkClick(link._id)}
                            showClickCount={false}
                            clickCount={link.clicks || 0}
                            imageUrl={link.imageUrl}
                        />
                    ))}

                    {data.links.length === 0 && (
                        <div className="text-center text-cyber-text-muted font-mono py-16 glass border-dashed border-white/5 rounded-3xl opacity-50 text-xs">
                            &gt; No links found
                        </div>
                    )}
                </motion.div>

                <footer className="mt-auto pt-16 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-cyber-text-muted font-mono tracking-[0.2em] opacity-40 uppercase">
                        <Shield size={12} /> Encrypted // Smart_Link_Hub_V2
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
                        <span className="text-[10px] text-cyber-green font-mono uppercase tracking-widest text-glow">Node_Status: Secure</span>
                    </div>
                </footer>

            </div>
        </Layout>
    );
};

export default PublicProfile;
