import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Zap, Sparkles, Layout, Smartphone } from 'lucide-react';
import heroImage from '../assets/hero_minimal.png';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Header/Navbar */}
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/10"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/20">
                        <Sparkles className="text-white w-full h-full" />
                    </div>
                    <span className="font-sans font-bold text-xl tracking-tight">SmartLink</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
                    <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                </div>

                <Link 
                    to="/register" 
                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                    Launch App
                </Link>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
                >
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 max-w-4xl"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                        The Future of Personal Hubs
                    </span>
                    <h1 className="text-5xl md:text-8xl font-sans font-black tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Everything you are.<br />In one simple link.
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The most minimalist way to share your digital identity. Beautifully designed, blazingly fast, and completely private.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/register" 
                            className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
                        >
                            Claim your hub <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to="/login" 
                            className="w-full sm:w-auto text-white border border-white/20 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/5 transition-all"
                        >
                            Explore Demo
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Asset */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-10 mt-20 max-w-6xl w-full"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl rounded-[3rem]"></div>
                        <img 
                            src={heroImage} 
                            alt="Smart Link Hub Abstract Visual" 
                            className="rounded-[2.5rem] border border-white/10 shadow-2xl shadow-blue-500/10 w-full object-cover"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="text-blue-500 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Blazing Fast</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Built on the edge for sub-second load times. Your profile loads instantly, anywhere in the world.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="text-purple-500 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Privacy Focused</h3>
                        <p className="text-gray-400 leading-relaxed">
                            No trackers, no cookies. Just your content delivered securely to your audience.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Layout className="text-amber-500 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Custom Themes</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Minimalist designs that put your work front and center. Choose from a curated set of premium themes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Showcase Section */}
            <section id="showcase" className="py-24 border-t border-white/5 bg-gradient-to-b from-black to-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tight">
                                Designed for all your screens.
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                Whether on a desktop or a phone, your SmartLink hub looks impeccable. We focus on accessibility and responsiveness so you don't have to.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { icon: Smartphone, text: 'Native-feel mobile navigation' },
                                    { icon: Layout, text: 'Beautiful desktop layouts' },
                                    { icon: Sparkles, text: 'Retina-ready iconography' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-gray-300">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full max-w-sm">
                            <div className="relative aspect-[9/19] rounded-[3rem] border-8 border-white/10 bg-black shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-white/10 rounded-b-2xl"></div>
                                <div className="p-8 mt-12 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto"></div>
                                    <div className="w-24 h-4 rounded-full bg-white/10 mx-auto"></div>
                                    <div className="space-y-3 mt-12">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-full h-12 rounded-2xl bg-white/5 border border-white/5"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-blue-600 to-purple-700 p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                    >
                        <h2 className="text-4xl md:text-7xl font-sans font-black tracking-tight mb-8">
                            Ready to simplify your links?
                        </h2>
                        <Link 
                            to="/register" 
                            className="inline-block bg-white text-black px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl active:scale-95"
                        >
                            Get Started Now
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-gray-500 text-sm text-center">
                <p>&copy; {new Date().getFullYear()} SmartLink Hub. All rights reserved.</p>
                <div className="mt-4 flex items-center justify-center gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
