import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(
                err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.message ||
                'Login failed'
            );
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyber-green/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass p-10 rounded-3xl border-white/5 relative"
            >
                <div className="flex justify-center mb-10">
                    <div className="p-4 glass-green rounded-2xl border-cyber-green/30 text-cyber-green relative group">
                        <Lock className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-cyber-green/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                
                <h2 className="text-3xl font-mono font-black text-center text-white mb-10 tracking-tighter uppercase text-glow">
                    Login
                </h2>

                {message && (
                    <div className="glass-green border-green-500/30 text-green-400 p-4 rounded-xl mb-6 font-mono text-xs flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="glass border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-mono text-xs flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-cyber-text-muted font-mono text-[10px] mb-2 tracking-widest uppercase opacity-50">Email</label>
                        <input
                            type="email"
                            placeholder="user@network.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-cyber-green focus:outline-none font-mono text-sm transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-cyber-text-muted font-mono text-[10px] mb-2 tracking-widest uppercase opacity-50">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 text-white p-4 rounded-xl focus:border-cyber-green focus:outline-none font-mono text-sm transition-all"
                            required
                        />
                    </div>
                    
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-cyber-green text-black font-black py-4 rounded-xl transition-all font-mono tracking-[0.2em] text-sm shadow-cyber"
                    >
                        Login
                    </motion.button>

                    <div className="text-center mt-8 pt-4 border-t border-white/5">
                        <Link to="/register" className="text-cyber-text-muted hover:text-cyber-green text-xs font-mono transition-colors uppercase tracking-widest">
                            [ Create Account ]
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
