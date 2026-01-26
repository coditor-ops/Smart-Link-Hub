import React, { useEffect, useRef } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const columns = Math.floor(canvas.width / 20);
        const drops: number[] = new Array(columns).fill(1);
        const chars = '01'; // Binary rain for cyberpunk feel

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; // Fade effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0'; // Green text
            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-cyber-black text-cyber-text overflow-hidden font-sans selection:bg-cyber-green selection:text-cyber-black">
            {/* Animated Background */}
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0"
            />

            {/* Scanline Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>

            {/* Content */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
};

export default Layout;
