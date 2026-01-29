import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Removed unused import
import api from '../services/api';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { username, email, password });
            // Instead of auto-login, redirect to login page with success message
            navigate('/login', {
                state: { message: 'Registration successful! Please login to continue.' }
            });
        } catch (err: any) {
            setError(
                err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.message ||
                'Registration failed'
            );
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-black border border-cyber-green p-8 rounded-lg shadow-cyber">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-cyber-green/10 rounded-full border border-cyber-green">
                        <UserPlus className="w-8 h-8 text-cyber-green" />
                    </div>
                </div>
                <h2 className="text-2xl font-mono font-bold text-center text-cyber-green mb-8">INIT_USER_PROTOCOL</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 font-mono text-sm">
                        Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-cyber-text font-mono text-sm mb-2">USERNAME</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-cyber-black border border-cyber-green/50 text-cyber-text p-3 rounded focus:border-cyber-green focus:outline-none font-mono"
                            required
                        />
                    </div>
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
                        className="w-full bg-cyber-green text-black font-bold py-3 rounded hover:bg-white hover:text-black transition-all font-mono tracking-widest"
                    >
                        REGISTER
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-cyber-green/70 hover:text-cyber-green text-sm font-mono">
                            [ RETURN_TO_LOGIN ]
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
