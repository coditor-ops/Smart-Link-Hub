import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/Layout';
import LinkCard from '../components/LinkCard';
import ProfileHeader from '../components/ProfileHeader';
import Loading from '../components/Loading';
import ImageUpload from '../components/ImageUpload';
import { Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        ownerId?: string; // Assuming API might populate this or we check against logged in user differently
    };
    links: Link[];
}

const PublicProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth(); // To check ownership
    const [data, setData] = useState<HubData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadTarget, setUploadTarget] = useState<{ type: 'profile' | 'link', id?: string } | null>(null);

    // Mock verification for ownership - in real app, check user._id === data.hub.ownerId
    // For this demo, we'll assume if you're logged in, you can see the edit button (or check if user exists)
    const isOwner = !!user;

    useEffect(() => {
        const fetchHub = async (locationData?: any) => {
            try {
                const headers: any = {};
                if (locationData) {
                    headers['x-user-location'] = JSON.stringify(locationData);
                }
                const response = await api.get(`/hubs/${slug}`, { headers });
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
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
                    // Reverse Geocode
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
                    console.error("Reverse geocode failed", e);
                    fetchHub();
                }
            }, (error) => {
                console.log("Loc permission denied", error);
                fetchHub(); // Fallback without location
            });
        };

        if (slug) {
            attemptLocation();
        }
    }, [slug]);

    const handleLinkClick = async (linkId: string) => {
        // Optimistic UI or just fire and forget
        try {
            await api.post(`/links/${linkId}/click`);
        } catch (e) {
            console.error("Failed to track click", e);
        }
    };

    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            setLoading(true);
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = `http://localhost:5000${res.data.url}`;

            if (uploadTarget?.type === 'profile' && data) {
                // Update Hub Config
                await api.put(`/hubs/${data.hub._id}`, {
                    themeConfig: {
                        ...data.hub.themeConfig,
                        avatarUrl: imageUrl
                    }
                });

                // Update Local State
                setData(prev => prev ? ({
                    ...prev,
                    hub: {
                        ...prev.hub,
                        themeConfig: {
                            ...prev.hub.themeConfig,
                            avatarUrl: imageUrl
                        }
                    }
                }) : null);
            }
            // Link upload logic removed as feature moved to Config, but could support here if needed.
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setLoading(false);
            setShowUpload(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loading />
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center text-cyber-green">
                    <Terminal className="w-16 h-16 mb-4" />
                    <h1 className="text-2xl font-mono">404: HUB_NOT_FOUND</h1>
                    <p className="mt-2 text-cyber-text">System failure. Check your coordinates.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen px-4 py-8 flex flex-col items-center max-w-2xl mx-auto">
                <ProfileHeader
                    username={data.hub.slug}
                    avatarUrl={data.hub.themeConfig?.avatarUrl}
                    isOwner={isOwner}
                    onEditProfile={() => console.log("Edit profile clicked")}
                    onUploadAvatar={() => {
                        setUploadTarget({ type: 'profile' });
                        setShowUpload(true);
                    }}
                />

                <div className="w-full space-y-4 mt-8">
                    {data.links.map((link) => (
                        <LinkCard
                            key={link._id}
                            title={link.title}
                            url={link.originalUrl}
                            onClick={() => handleLinkClick(link._id)}
                            showClickCount={isOwner}
                            clickCount={link.clicks || 0}
                            imageUrl={link.imageUrl}
                        // isOwner={isOwner} -> Removing this or keeping it for showClickCount? 
                        // showClickCount uses isOwner. We just remove the upload handler.
                        />
                    ))}

                    {data.links.length === 0 && (
                        <div className="text-center text-cyber-text-muted font-mono py-10 border border-dashed border-cyber-text-muted/20 rounded-xl">
                            &gt; No links modules installed.
                        </div>
                    )}
                </div>

                <div className="mt-16 text-xs text-cyber-text/30 font-mono">
                    <span className="animate-pulse">●</span> SYSTEM_ONLINE // SMART_LINK_HUB_V2
                </div>

                <AnimatePresence>
                    {showUpload && (
                        <ImageUpload
                            onUpload={handleUpload}
                            onCancel={() => setShowUpload(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default PublicProfile;
