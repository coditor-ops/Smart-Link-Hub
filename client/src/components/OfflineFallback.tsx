import React, { useEffect, useState } from 'react';
import { WifiOff, Activity } from 'lucide-react';

const OfflineFallback: React.FC = () => {
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRetryCount(prev => (prev + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-[#00ff41] font-mono">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#00ff41] blur-xl opacity-20 animate-pulse" />
                <WifiOff size={64} className="relative z-10" />
            </div>

            <h2 className="text-2xl font-bold tracking-widest mb-4 glitch-text">
                CONNECTION LOST
            </h2>

            <div className="border border-[#00ff41]/30 bg-black/50 p-6 rounded-lg max-w-md w-full backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4 text-[#ff003c]">
                    <Activity className="animate-pulse" />
                    <span>NEURAL LINK INTERRUPTED</span>
                </div>

                <div className="space-y-2 text-sm text-[#00ff41]/80">
                    <p>{`> DIAGNOSTIC: SIGNAL_LOSS`}</p>
                    <p>{`> PING: UNREACHABLE`}</p>
                    <p className="flex items-center gap-2">
                        {`> ATTEMPTING RECONNECT`}
                        <span className="inline-block">
                            {'.'.repeat(retryCount)}
                        </span>
                    </p>
                </div>

                <div className="mt-6 border-t border-[#00ff41]/20 pt-4">
                    <p className="text-xs text-[#00ff41]/50 text-center uppercase tracking-widest">
                        Cached Shell Available // Functionality Limited
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OfflineFallback;
