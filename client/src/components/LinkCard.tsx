import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Camera, MousePointer2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LinkCardProps {
    title: string;
    url: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    showClickCount?: boolean;
    clickCount?: number;
    imageUrl?: string;
    isOwner?: boolean;
    onUploadImage?: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({
    title,
    url,
    onClick,
    className,
    showClickCount = false,
    clickCount = 0,
    imageUrl,
    isOwner = false,
    onUploadImage
}) => {
    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={twMerge(
                clsx(
                    "group relative flex items-center justify-between p-5 mb-5 rounded-2xl",
                    "glass border-white/5",
                    "hover:border-cyber-green/40 hover:glass-green",
                    "transition-all duration-500 cursor-pointer overflow-hidden",
                    className
                )
            )}
            onClick={onClick}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Animated Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>

            <div className="flex items-center space-x-6 z-10 w-full min-w-0">
                {/* Visual Identity Section */}
                <div className="relative shrink-0">
                    {imageUrl ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 group-hover:border-cyber-green/50 shadow-2xl transition-all duration-500 group-hover:scale-105">
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-14 h-14 flex items-center justify-center bg-cyber-green/5 rounded-xl text-cyber-green border border-cyber-green/10 group-hover:bg-cyber-green group-hover:text-black transition-all duration-300">
                            <ExternalLink size={24} />
                        </div>
                    )}

                    {/* Owner Action: Image Metadata Update */}
                    {isOwner && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onUploadImage?.();
                            }}
                            className="absolute -top-2 -right-2 bg-cyber-black text-cyber-green p-1.5 rounded-full border border-cyber-green/20 opacity-0 group-hover:opacity-100 hover:scale-110 hover:border-cyber-green transition-all shadow-cyber z-20"
                        >
                            <Camera size={10} />
                        </button>
                    )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-sans font-black text-xl tracking-tight text-white group-hover:text-cyber-green transition-colors truncate uppercase">
                        {title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-cyber-text-muted font-mono truncate opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                            {(() => {
                                try {
                                    let formattedUrl = url.trim();
                                    if (!/^https?:\/\//i.test(formattedUrl)) {
                                        formattedUrl = 'https://' + formattedUrl;
                                    }
                                    return new URL(formattedUrl).hostname;
                                } catch (e) {
                                    return url;
                                }
                            })()}
                        </span>
                    </div>
                </div>
            </div>

            {showClickCount && (
                <div className="z-10 ml-4 flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-2 text-white font-mono font-bold text-lg">
                        {clickCount}
                        <MousePointer2 size={14} className="text-cyber-green" />
                    </div>
                    <span className="text-[8px] font-mono text-cyber-text-muted uppercase tracking-tighter opacity-40">Clicks</span>
                </div>
            )}
            
            {/* Border glow on hover */}
            <div className="absolute inset-0 border border-cyber-green/0 group-hover:border-cyber-green/20 rounded-2xl transition-all duration-500"></div>
        </motion.a>
    );
};

export default LinkCard;
