import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Plus, Edit2, Trash2, Smartphone, Globe, Clock, MousePointer, Download, QrCode, BarChart, Settings } from 'lucide-react';
import LinkEditor from '../components/LinkEditor';
import HubQRCode from '../components/HubQRCode';
import { downloadStatsReport } from '../utils/analyticsExporter';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkType {
    _id: string;
    title: string;
    originalUrl: string;
    priority: number;
    isActive: boolean;
    rules: any[];
    imageUrl?: string;
    analytics: { clicks: number };
}

interface HubData {
    hub: {
        _id: string;
        slug: string;
        themeConfig: any;
    };
    links: LinkType[];
}

const HubManager: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<HubData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingLink, setEditingLink] = useState<LinkType | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [hubSlug, setHubSlug] = useState('');

    useEffect(() => {
        fetchHubData();
    }, [slug]);

    const fetchHubData = async () => {
        try {
            const res = await api.get(`/hubs/manage/${slug}`);
            setData(res.data);
            setHubSlug(res.data.hub.slug);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'FAILED_TO_LOAD_HUB_DATA');
            setLoading(false);
        }
    };

    const handleUpdateHub = async () => {
        if (!data) return;
        try {
            await api.put(`/hubs/${data.hub._id}`, { slug: hubSlug });
            alert('CONFIGURATION_UPDATED');
        } catch (err) {
            alert('UPDATE_FAILED');
        }
    };

    const handleSaveLink = async (link: any) => {
        if (!data) return;
        try {
            if (link._id) {
                const res = await api.put(`/links/${link._id}`, link);
                setData(prev => prev ? ({
                    ...prev,
                    links: prev.links.map(l => l._id === link._id ? res.data : l)
                }) : null);
            } else {
                const res = await api.post('/links', { ...link, hubId: data.hub._id });
                setData(prev => prev ? ({
                    ...prev,
                    links: [...prev.links, res.data]
                }) : null);
            }
            setIsEditorOpen(false);
            setEditingLink(null);
        } catch (err) {
            alert('SAVE_FAILED');
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm('CONFIRM_TERMINATION?')) return;
        try {
            await api.delete(`/links/${id}`);
            setData(prev => prev ? ({
                ...prev,
                links: prev.links.filter(l => l._id !== id)
            }) : null);
        } catch (err) {
            alert('ERASE_FAILED');
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center font-mono text-center p-6">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 border-2 border-cyber-green border-t-transparent rounded-full mb-4"
            />
            <span className="text-cyber-green animate-pulse tracking-[0.2em] text-xs">Loading...</span>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center font-mono text-center p-6">
            <div className="glass border-red-500/30 p-12 rounded-3xl max-w-md">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <Globe size={40} className="text-red-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Error</h2>
                <p className="text-cyber-text-muted text-xs mb-8 leading-relaxed">
                    {error === 'Hub not found' ? 'This hub does not exist.' : error}
                </p>
                <Link to="/dashboard" className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl border border-white/10 transition-all text-xs font-bold inline-block">
                    Back
                </Link>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-cyber-black p-4 md:p-12 pb-32"
        >
            {/* Nav Header */}
            <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="glass p-3 rounded-full text-cyber-text hover:text-cyber-green hover:border-cyber-green transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-mono text-cyber-green font-black tracking-tighter text-glow uppercase">
                            Manage {data.hub.slug}
                        </h1>
                        <p className="text-xs text-cyber-text-muted font-mono mt-1 opacity-50">&gt; ID: {data.hub._id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border-cyber-green/20">
                    <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
                    <span className="text-xs font-mono text-cyber-green">Online</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Settings & Tools */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Hub Settings */}
                    <section className="glass p-8 rounded-2xl border-white/5">
                        <h2 className="text-xs font-mono text-cyber-text-muted mb-6 tracking-[0.2em] uppercase flex items-center gap-2">
                            <Settings size={14} className="text-cyber-green" /> Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-cyber-text-muted font-mono text-[10px] mb-2 uppercase">Slug</label>
                                <div className="flex bg-black/40 rounded-lg border border-white/10 focus-within:border-cyber-green/50 transition-all overflow-hidden">
                                   <input
                                        type="text"
                                        value={hubSlug}
                                        onChange={e => setHubSlug(e.target.value)}
                                        className="w-full bg-transparent text-white p-3 focus:outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleUpdateHub}
                                className="w-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green hover:text-black py-3 rounded-lg font-mono font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={16} /> Save
                            </button>
                        </div>
                    </section>

                    {/* QR Code / Access Matrix */}
                    <section className="glass p-8 rounded-2xl border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-cyber-green opacity-20 flex flex-col items-end">
                            <span>SIG_STRENGTH: 100%</span>
                            <span>ENCR_MODE: AES_256</span>
                        </div>
                        <div className="absolute bottom-0 left-0 p-2 font-mono text-[8px] text-cyber-green opacity-20 flex flex-col items-start uppercase">
                            <span>Node_Link: Established</span>
                            <span>Direct_Sync: Active</span>
                        </div>
                        
                        <h2 className="text-xs font-mono text-cyber-text-muted mb-10 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                            <QrCode size={14} className="text-cyber-green" /> Hub Access Matrix
                        </h2>
                        
                        <HubQRCode url={`${window.location.origin}/h/${data.hub.slug}`} size={160} />
                    </section>

                    {/* Analytics Tool */}
                    <section className="glass p-8 rounded-2xl border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BarChart size={80} />
                        </div>
                        <h2 className="text-xs font-mono text-cyber-text-muted mb-6 tracking-[0.2em] uppercase flex items-center gap-2">
                            <Download size={14} className="text-cyber-green" /> Analytics
                        </h2>
                        <p className="text-xs font-mono text-cyber-text/60 mb-6 leading-relaxed">
                            Generate encrypted PDF report of node traffic and user-agent analytics.
                        </p>
                        <button
                            onClick={() => {
                                const reportData = {
                                    linkHits: data.links.map(l => ({
                                        title: l.title,
                                        url: l.originalUrl,
                                        hits: l.analytics?.clicks || 0,
                                        lastAccessed: new Date().toISOString().split('T')[0]
                                    })),
                                    userLocations: [
                                        { country: 'Global', city: 'Node_Entry', count: data.links.reduce((a,b)=>a+(b.analytics?.clicks||0), 0) }
                                    ],
                                    timestamp: new Date().toLocaleString()
                                };
                                downloadStatsReport(reportData);
                            }}
                            className="w-full glass-green text-cyber-green py-3 rounded-lg font-mono font-bold hover:bg-cyber-green hover:text-black transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={16} /> Download PDF
                        </button>
                    </section>
                </div>

                {/* Right Column: Links Manager */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5">
                        <div>
                            <h2 className="text-xl font-mono text-white font-bold flex items-center gap-3">
                                <Globe size={20} className="text-cyber-green" /> Links
                            </h2>
                            <p className="text-xs text-cyber-text-muted font-mono mt-1">{data.links.length} Active</p>
                        </div>
                        <button
                            onClick={() => { setEditingLink(null); setIsEditorOpen(true); }}
                            className="bg-cyber-green text-black px-6 py-3 rounded-xl font-mono fontWeight-bold hover:bg-white transition-all shadow-cyber flex items-center gap-2"
                        >
                            <Plus size={18} /> Add Link
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {isEditorOpen ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass p-8 rounded-3xl border-cyber-green/30"
                            >
                                <LinkEditor
                                    initialLink={editingLink || undefined}
                                    onSave={handleSaveLink}
                                    onCancel={() => setIsEditorOpen(false)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {data.links.map((link, idx) => (
                                    <motion.div 
                                        key={link._id} 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-cyber-green/40 duration-500"
                                    >
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            {link.imageUrl ? (
                                                <img src={link.imageUrl} alt={link.title} className="w-14 h-14 rounded-xl object-cover border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-cyber-green/5 border border-white/5 flex items-center justify-center text-cyber-green">
                                                    <Globe size={24} />
                                                </div>
                                            )}
                                            <div className="truncate">
                                                <h3 className="font-mono text-white font-black text-xl tracking-tight group-hover:text-cyber-green transition-colors">{link.title}</h3>
                                                <p className="font-mono text-cyber-text-muted text-[10px] mt-1 truncate max-w-sm lowercase">&gt; {link.originalUrl}</p>
                                                
                                                <div className="flex gap-2 mt-3 flex-wrap">
                                                    {link.rules.length > 0 ? link.rules.map((r, i) => (
                                                        <span key={i} className="text-[9px] bg-cyber-accent/10 text-cyber-accent px-2 py-0.5 rounded-full border border-cyber-accent/20 font-mono flex items-center gap-1 uppercase">
                                                            {r.type === 'time' && <Clock size={10} />}
                                                            {r.type === 'device' && <Smartphone size={10} />}
                                                            {r.type}
                                                        </span>
                                                    )) : (
                                                        <span className="text-[9px] bg-white/5 text-cyber-text-muted px-2 py-0.5 rounded-full border border-white/5 font-mono uppercase">Unrestricted</span>
                                                    )}
                                                    <span className="text-[9px] bg-cyber-green/5 text-cyber-green px-2 py-0.5 rounded-full border border-cyber-green/10 font-mono">P:{link.priority}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                            <div className="text-right">
                                                <div className="text-3xl font-mono text-white font-black flex items-center justify-end gap-2">
                                                    {link.analytics?.clicks || 0} 
                                                    <MousePointer size={18} className="text-cyber-green animate-pulse" />
                                                </div>
                                                <p className="text-[10px] text-cyber-text-muted font-mono tracking-widest uppercase">Traffic_Hits</p>
                                            </div>
                                            <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingLink(link); setIsEditorOpen(true); }}
                                                    className="p-3 glass hover:text-cyber-green hover:border-cyber-green rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLink(link._id)}
                                                    className="p-3 glass hover:text-red-500 hover:border-red-500 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {data.links.length === 0 && (
                                    <div className="text-center py-20 glass border-dashed border-white/5 rounded-3xl text-cyber-text-muted font-mono">
                                        &gt; No links added yet
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default HubManager;
