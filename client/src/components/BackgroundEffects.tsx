import React, { useEffect, useRef } from 'react';


interface BackgroundEffectsProps {
    effect: 'none' | 'matrix' | 'particles' | 'rain' | 'glitch' | 'fog';
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ effect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationFrameId: number;

        if (effect === 'matrix') {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+'.split('');
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops: number[] = [];
            for (let x = 0; x < columns; x++) drops[x] = 1;

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';
                for (let i = 0; i < drops.length; i++) {
                    const text = characters[Math.floor(Math.random() * characters.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
                animationFrameId = requestAnimationFrame(draw);
            };
            draw();
        } else if (effect === 'particles') {
            const particlesArray: any[] = [];
            for (let i = 0; i < 100; i++) {
                particlesArray.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: Math.random() * 2 - 1,
                    speedY: Math.random() * 2 - 1
                });
            }
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
                particlesArray.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    p.x += p.speedX;
                    p.y += p.speedY;
                    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
                });
                animationFrameId = requestAnimationFrame(draw);
            };
            draw();
        } else if (effect === 'rain') {
            const dropsArray: any[] = [];
            for (let i = 0; i < 200; i++) {
                dropsArray.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    length: Math.random() * 20 + 10,
                    speed: Math.random() * 5 + 5
                });
            }
            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                dropsArray.forEach(p => {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length);
                    ctx.stroke();
                    p.y += p.speed;
                    if (p.y > canvas.height) {
                        p.y = -p.length;
                        p.x = Math.random() * canvas.width;
                    }
                });
                animationFrameId = requestAnimationFrame(draw);
            };
            draw();
        } else if (effect === 'fog') {
            // Very simple pseudo-fog using moving gradient blobs
            const blobs = Array.from({length: 5}).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 200 + 200,
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2
            }));
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                blobs.forEach(b => {
                    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
                    grad.addColorStop(0, 'rgba(255,255,255,0.08)');
                    grad.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
                    ctx.fill();
                    b.x += b.dx;
                    b.y += b.dy;
                    if(b.x < -b.radius || b.x > canvas.width + b.radius) b.dx *= -1;
                    if(b.y < -b.radius || b.y > canvas.height + b.radius) b.dy *= -1;
                });
                animationFrameId = requestAnimationFrame(draw);
            };
            draw();
        }

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [effect]);

    if (effect === 'none') return null;

    if (effect === 'glitch') {
        return (
            <div className="absolute inset-0 z-[-5] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay glitch-layer"></div>
                <style>{`
                    @keyframes glitch-anim {
                        0% { transform: translate(0) }
                        20% { transform: translate(-2px, 2px) }
                        40% { transform: translate(-2px, -2px) }
                        60% { transform: translate(2px, 2px) }
                        80% { transform: translate(2px, -2px) }
                        100% { transform: translate(0) }
                    }
                    .glitch-layer {
                        animation: glitch-anim 0.2s infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-[-5] pointer-events-none opacity-50"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default BackgroundEffects;
