import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-black border border-cyber-green p-8 rounded-lg shadow-cyber">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-cyber-green/10 rounded-full border border-cyber-green">
                        <Lock className="w-8 h-8 text-cyber-green" />
                    </div>
                </div>
                <h2 className="text-2xl font-mono font-bold text-center text-cyber-green mb-8">ACCESS_TERMINAL</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 font-mono text-sm">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-cyber-text font-mono text-sm mb-2">EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-cyber-black border border-cyber-green/50 text-cyber-text p-3 rounded focus:border-cyber-green focus:outline-none font-mono"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-cyber-text font-mono text-sm mb-2">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-cyber-black border border-cyber-green/50 text-cyber-text p-3 rounded focus:border-cyber-green focus:outline-none font-mono"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-cyber-green text-black font-bold py-3 rounded hover:opacity-90 transition-opacity font-mono tracking-widest"
                    >
                        LOGIN
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/register" className="text-cyber-green/70 hover:text-cyber-green text-sm font-mono">
                            [ CREATE_NEW_ACCOUNT ]
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
