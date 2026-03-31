import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';

interface StoreInteriorProps {
  className?: string;
}

export const StoreInterior: React.FC<StoreInteriorProps> = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#1a1a1a] rounded-xl border border-whiskey-light/20 ${className}`}>
      {/* Dimmed Store Interior SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full opacity-60"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background Walls */}
        <rect width="100" height="100" fill="#1a0f0a" />
        
        {/* Shelves - Spanning full width */}
        <g stroke="#3e2723" strokeWidth="0.5">
          <rect x="0" y="10" width="100" height="2" fill="#5d4037" />
          <rect x="0" y="25" width="100" height="2" fill="#5d4037" />
          <rect x="0" y="40" width="100" height="2" fill="#5d4037" />
          <rect x="0" y="55" width="100" height="2" fill="#5d4037" />
        </g>

        {/* Bottle Silhouettes on Shelves - More visible with amber tint */}
        <g fill="#4e342e" stroke="#2a1a10" strokeWidth="0.2">
          {/* Top Shelf */}
          <rect x="5" y="2" width="3" height="8" rx="0.5" />
          <rect x="10" y="3" width="3" height="7" rx="0.5" />
          <rect x="18" y="1" width="4" height="9" rx="0.5" />
          <rect x="25" y="4" width="2" height="6" rx="0.5" />
          <rect x="35" y="2" width="3" height="8" rx="0.5" />
          <rect x="45" y="3" width="4" height="7" rx="0.5" />
          <rect x="55" y="1" width="3" height="9" rx="0.5" />
          <rect x="65" y="4" width="2" height="6" rx="0.5" />
          <rect x="75" y="2" width="3" height="8" rx="0.5" />
          <rect x="85" y="3" width="4" height="7" rx="0.5" />
          <rect x="92" y="1" width="3" height="9" rx="0.5" />
          
          {/* Middle Shelf 1 */}
          <rect x="8" y="17" width="3" height="8" rx="0.5" />
          <rect x="15" y="18" width="4" height="7" rx="0.5" />
          <rect x="25" y="16" width="3" height="9" rx="0.5" />
          <rect x="40" y="17" width="3" height="8" rx="0.5" />
          <rect x="50" y="18" width="4" height="7" rx="0.5" />
          <rect x="60" y="16" width="3" height="9" rx="0.5" />
          <rect x="75" y="17" width="3" height="8" rx="0.5" />
          <rect x="85" y="18" width="4" height="7" rx="0.5" />
          
          {/* Middle Shelf 2 */}
          <rect x="12" y="32" width="3" height="8" rx="0.5" />
          <rect x="22" y="33" width="2" height="7" rx="0.5" />
          <rect x="32" y="31" width="4" height="9" rx="0.5" />
          <rect x="45" y="32" width="3" height="8" rx="0.5" />
          <rect x="55" y="33" width="2" height="7" rx="0.5" />
          <rect x="65" y="31" width="4" height="9" rx="0.5" />
          <rect x="80" y="32" width="3" height="8" rx="0.5" />
          <rect x="90" y="33" width="2" height="7" rx="0.5" />

          {/* Bottom Shelf */}
          <rect x="5" y="47" width="4" height="8" rx="0.5" />
          <rect x="15" y="46" width="3" height="9" rx="0.5" />
          <rect x="25" y="48" width="2" height="7" rx="0.5" />
          <rect x="40" y="47" width="4" height="8" rx="0.5" />
          <rect x="55" y="46" width="3" height="9" rx="0.5" />
          <rect x="70" y="48" width="2" height="7" rx="0.5" />
          <rect x="85" y="47" width="4" height="8" rx="0.5" />
        </g>

        {/* Counter */}
        <rect x="0" y="75" width="100" height="25" fill="#3e2723" />
        <rect x="0" y="75" width="100" height="2" fill="#5d4037" />
        
        {/* Warm Lighting Glows */}
        <defs>
          <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffab40" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffab40" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="25" cy="20" r="30" fill="url(#warmGlow)" />
        <circle cx="75" cy="20" r="30" fill="url(#warmGlow)" />
        <circle cx="50" cy="80" r="40" fill="url(#warmGlow)" />
      </svg>

      {/* Customer Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          {/* Portrait Background Circle */}
          <div className="w-32 h-32 rounded-full bg-whiskey-dark/60 border-4 border-whiskey-gold/30 backdrop-blur-sm flex items-center justify-center shadow-2xl overflow-hidden">
            <User size={80} className="text-whiskey-gold/80 mt-4" />
          </div>
        </motion.div>
      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />
    </div>
  );
};
