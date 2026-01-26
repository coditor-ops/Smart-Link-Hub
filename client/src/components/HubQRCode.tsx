import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';

interface HubQRCodeProps {
    url: string;
}

const HubQRCode: React.FC<HubQRCodeProps> = ({ url }) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        if (!qrRef.current) return;

        // Find the canvas element
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        // Convert to data URL and download
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'smart-link-hub-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-md border border-[#00ff41]/20 rounded-xl shadow-[0_0_15px_rgba(0,255,65,0.1)]">
            <div className="flex items-center gap-2 text-[#00ff41] mb-2">
                <Share2 size={20} />
                <h3 className="font-mono text-lg tracking-wider">HUB ACCESS CODE</h3>
            </div>

            {/* QR Container - White background for readability */}
            <div
                ref={qrRef}
                className="p-4 bg-white rounded-lg shadow-lg"
            >
                <QRCodeCanvas
                    value={url}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={false}
                />
            </div>

            <button
                onClick={downloadQRCode}
                className="group relative px-6 py-2 mt-2 font-mono text-sm font-bold text-black bg-[#00ff41] rounded-md overflow-hidden transition-all hover:bg-[#00cc33] hover:shadow-[0_0_20px_rgba(0,255,65,0.6)] active:scale-95"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform skew-y-12" />
                <span className="relative flex items-center gap-2">
                    <Download size={16} />
                    DOWNLOAD QR_ENTITY
                </span>
            </button>

            <div className="text-xs text-green-500/60 font-mono mt-1">
                Scan to access neural link
            </div>
        </div>
    );
};

export default HubQRCode;
