import React from 'react';

interface ShopIllustrationProps {
  level: number;
  shopName?: string;
  className?: string;
}

export const ShopIllustration: React.FC<ShopIllustrationProps> = ({ level, shopName = "Whiskey Shop", className = "" }) => {
  // Common colors
  const colors = {
    sky: '#1a1a1a',
    ground: '#2a2a2a',
    wood: '#5D4037',
    woodDark: '#3E2723',
    glass: 'rgba(179, 229, 252, 0.3)',
    brick: '#8D6E63',
    brickDark: '#5D4037',
    gold: '#D4AF37',
    stone: '#757575',
  };

  const renderTier = () => {
    switch (level) {
      case 1: // The Pop-up Stall
        return (
          <g>
            {/* Stall Table */}
            <rect x="20" y="60" width="60" height="20" fill={colors.wood} stroke={colors.woodDark} strokeWidth="1" />
            <line x1="20" y1="65" x2="80" y2="65" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <line x1="20" y1="70" x2="80" y2="70" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            {/* Canopy Poles */}
            <line x1="25" y1="60" x2="25" y2="30" stroke={colors.stone} strokeWidth="2" />
            <line x1="75" y1="60" x2="75" y2="30" stroke={colors.stone} strokeWidth="2" />
            {/* Striped Canopy */}
            <path d="M20 35 Q50 20 80 35 L85 45 L15 45 Z" fill={colors.gold} opacity="0.9" />
            <path d="M30 32 L30 45 M50 28 L50 45 M70 32 L70 45" stroke="rgba(0,0,0,0.1)" strokeWidth="4" />
            {/* Tassels */}
            <circle cx="20" cy="45" r="1.5" fill={colors.gold} />
            <circle cx="35" cy="45" r="1.5" fill={colors.gold} />
            <circle cx="50" cy="45" r="1.5" fill={colors.gold} />
            <circle cx="65" cy="45" r="1.5" fill={colors.gold} />
            <circle cx="80" cy="45" r="1.5" fill={colors.gold} />
            {/* Bottles on table */}
            <g transform="translate(35, 52)">
              <rect width="4" height="8" rx="1" fill={colors.glass} />
              <rect x="1" y="-2" width="2" height="3" fill={colors.woodDark} />
            </g>
            <g transform="translate(45, 50)">
              <rect width="4" height="10" rx="1" fill={colors.glass} />
              <rect x="1" y="-2" width="2" height="3" fill={colors.woodDark} />
            </g>
            <g transform="translate(55, 52)">
              <rect width="4" height="8" rx="1" fill={colors.glass} />
              <rect x="1" y="-2" width="2" height="3" fill={colors.woodDark} />
            </g>
            {/* Shop Name on Stall */}
            <text x="50" y="75" fontSize="4" fill={colors.gold} textAnchor="middle" fontWeight="black" fontFamily="serif">{shopName}</text>
          </g>
        );
      case 2: // The Back Alley
        return (
          <g>
            {/* Run down shack */}
            <path d="M20 80 L20 40 L50 20 L80 40 L80 80 Z" fill={colors.woodDark} stroke={colors.wood} strokeWidth="1" />
            <path d="M20 40 L50 20 L80 40 Z" fill={colors.wood} opacity="0.8" />
            
            {/* Door */}
            <rect x="28" y="50" width="18" height="30" fill={colors.woodDark} stroke={colors.wood} strokeWidth="0.5" />
            <circle cx="42" cy="65" r="1" fill={colors.gold} /> {/* Doorknob */}
            <line x1="28" y1="50" x2="46" y2="50" stroke={colors.wood} strokeWidth="1" /> {/* Door frame top */}

            {/* Smaller shifted window */}
            <rect x="55" y="50" width="12" height="12" fill={colors.glass} stroke={colors.woodDark} strokeWidth="1" />
            <line x1="61" y1="50" x2="61" y2="62" stroke={colors.woodDark} strokeWidth="0.5" />
            <line x1="55" y1="56" x2="67" y2="56" stroke={colors.woodDark} strokeWidth="0.5" />
            
            {/* Wood Grain Texture */}
            <line x1="25" y1="45" x2="25" y2="75" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            <line x1="75" y1="45" x2="75" y2="75" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            
            {/* Window Reflection */}
            <path d="M56 51 L61 51 L56 56 Z" fill="white" opacity="0.1" />
            
            {/* Cracks and wear */}
            <path d="M25 70 L35 75" stroke={colors.woodDark} strokeWidth="0.5" opacity="0.5" />
            <path d="M65 30 L75 35" stroke={colors.woodDark} strokeWidth="0.5" opacity="0.5" />
            
            {/* Small Lantern */}
            <line x1="18" y1="45" x2="22" y2="45" stroke={colors.stone} strokeWidth="1" />
            <rect x="16" y="45" width="4" height="6" fill={colors.gold} opacity="0.6" />
            
            {/* Shop Name - Moved Higher */}
            <rect x="25" y="32" width="50" height="6" fill={colors.woodDark} opacity="0.9" />
            <text x="50" y="36.5" fontSize="3" fill={colors.gold} textAnchor="middle" fontWeight="bold" fontFamily="monospace" opacity="0.9">{shopName}</text>
          </g>
        );
      case 3: // The Corner Store
        return (
          <g>
            {/* Building Base */}
            <rect x="15" y="20" width="70" height="60" fill={colors.brick} stroke={colors.brickDark} strokeWidth="1" />
            {/* Brick Lines */}
            <line x1="15" y1="30" x2="85" y2="30" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <line x1="15" y1="40" x2="85" y2="40" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <line x1="15" y1="50" x2="85" y2="50" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <line x1="15" y1="60" x2="85" y2="60" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            {/* Large Window */}
            <rect x="25" y="35" width="30" height="30" fill={colors.glass} stroke={colors.brickDark} strokeWidth="2" />
            <line x1="40" y1="35" x2="40" y2="65" stroke={colors.brickDark} strokeWidth="1" />
            <line x1="25" y1="50" x2="55" y2="50" stroke={colors.brickDark} strokeWidth="1" />
            {/* Window Reflection */}
            <path d="M27 37 L40 37 L27 50 Z" fill="white" opacity="0.1" />
            {/* Door */}
            <rect x="60" y="45" width="15" height="35" fill={colors.wood} stroke={colors.woodDark} strokeWidth="1" />
            <rect x="63" y="50" width="9" height="12" fill={colors.glass} opacity="0.5" />
            <circle cx="72" cy="65" r="1.5" fill={colors.gold} />
            {/* Signage */}
            <rect x="20" y="25" width="60" height="8" fill={colors.woodDark} />
            <text x="50" y="31" fontSize="4" fill={colors.gold} textAnchor="middle" fontWeight="bold" fontFamily="serif">{shopName}</text>
            {/* Sidewalk detail */}
            <rect x="10" y="78" width="80" height="2" fill={colors.stone} />
          </g>
        );
      case 4: // The Boutique
        return (
          <g>
            {/* Elegant Facade */}
            <rect x="10" y="15" width="80" height="65" fill="#2c2c2c" stroke={colors.gold} strokeWidth="1" />
            {/* Decorative Moulding */}
            <rect x="10" y="15" width="80" height="3" fill={colors.gold} opacity="0.3" />
            {/* Large Display Windows */}
            <rect x="18" y="30" width="25" height="40" fill={colors.glass} stroke={colors.gold} strokeWidth="1" />
            <rect x="57" y="30" width="25" height="40" fill={colors.glass} stroke={colors.gold} strokeWidth="1" />
            {/* Window Shelves */}
            <line x1="18" y1="50" x2="43" y2="50" stroke={colors.gold} strokeWidth="0.5" opacity="0.5" />
            <line x1="57" y1="50" x2="82" y2="50" stroke={colors.gold} strokeWidth="0.5" opacity="0.5" />
            {/* Central Door */}
            <rect x="45" y="35" width="10" height="45" fill={colors.woodDark} stroke={colors.gold} strokeWidth="1" />
            <rect x="47" y="40" width="6" height="15" fill={colors.glass} opacity="0.3" />
            {/* Decorative Awning */}
            <path d="M10 30 L90 30 L95 35 L5 35 Z" fill={colors.woodDark} />
            <rect x="15" y="20" width="70" height="10" fill="#1a1a1a" />
            <text x="50" y="27" fontSize="5" fill={colors.gold} textAnchor="middle" fontWeight="black" letterSpacing="1">{shopName}</text>
            {/* Lights */}
            <circle cx="20" cy="35" r="1.5" fill={colors.gold} />
            <circle cx="80" cy="35" r="1.5" fill={colors.gold} />
            <path d="M18 35 L22 35 L20 40 Z" fill={colors.gold} opacity="0.3" />
            <path d="M78 35 L82 35 L80 40 Z" fill={colors.gold} opacity="0.3" />
          </g>
        );
      case 5: // The Emporium
        return (
          <g>
            {/* Grand Structure */}
            <rect x="5" y="10" width="90" height="70" fill={colors.stone} stroke="#444" strokeWidth="1" />
            {/* Pillars */}
            <rect x="10" y="10" width="6" height="70" fill="#555" />
            <rect x="84" y="10" width="6" height="70" fill="#555" />
            <rect x="9" y="10" width="8" height="2" fill="#666" />
            <rect x="83" y="10" width="8" height="2" fill="#666" />
            {/* Massive Windows */}
            <rect x="20" y="25" width="25" height="45" fill={colors.glass} />
            <rect x="55" y="25" width="25" height="45" fill={colors.glass} />
            {/* Window Grids */}
            <line x1="20" y1="47" x2="45" y2="47" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="32.5" y1="25" x2="32.5" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="55" y1="47" x2="80" y2="47" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="67.5" y1="25" x2="67.5" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            {/* Grand Entrance */}
            <path d="M45 30 Q50 20 55 30 L55 80 L45 80 Z" fill={colors.woodDark} stroke={colors.gold} strokeWidth="1" />
            <circle cx="53" cy="60" r="1" fill={colors.gold} />
            {/* Roof Detail */}
            <rect x="5" y="5" width="90" height="5" fill="#333" />
            <rect x="3" y="3" width="94" height="2" fill={colors.gold} opacity="0.5" />
            <text x="50" y="20" fontSize="6" fill={colors.gold} textAnchor="middle" fontWeight="black" letterSpacing="2">{shopName}</text>
            {/* Statues/Ornaments */}
            <circle cx="13" cy="8" r="2" fill={colors.stone} />
            <circle cx="87" cy="8" r="2" fill={colors.stone} />
          </g>
        );
      case 6: // The Grand Vault (Distillery)
        return (
          <g>
            {/* Industrial Brick Structure */}
            <rect x="5" y="15" width="90" height="65" fill={colors.brickDark} />
            {/* Brick Pattern (Detailed) */}
            {[25, 35, 45, 55, 65].map(y => (
              <g key={y}>
                <line x1="5" y1={y} x2="95" y2={y} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                {[15, 25, 35, 45, 55, 65, 75, 85].map(x => (
                  <line key={x} x1={x + (y % 20 === 5 ? 5 : 0)} y1={y} x2={x + (y % 20 === 5 ? 5 : 0)} y2={y + 10} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                ))}
              </g>
            ))}
            {/* Arched Windows */}
            <path d="M15 50 Q25 30 35 50 L35 70 L15 70 Z" fill={colors.glass} stroke={colors.gold} strokeWidth="1" />
            <path d="M65 50 Q75 30 85 50 L85 70 L65 70 Z" fill={colors.glass} stroke={colors.gold} strokeWidth="1" />
            {/* Window Bars */}
            <line x1="15" y1="55" x2="35" y2="55" stroke={colors.gold} strokeWidth="0.5" opacity="0.3" />
            <line x1="15" y1="62" x2="35" y2="62" stroke={colors.gold} strokeWidth="0.5" opacity="0.3" />
            <line x1="65" y1="55" x2="85" y2="55" stroke={colors.gold} strokeWidth="0.5" opacity="0.3" />
            <line x1="65" y1="62" x2="85" y2="62" stroke={colors.gold} strokeWidth="0.5" opacity="0.3" />
            {/* Heavy Vault Door */}
            <rect x="42" y="40" width="16" height="40" fill="#222" stroke={colors.gold} strokeWidth="2" />
            <circle cx="50" cy="60" r="4" fill="none" stroke={colors.gold} strokeWidth="1" />
            <line x1="50" y1="56" x2="50" y2="64" stroke={colors.gold} strokeWidth="1" />
            <line x1="46" y1="60" x2="54" y2="60" stroke={colors.gold} strokeWidth="1" />
            {/* Rivets on door */}
            <circle cx="44" cy="42" r="0.5" fill={colors.gold} />
            <circle cx="56" cy="42" r="0.5" fill={colors.gold} />
            <circle cx="44" cy="78" r="0.5" fill={colors.gold} />
            <circle cx="56" cy="78" r="0.5" fill={colors.gold} />
            {/* Chimney & Smoke */}
            <rect x="75" y="0" width="10" height="15" fill={colors.brickDark} />
            <rect x="73" y="0" width="14" height="3" fill="#333" />
            <path d="M78 -2 Q80 -10 85 -15" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
            {/* Text */}
            <text x="50" y="30" fontSize="5" fill={colors.gold} textAnchor="middle" fontWeight="black" letterSpacing="1">{shopName}</text>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg 
      viewBox="0 0 100 80" 
      className={`w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background/Ground */}
      <rect x="0" y="75" width="100" height="5" fill={colors.ground} />
      
      {/* Glow Effect */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={colors.gold} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.gold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="40" r="40" fill="url(#glow)" />

      {renderTier()}
    </svg>
  );
};
