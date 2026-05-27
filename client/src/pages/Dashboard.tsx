import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Layout as LayoutIcon, ExternalLink, Settings, BarChart3, Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

interface Hub {
    _id: string;
    slug: string;
    stats: {
        totalViews: number;
    }
}

const Dashboard: React.FC = () => {
    const [hubs, setHubs] = useState<Hub[]>([]);
    const [newHubSlug, setNewHubSlug] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { logout } = useAuth();

    useEffect(() => {
        fetchHubs();
    }, []);

    const fetchHubs = async () => {
        try {
            const res = await api.get('/hubs/me');
            setHubs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateHub = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/hubs', { slug: newHubSlug });
            setHubs([...hubs, res.data]);
            setNewHubSlug('');
            setIsCreating(false);
        } catch (err) {
            alert('Failed to create hub. Slug might be taken.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <Layout>
            <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <h1 className="text-4xl font-mono text-cyber-green font-bold flex items-center gap-4 tracking-tighter text-glow">
                            <Activity className="animate-pulse text-cyber-accent" size={32} /> 
                            Smart Link Hub
                        </h1>
                        <p className="text-cyber-text-muted text-xs font-mono mt-2 opacity-60 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping"></span>
                           &gt; Session Active
                        </p>
                    </motion.div>
                    
                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="glass border-red-500/20 text-cyber-text hover:text-red-400 font-mono text-xs px-5 py-2 rounded-full transition-all flex items-center gap-2 group"
                    >
                        <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
                        Logout
                    </motion.button>
                </header>

                <div>
                    {/* Actions Area */}
                    <div className="mb-12">
                        <AnimatePresence mode="wait">
                            {!isCreating ? (
                                <motion.button
                                    key="create-btn"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)' }}
                                    onClick={() => setIsCreating(true)}
                                    className="bg-cyber-green text-black px-8 py-4 rounded-xl shadow-cyber transition-all font-mono font-bold flex items-center gap-3 text-lg"
                                >
                                    <Plus size={24} /> New Hub
                                </motion.button>
                            ) : (
                                <motion.form 
                                    key="create-form"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleCreateHub} 
                                    className="glass-green p-8 rounded-2xl max-w-2xl border-cyber-green/30"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-end">
                                        <div className="flex-1">
                                            <label className="block text-cyber-green font-mono text-sm mb-3">&gt; Slug</label>
                                            <div className="flex items-center gap-3 bg-black/40 p-1 rounded-lg border border-white/5 focus-within:border-cyber-green/50 transition-colors">
                                                <span className="text-cyber-text-muted font-mono pl-3 text-sm">hub/</span>
                                                <input
                                                    type="text"
                                                    value={newHubSlug}
                                                    onChange={e => setNewHubSlug(e.target.value)}
                                                    placeholder="portfolio-2024"
                                                    className="flex-1 bg-transparent text-white p-3 focus:outline-none font-mono text-lg"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 flex-col md:flex-row">
                                            <button type="submit" className="bg-cyber-green text-black px-8 py-3 rounded-lg font-mono font-bold hover:bg-white transition-all">
                                                Create
                                            </button>
                                            <button type="button" onClick={() => setIsCreating(false)} className="glass px-6 py-3 rounded-lg font-mono text-cyber-text hover:bg-white/10 transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Stats Summary Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-cyber-text-muted text-xs font-mono uppercase tracking-widest">Active Hubs</p>
                                <h4 className="text-3xl font-mono font-bold text-white mt-1">{hubs.length}</h4>
                            </div>
                            <div className="p-3 rounded-xl bg-cyber-green/10 text-cyber-green">
                                <LayoutIcon size={24} />
                            </div>
                        </div>
                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-cyber-text-muted text-xs font-mono uppercase tracking-widest">Total Traffic</p>
                                <h4 className="text-3xl font-mono font-bold text-white mt-1">
                                    {hubs.reduce((acc, h) => acc + (h.stats?.totalViews || 0), 0)}
                                </h4>
                            </div>
                            <div className="p-3 rounded-xl bg-cyber-accent/10 text-cyber-accent">
                                <Activity size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Hubs Grid */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {hubs.map(hub => (
                            <motion.div 
                                key={hub._id} 
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="glass group rounded-2xl overflow-hidden hover:border-cyber-green/40 transition-all duration-500 relative flex flex-col justify-between"
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="bg-cyber-green/10 p-4 rounded-xl border border-cyber-green/20 group-hover:border-cyber-green group-hover:bg-cyber-green/20 transition-all">
                                            <LayoutIcon className="text-cyber-green" size={28} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-mono text-cyber-text-muted mb-1 tracking-tighter opacity-50">Views</p>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-16 bg-white/5 rounded overflow-hidden flex items-end gap-[1px] p-[2px]">
                                                    {[20, 45, 30, 70, 40, 90].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-cyber-green/40 group-hover:bg-cyber-green transition-all" style={{ height: `${h}%` }}></div>
                                                    ))}
                                                </div>
                                                <span className="text-2xl font-bold font-mono text-white text-glow">
                                                    {hub.stats?.totalViews || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-2xl text-white font-sans font-black tracking-tight mb-2 group-hover:text-cyber-green transition-colors">
                                        @{hub.slug}
                                    </h3>
                                    <div className="w-12 h-1 bg-cyber-green/30 group-hover:w-full transition-all duration-700"></div>
                                    <p className="text-cyber-text-muted/40 font-mono text-[10px] mt-4 uppercase tracking-tighter">
                                        Node_Ref: {hub._id}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 p-6 gap-4 bg-white/5 border-t border-white/5 transition-colors group-hover:bg-cyber-green/5">
                                    <Link
                                        to={`/admin/hub/${hub.slug}`}
                                        className="bg-cyber-green text-black py-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 hover:bg-white"
                                    >
                                        <Settings size={14} /> Edit
                                    </Link>
                                    <a
                                        href={`/h/${hub.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="glass text-cyber-text py-3 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 hover:bg-white/10"
                                    >
                                        <ExternalLink size={14} /> View
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {hubs.length === 0 && !isCreating && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 glass rounded-3xl border-dashed border-white/10"
                        >
                            <BarChart3 className="text-cyber-text-muted/10 w-24 h-24 mb-6" />
                            <div className="text-cyber-text-muted font-mono text-xl">
                                &gt; No active hubs found
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="mt-8 text-cyber-green hover:text-white font-mono text-sm underline-offset-8 underline"
                            >
                                [ Create your first hub ]
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
