import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2 } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center py-10 relative z-10">
            <div
                className="relative mb-6 group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={isOwner ? onUploadAvatar : undefined}
            >
                {/* Avatar Container with Glitch Effect on Hover */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-cyber-green/30 group-hover:border-cyber-green shadow-[0_0_20px_rgba(0,255,65,0.1)] group-hover:shadow-[0_0_30px_rgba(0,255,65,0.4)] transition-all duration-300">
                    <motion.img
                        src={displayAvatar}
                        alt={username}
                        className="w-full h-full object-cover"
                        animate={isHovered ? {
                            x: [-2, 2, -2, 0],
                            filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                        } : {}}
                        transition={{
                            duration: 0.2,
                            repeat: isHovered ? Infinity : 0,
                            repeatType: "mirror"
                        }}
                    />

                    {/* Scanline overlay for avatar */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Edit Overlay (Only if Owner) */}
                {isOwner && (
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm"
                            >
                                <Camera className="text-cyber-green w-8 h-8" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            <motion.h1
                className="text-3xl font-bold font-sans text-white tracking-tight mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                @{username}
            </motion.h1>

            {bio && (
                <motion.p
                    className="text-cyber-text-muted font-mono text-sm max-w-md text-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {bio}
                </motion.p>
            )}

            {isOwner && (
                <motion.button
                    onClick={onEditProfile}
                    className="mt-4 flex items-center gap-2 px-4 py-1.5 text-xs font-mono text-cyber-green border border-cyber-green/30 rounded hover:bg-cyber-green/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Edit2 size={12} />
                    EDIT PROFILE
                </motion.button>
            )}
        </div>
    );
};

export default ProfileHeader;
