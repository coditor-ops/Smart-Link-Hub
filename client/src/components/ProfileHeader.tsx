import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, ShieldCheck } from 'lucide-react';

interface ProfileHeaderProps {
    username: string;
    avatarUrl?: string;
    bio?: string;
    isOwner?: boolean;
    onEditProfile?: () => void;
    onUploadAvatar?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    username,
    avatarUrl,
    bio,
    isOwner = false,
    onEditProfile,
    onUploadAvatar,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Fallback avatar if none provided
    const displayAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${username}&background=00ff41&color=000&bold=true`;

    return (
        <div className="flex flex-col items-center justify-center py-12 relative z-10 w-full">
            <div
                className="relative mb-8 group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={isOwner ? onUploadAvatar : undefined}
            >
                {/* Decorative Rings */}
                <div className="absolute inset-[-12px] rounded-full border border-cyber-green/10 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-[-6px] rounded-full border border-cyber-accent/5 animate-[spin_15s_linear_infinite_reverse]"></div>

                {/* Avatar Container */}
                <div className="relative w-32 h-32 rounded-full p-1.5 glass-green border-cyber-green/40 group-hover:border-cyber-green group-hover:shadow-cyber transition-all duration-500 overflow-hidden shadow-2xl">
                    <motion.div 
                        className="w-full h-full rounded-full overflow-hidden"
                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                    >
                        <motion.img
                            src={displayAvatar}
                            alt={username}
                            className="w-full h-full object-cover"
                            animate={isHovered ? {
                                filter: ["hue-rotate(0deg)", "hue-rotate(45deg)", "hue-rotate(0deg)"],
                            } : {}}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                    </motion.div>

                    {/* Scanline overlay for avatar */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                </div>

                {/* Edit Overlay (Only if Owner) */}
                {isOwner && (
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-1.5 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-md z-20"
                            >
                                <Camera className="text-cyber-green w-8 h-8" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            <motion.div 
                className="flex items-center gap-2 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-black font-sans text-white tracking-tighter uppercase text-glow">
                    {username}
                </h1>
                <div className="text-cyber-green flex items-center" title="Verified Hub">
                    <ShieldCheck size={20} className="drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
                </div>
            </motion.div>

            {bio ? (
                <motion.p
                    className="text-cyber-text-muted font-mono text-xs max-w-sm text-center px-6 leading-relaxed opacity-70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    &gt; {bio}
                </motion.p>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="text-[10px] font-mono text-cyber-text-muted tracking-[0.3em]"
                >
                    Smart Link Hub
                </motion.div>
            )}

            {isOwner && (
                <motion.button
                    onClick={onEditProfile}
                    className="mt-8 flex items-center gap-2 px-6 py-2 text-[10px] font-mono font-bold text-cyber-green glass-green rounded-full hover:bg-cyber-green hover:text-black transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Edit2 size={12} />
                    Edit Profile
                </motion.button>
            )}
        </div>
    );
};

export default ProfileHeader;
