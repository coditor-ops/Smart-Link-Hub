import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface HubQRCodeProps {
    url: string;
    size?: number;
}

const HubQRCode: React.FC<HubQRCodeProps> = ({ url, size = 180 }) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        if (!qrRef.current) return;
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'hub-access-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center group">
            <div className="relative p-8 mb-6">
                {/* Cyber Frame Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-green rounded-tl-lg shadow-[0_0_15px_rgba(0,255,65,0.4)]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-green rounded-tr-lg shadow-[0_0_15px_rgba(0,255,65,0.4)]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-green rounded-bl-lg shadow-[0_0_15px_rgba(0,255,65,0.4)]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-green rounded-br-lg shadow-[0_0_15px_rgba(0,255,65,0.4)]" />

                {/* Scanning Animation Line */}
                <motion.div 
                    className="absolute left-4 right-4 h-[2px] bg-cyber-green/40 shadow-[0_0_20px_#00ff41] z-10 pointer-events-none"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* QR Container */}
                <div
                    ref={qrRef}
                    className="relative z-0 p-2 bg-black/80 rounded-lg border border-cyber-green/10"
                >
                    <QRCodeCanvas
                        value={url}
                        size={size}
                        bgColor="transparent"
                        fgColor="#00ff41"
                        level="H"
                        includeMargin={false}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-1.5 glass rounded-full border-cyber-green/20">
                    <Terminal size={12} className="text-cyber-green animate-pulse" />
                    <span className="text-[10px] font-mono text-cyber-green tracking-[0.2em] font-black uppercase">
                        Access_Active
                    </span>
                </div>

                <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 group-hover:text-white text-cyber-text-muted font-mono text-[10px] hover:underline transition-all"
                >
                    <Download size={14} /> Download Image
                </button>
            </div>
        </div>
    );
};

export default HubQRCode;
