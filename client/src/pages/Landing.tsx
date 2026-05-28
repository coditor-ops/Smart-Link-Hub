import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, BarChart3, Zap, ChevronRight } from 'lucide-react';
import WaterRevealText from '../components/WaterRevealText';

// Floating animation wrapper using framer-motion
const FloatWrapper: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};

// Glass Card wrapper
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transition-all duration-300 hover:border-neon ${className}`}>
      {children}
    </div>
  );
};

const Landing: React.FC = () => {
  const mockFeatures = [
    {
      title: "Dynamic Resolution",
      description: "Intelligently routes traffic based on device, OS, and browser for a seamless user experience.",
      icon: Smartphone,
      delay: 0,
    },
    {
      title: "Global Analytics",
      description: "Real-time tracking of every click with deep geolocation and referral insights.",
      icon: BarChart3,
      delay: 0.5,
    },
    {
      title: "Automated Workflows",
      description: "Connect your links to n8n, Zapier, or custom webhooks for powerful automation.",
      icon: Zap,
      delay: 1,
    }
  ];

  return (
    <div className="bg-void text-white min-h-screen overflow-x-hidden selection:bg-neon/30 antialiased font-body relative">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-muted rounded-full blur-[120px] pointer-events-none -z-0"></div>

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:scale-105 transition-transform">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-neon drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Center node */}
              <circle cx="25" cy="50" r="12" stroke="currentColor" strokeWidth="4" />
              
              {/* Top branch */}
              <path d="M 35 43 L 55 25 L 70 25" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" fill="none" />
              <circle cx="77" cy="25" r="7" stroke="currentColor" strokeWidth="4" />
              
              {/* Middle branch */}
              <path d="M 37 50 L 70 50" stroke="currentColor" strokeWidth="4" fill="none" />
              <circle cx="77" cy="50" r="7" stroke="currentColor" strokeWidth="4" />
              
              {/* Bottom branch */}
              <path d="M 35 57 L 55 75 L 70 75" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" fill="none" />
              <circle cx="77" cy="75" r="7" stroke="currentColor" strokeWidth="4" />
            </svg>
            <span className="text-xl md:text-3xl font-black tracking-tight font-headline flex items-center">
              <span className="text-white">Smart</span>
              <span className="text-neon drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">Hub</span>
            </span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-neon font-bold tracking-tight">
              Features
            </a>
            <a href="#problem-solution" className="text-on-surface-variant font-medium hover:text-neon transition-all duration-300 tracking-tight">
              Approach
            </a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/login" className="text-[#d1c1d9] font-medium hover:text-[#dfb7ff] transition-all duration-300 active:scale-95 text-sm md:text-base">
              Login
            </Link>
            <Link 
              to="/register"
              className="kinetic-gradient text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-bold hover:scale-105 transition-all text-center flex items-center justify-center shadow-neon-glow text-sm md:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left Side: Copy */}
          <div className="space-y-8">
            <div className="space-y-6 pt-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight font-headline leading-[1.1] relative z-20">
                <WaterRevealText delay={0.1}>
                  <div className="flex flex-col items-start gap-1">
                    <span>Intelligent Routing.</span>
                    <span className="text-neon">Automated.</span>
                  </div>
                </WaterRevealText>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
                Experience the future of link management. Building the ultimate pulse for the kinetic void, one connection at a time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/register" 
                className="group px-8 py-4 bg-void/50 rounded-xl border border-neon text-white font-bold transition-all hover:scale-105 hover:shadow-neon-glow flex items-center justify-center gap-2"
              >
                Start for Free
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Side: Code Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <FloatWrapper delay={0.2}>
              <GlassCard className="w-full max-w-[500px] overflow-hidden border-neon/20 bg-void/40 backdrop-blur-md">
                <div className="p-1 bg-white/5 border-b border-white/10 flex items-center gap-2 px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest ml-2">router_logic.py</span>
                </div>
                <div className="p-8 font-mono text-sm space-y-3 relative z-10">
                  <div className="text-gray-500 italic mb-4">{"// Define smart redirection rules"}</div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">01</span>
                    <span><span className="text-neon">if</span> (request.device === <span className="text-white">{"'mobile'"}</span>):</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">02</span>
                    <span className="pl-6 text-gray-300">redirect_to(<span className="text-neon">{"'/app/ios-store'"}</span>)</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">03</span>
                    <span><span className="text-neon">elif</span> (request.region === <span className="text-white">{"'EU'"}</span>):</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">04</span>
                    <span className="pl-6 text-gray-300">apply_gdpr_routing(<span className="text-neon">{"'/eu-node'"}</span>)</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">05</span>
                    <span><span className="text-neon">else</span>:</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">06</span>
                    <span className="pl-6 text-gray-300">use_default_gateway(<span className="text-neon">{"'/global'"}</span>)</span>
                  </div>
                </div>
              </GlassCard>
            </FloatWrapper>

            {/* Decorative corners */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l-2 border-b-2 border-neon/30 -z-10"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 border-r-2 border-t-2 border-neon/30 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="problem-solution" className="py-24 px-6 lg:px-12 bg-black relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <GlassCard className="p-10 space-y-6 bg-void/50 border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <span className="text-red-500 font-bold">!</span>
                </div>
                <h2 className="text-3xl font-bold text-white font-headline tracking-tight">The Problem</h2>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Modern digital campaigns are fragmented. Users click links on various devices, regions, and platforms, often landing on unoptimized pages or dead ends. Without intelligent routing, conversion rates drop and valuable analytics are lost in the void.
              </p>
            </GlassCard>
            
            <GlassCard className="p-10 space-y-6 bg-neon/5 border-neon/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon/20 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center border border-neon/30">
                  <Zap className="w-5 h-5 text-neon" />
                </div>
                <h2 className="text-3xl font-bold text-neon font-headline tracking-tight">Our Solution</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg relative z-10">
                SmartHub acts as the central intelligence node for all incoming traffic. By instantly analyzing device type, geolocation, and intent, it dynamically routes every click to its optimal destination, ensuring seamless user journeys and rich analytics.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-12 bg-void/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockFeatures.map((feature, index) => (
              <FloatWrapper key={index} delay={feature.delay}>
                <GlassCard className="p-10 h-full flex flex-col items-start gap-6 border-white/5 hover:border-neon transition-all bg-void/30">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <feature.icon className="w-8 h-8 text-neon" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white font-headline tracking-tight">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </FloatWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-void">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-700 text-[10px] sm:text-[12px] uppercase tracking-[0.3em] font-medium scale-y-110">
            © {new Date().getFullYear()} SmartHub. Intelligent Routing System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
