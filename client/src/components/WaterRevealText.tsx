import React from 'react';
import { motion } from 'framer-motion';

interface WaterRevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const WaterRevealText: React.FC<WaterRevealTextProps> = ({ children, className = '', delay = 0 }) => {
  // Use a custom easing that feels like a fluid rise
  const transitionConfig = {
    duration: 1.5,
    ease: [0.2, 0.8, 0.2, 1] as const,
    delay,
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Text (Above Water) */}
      <div className="relative overflow-hidden pb-[2px]">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={transitionConfig}
          className="relative z-10"
        >
          {children}
        </motion.div>
        {/* Subtle waterline glow */}
        <div className="waterline z-20"></div>
      </div>

      {/* Reflection (Below Water) */}
      <div className="absolute top-full left-0 w-full overflow-hidden pt-[2px] water-reflection opacity-20 pointer-events-none">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={transitionConfig}
          className="relative"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default WaterRevealText;
