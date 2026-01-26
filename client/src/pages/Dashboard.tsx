import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Layout as LayoutIcon, ExternalLink, Settings, BarChart3, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

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

    return (
        <Layout>
            <div className="min-h-screen p-6 md:p-12">
                <header className="flex justify-between items-center mb-12 border-b border-cyber-green/20 pb-6">
                    <div>
                        <h1 className="text-3xl font-mono text-cyber-green font-bold flex items-center gap-3 tracking-tight">
                            <Activity className="animate-pulse" /> Smart Link Hub
                        </h1>
                        <p className="text-cyber-text-muted text-xs font-mono mt-1 opacity-70">
                            &gt; Authenticated session active.
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-cyber-text hover:text-red-500 font-mono text-sm border border-transparent hover:border-red-500/50 px-3 py-1 rounded transition-all"
                    >
                        [ TERMINATE_SESSION ]
                    </button>
                </header>

                <div className="max-w-6xl mx-auto">
                    {/* Actions */}
                    <div className="mb-10">
                        {!isCreating ? (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="bg-cyber-green text-black px-6 py-3 rounded hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all font-mono font-bold flex items-center gap-2"
                            >
                                <Plus size={20} /> DEPLOY_NEW_HUB
                            </button>
                        ) : (
                            <form onSubmit={handleCreateHub} className="flex gap-4 items-end bg-cyber-dark-gray border border-cyber-green p-6 rounded-xl shadow-cyber max-w-2xl animate-in fade-in slide-in-from-top-4">
                                <div className="flex-1">
                                    <label className="block text-cyber-green font-mono text-sm mb-2">&gt; ENTER_SLUG_IDENTIFIER</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-cyber-text-muted font-mono">hub/</span>
                                        <input
                                            type="text"
                                            value={newHubSlug}
                                            onChange={e => setNewHubSlug(e.target.value)}
                                            placeholder="my-portfolio"
                                            className="flex-1 bg-black border border-cyber-text-muted/30 focus:border-cyber-green text-white p-2 rounded focus:outline-none font-mono"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="bg-cyber-green text-black px-6 py-2 rounded font-mono font-bold hover:brightness-110">
                                    INITIALIZE
                                </button>
                                <button type="button" onClick={() => setIsCreating(false)} className="text-cyber-text hover:text-white font-mono px-4">
                                    ABORT
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Hubs Grid - CSS Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hubs.map(hub => (
                            <div key={hub._id} className="bg-cyber-dark-gray/50 backdrop-blur-sm border border-cyber-text-muted/10 rounded-xl p-6 hover:border-cyber-green/50 hover:shadow-cyber transition-all duration-300 group flex flex-col justify-between h-64">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                                            <LayoutIcon className="text-cyber-green" size={24} />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-mono text-cyber-text-muted mb-1">TRAFFIC_STATS</span>
                                            {/* Data Visualization: Mini Sparkline / Bar representation */}
                                            <div className="flex items-end gap-1 h-8 w-24 justify-end">
                                                <div className="w-1 bg-cyber-green/30 h-[20%]"></div>
                                                <div className="w-1 bg-cyber-green/50 h-[40%]"></div>
                                                <div className="w-1 bg-cyber-green/40 h-[30%]"></div>
                                                <div className="w-1 bg-cyber-green/80 h-[70%]"></div>
                                                <div className="w-1 bg-cyber-green h-[100%]"></div>
                                            </div>
                                            <span className="text-2xl font-bold font-mono text-white mt-1 shadow-black drop-shadow-md">
                                                {hub.stats.totalViews} <span className="text-xs font-normal text-cyber-text-muted">HITS</span>
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl text-white font-sans font-bold tracking-wide group-hover:text-cyber-green transition-colors">
                                        @{hub.slug}
                                    </h3>
                                    <p className="text-cyber-text-muted/60 text-xs font-mono mt-1 truncate">
                                        id: {hub._id}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <Link
                                        to={`/admin/hub/${hub.slug}`}
                                        className="bg-white/5 hover:bg-cyber-green hover:text-black text-cyber-green border border-cyber-green/20 py-2 rounded text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Settings size={14} /> CONFIGURE
                                    </Link>
                                    <a
                                        href={`/h/${hub.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-black/20 hover:bg-white/10 text-cyber-text py-2 rounded text-xs font-mono transition-all flex items-center justify-center gap-2 border border-white/5"
                                    >
                                        <ExternalLink size={14} /> VIEW_LIVE
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hubs.length === 0 && !isCreating && (
                        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-cyber-text-muted/20 rounded-xl bg-black/20">
                            <BarChart3 className="text-cyber-text-muted/20 w-16 h-16 mb-4" />
                            <div className="text-cyber-text-muted font-mono">
                                &gt; NO_ACTIVE_DEPLOYMENTS_FOUND
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="mt-4 text-cyber-green hover:underline font-mono text-sm"
                            >
                                [ INITIALIZE_FIRST_HUB ]
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
