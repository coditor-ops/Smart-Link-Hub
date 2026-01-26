import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Camera } from 'lucide-react';
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
    icon,

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
                    "group relative flex items-center justify-between p-4 mb-4 rounded-xl",
                    "bg-cyber-black/40 backdrop-blur-md border border-white/5",
                    "hover:border-cyber-green/50 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]",
                    "transition-all duration-300 cursor-pointer overflow-hidden",
                    className
                )
            )}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-green/0 via-cyber-green/5 to-cyber-green/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

            <div className="flex items-center space-x-4 z-10 w-full">
                {/* Icon or Image Section */}
                <div className="relative shrink-0">
                    {imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 group-hover:border-cyber-green/50 transition-colors bg-black/50">
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="p-2 bg-white/5 rounded-lg text-cyber-green group-hover:bg-cyber-green group-hover:text-black transition-colors duration-300">
                            {icon || <ExternalLink size={20} />}
                        </div>
                    )}

                    {/* Owner Upload Button */}
                    {isOwner && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onUploadImage?.();
                            }}
                            className="absolute -bottom-2 -right-2 bg-cyber-dark-gray text-cyber-green p-1.5 rounded-full border border-cyber-green/30 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-cyber z-20"
                            title="Add/Change Photo"
                        >
                            <Camera size={12} />
                        </button>
                    )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-sans font-semibold text-lg tracking-wide text-white group-hover:text-cyber-green transition-colors truncate">
                        {title}
                    </span>
                    <span className="text-xs text-cyber-text-muted font-mono truncate opacity-70 group-hover:opacity-100 transition-opacity">
                        {url}
                    </span>
                </div>
            </div>

            {showClickCount && (
                <div className="z-10 bg-black/50 px-2 py-1 rounded text-xs font-mono text-cyber-green border border-cyber-green/20">
                    {clickCount} hits
                </div>
            )}
        </motion.a>
    );
};

export default LinkCard;
