/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Bottle, Brand, Rarity, ReleaseType } from '../types';
import { getAgeDisplay } from '../engine';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AutoScalingText } from './AutoScalingText';

interface BottleImageProps {
  brand?: Brand;
  bottle: Bottle;
}

export const BottleImage: React.FC<BottleImageProps> = ({ brand, bottle }) => {
  if (!brand) return <div className="w-full h-full bg-whiskey-dark/20 rounded-lg flex items-center justify-center text-[8px] text-whiskey-gold/40 uppercase">No Brand</div>;
  
  const { bottleShape, labelColor, capColor, labelFont, capType } = brand;

  const renderShape = () => {
    const brandName = brand.name || 'Whiskey';
    const clipId = `clip-${bottle.id.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const fontMap: Record<string, string> = {
      modern: 'font-sans tracking-tight',
      classic: 'font-serif font-bold',
      vintage: 'font-serif italic',
      technical: 'font-mono text-[6px]',
      bold: 'font-sans font-black tracking-tighter'
    };

    const Label = ({ x, y, width, height }: { x: number; y: number; width: number; height: number }) => {
      const lineWidth = width * 0.5;
      const lineX1 = x + (width - lineWidth) / 2;
      const lineX2 = lineX1 + lineWidth;
      
      // Calculate dynamic font size based on brand name length and label width
      const maxFontSize = 7;
      const padding = 6; // 3 units on each side
      const availableWidth = width - padding;
      // Approximate character width is ~0.55 of font size
      const calculatedFontSize = Math.min(maxFontSize, availableWidth / (brandName.length * 0.55));
      
      return (
        <g>
          {/* Main Label Background */}
          <rect x={x} y={y} width={width} height={height} fill={labelColor} rx="2" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          {/* Inner Decorative Border */}
          <rect x={x + 1.5} y={y + 1.5} width={width - 3} height={height - 3} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" rx="1" />
          
          {/* Top Decorative Lines */}
          <line x1={lineX1} y1={y + 6} x2={lineX2} y2={y + 6} stroke="rgba(0,0,0,0.15)" strokeWidth="0.2" />
          <line x1={lineX1 + 3} y1={y + 8} x2={lineX2 - 3} y2={y + 8} stroke="rgba(0,0,0,0.15)" strokeWidth="0.2" />

          {/* Brand Text */}
          <text 
            x={x + width / 2} 
            y={y + height / 2} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            fontSize={calculatedFontSize} 
            className={fontMap[labelFont || 'classic']}
            style={{ textShadow: '0.6px 0.6px 0px rgba(0,0,0,0.8)' }}
          >
            {brandName}
          </text>

          {/* Bottom Decorative Lines */}
          <line x1={lineX1 + 3} y1={y + height - 8} x2={lineX2 - 3} y2={y + height - 8} stroke="rgba(0,0,0,0.2)" strokeWidth="0.2" />
          <line x1={lineX1} y1={y + height - 6} x2={lineX2} y2={y + height - 6} stroke="rgba(0,0,0,0.2)" strokeWidth="0.2" />
          
          {/* Small Seal */}
          <circle cx={x + width - 6} cy={y + height - 6} r="2.5" fill="rgba(0,0,0,0.05)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.2" />
        </g>
      );
    };

    const renderCap = (x: number, y: number, width: number, height: number) => {
      switch (capType) {
        case 'cork':
          return (
            <g>
              <rect x={x - 2} y={y} width={width + 4} height={height / 2} fill={capColor} rx="1" />
              <rect x={x + 2} y={y + height / 2} width={width - 4} height={height / 2} fill="#8B4513" />
            </g>
          );
        case 'wax':
          return (
            <path 
              d={`M${x-2} ${y} L${x+width+2} ${y} L${x+width+2} ${y+height} Q${x+width} ${y+height+5} ${x+width-4} ${y+height} L${x+4} ${y+height+8} Q${x} ${y+height+5} ${x-2} ${y+height} Z`} 
              fill={capColor} 
            />
          );
        case 'glass':
          return (
            <g>
              <circle cx={x + width/2} cy={y + height/4} r={width/2 + 2} fill={capColor} opacity="0.8" />
              <rect x={x} y={y + height/2} width={width} height={height/2} fill={capColor} opacity="0.9" />
            </g>
          );
        default: // screw
          return <rect x={x} y={y} width={width} height={height} fill={capColor} rx="1" />;
      }
    };

    const renderBottle = (bodyPath: string, capX: number, capY: number, capW: number, capH: number, neckRect: React.ReactNode, label: React.ReactNode, extra?: React.ReactNode) => (
      <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="20%" stopColor="white" stopOpacity="0" />
            <stop offset="25%" stopColor="white" stopOpacity="0.35" />
            <stop offset="30%" stopColor="white" stopOpacity="0.1" />
            <stop offset="35%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <clipPath id={clipId}>
            <path d={bodyPath} />
          </clipPath>
        </defs>
        
        {renderCap(capX, capY, capW, capH)}
        {neckRect}
        {extra}
        <path d={bodyPath} fill="rgba(139, 69, 19, 0.8)" stroke="rgba(0,0,0,0.2)" />
        
        {/* Shine clipped to body */}
        <rect x="0" y="0" width="100" height="150" fill="url(#glassShine)" pointerEvents="none" style={{ mixBlendMode: 'screen' }} clipPath={`url(#${clipId})`} />
        
        {label}
      </svg>
    );

    switch (bottleShape) {
      case 'flask':
        return renderBottle(
          "M20 35 Q20 35 15 45 L10 130 Q10 145 25 145 L75 145 Q90 145 90 130 L85 45 Q80 35 80 35 Z",
          40, 5, 20, 15,
          <rect x="42" y="20" width="16" height="15" fill="rgba(255,255,255,0.2)" stroke="rgba(0,0,0,0.1)" />,
          <Label x={25} y={60} width={50} height={60} />
        );
      case 'square':
        return renderBottle(
          "M15 40 L85 40 L85 140 L15 140 Z",
          40, 5, 20, 15,
          <rect x="42" y="20" width="16" height="20" fill="rgba(255,255,255,0.2)" stroke="rgba(0,0,0,0.1)" />,
          <Label x={20} y={65} width={60} height={50} />
        );
      case 'tall':
        return renderBottle(
          "M44 47 Q25 50 25 70 L25 140 Q25 145 30 145 L70 145 Q75 145 75 140 L75 70 Q75 50 56 47 Z",
          42, 5, 16, 12,
          <rect x="44" y="17" width="12" height="30" fill="rgba(255,255,255,0.2)" stroke="rgba(0,0,0,0.1)" />,
          <Label x={30} y={75} width={40} height={55} />
        );
      case 'decanter':
        return renderBottle(
          "M45 42 L20 60 L15 135 Q15 145 25 145 L75 145 Q85 145 85 135 L80 60 L55 42 Z",
          40, 5, 20, 15,
          <rect x="45" y="22" width="10" height="20" fill="rgba(255,255,255,0.2)" stroke="rgba(0,0,0,0.1)" />,
          <Label x={25} y={75} width={50} height={45} />
        );
      case 'jug':
        return renderBottle(
          "M44 35 C20 35 10 60 10 100 C10 145 90 145 90 100 C90 60 80 35 56 35 Z",
          42, 5, 16, 15,
          <rect x="44" y="20" width="12" height="15" fill="rgba(255,255,255,0.2)" />,
          <Label x={25} y={75} width={50} height={40} />,
          <path d="M44 25 Q20 25 20 45" fill="none" stroke="rgba(139, 69, 19, 0.8)" strokeWidth="5" />
        );
      case 'bell':
        return renderBottle(
          "M46 47 C20 50 15 80 15 140 L85 140 C85 80 80 50 54 47 Z",
          44, 5, 12, 12,
          <rect x="46" y="17" width="8" height="30" fill="rgba(255,255,255,0.2)" />,
          <Label x={30} y={90} width={40} height={35} />
        );
      default: // round
        return renderBottle(
          "M50 45 C20 45 20 70 20 100 C20 145 80 145 80 100 C80 70 80 45 50 45 Z",
          40, 5, 20, 15,
          <rect x="42" y="20" width="16" height="25" fill="rgba(255,255,255,0.2)" stroke="rgba(0,0,0,0.1)" />,
          <Label x={30} y={70} width={40} height={45} />
        );
    }
  };

  return (
    <div className="w-32 h-48 flex items-center justify-center">
      {renderShape()}
    </div>
  );
};

interface BottleCardProps {
  bottle: Bottle;
  brand?: Brand;
  compact?: boolean;
  negotiation?: boolean;
  revealedFields?: string[];
  onInspect?: () => void;
  isInspecting?: boolean;
  inspectionResults?: string[];
  onInspectionStepComplete?: (field: string, wasSuccessful: boolean) => void;
  onInspectionFinished?: () => void;
  hasInspected?: boolean;
  showPurchasePrice?: boolean;
  highlightedSection?: 'left_cells' | 'right_cells' | 'name_bottom' | 'inspect_button' | null;
}

const INSPECTION_STEPS = [
  'region',
  'type',
  'modifiers_scan',
  'proof',
  'age',
  'year',
  'rarity'
];

export const BottleCard: React.FC<BottleCardProps> = ({ 
  bottle, 
  brand, 
  compact, 
  negotiation, 
  revealedFields, 
  onInspect,
  isInspecting,
  inspectionResults,
  onInspectionStepComplete,
  onInspectionFinished,
  hasInspected,
  showPurchasePrice,
  highlightedSection
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const lastProcessedStepRef = useRef<number>(-1);
  const currentStepRef = useRef<number>(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const [stepGlow, setStepGlow] = useState<{ field: string; success: boolean } | null>(null);
  const [modifierScanIndex, setModifierScanIndex] = useState(-1);
  const [modifierScanSuccess, setModifierScanSuccess] = useState<boolean | null>(null);
  const [rarityAnimProgress, setRarityAnimProgress] = useState(0); // 0 to 1
  const prevRarityDiscovered = useRef(bottle.rarityDiscovered);

  const [initialRevealedFields, setInitialRevealedFields] = useState<string[]>([]);

  const isRevealed = (field: string) => {
    // If we're in a negotiation, use the negotiation's revealed fields
    if (revealedFields !== undefined) {
      if (revealedFields.includes(field)) return true;
      
      // Special handling for modifiers
      if (field.startsWith('modifiers_')) {
        const idx = parseInt(field.split('_')[1]);
        const modValue = bottle.modifiers[idx];
        return revealedFields.includes('modifiers') || 
               revealedFields.includes(`modifiers_${idx}`) ||
               (modValue && revealedFields.includes(modValue));
      }
      return false;
    }

    // If we're in the inventory, use the bottle's discovered fields
    const fields = bottle.discoveredFields || [];
    if (fields.includes(field)) return true;
    
    // Special handling for modifiers
    if (field.startsWith('modifiers_')) {
      const idx = parseInt(field.split('_')[1]);
      const modValue = bottle.modifiers[idx];
      return fields.includes('modifiers') || 
             fields.includes(`modifiers_${idx}`) ||
             (modValue && fields.includes(modValue));
    }
    
    return false;
  };

  const wasInitiallyRevealed = (field: string) => {
    return initialRevealedFields.includes(field);
  };

  useEffect(() => {
    if (bottle.rarityDiscovered && !prevRarityDiscovered.current && !isInspecting) {
      // Inventory discovery animation
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        setRarityAnimProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => setRarityAnimProgress(0), 1000);
        }
      };
      requestAnimationFrame(animate);
    }
    prevRarityDiscovered.current = bottle.rarityDiscovered;
  }, [bottle.rarityDiscovered, isInspecting]);

  useEffect(() => {
    currentStepRef.current = currentStepIndex;
    if (isInspecting && currentStepIndex === -1) {
      setInitialRevealedFields(revealedFields || []);
      setCurrentStepIndex(0);
    } else if (!isInspecting && currentStepIndex !== -1) {
      setCurrentStepIndex(-1);
      lastProcessedStepRef.current = -1;
      setStepGlow(null);
      setRarityAnimProgress(0);
      setInitialRevealedFields([]);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [isInspecting, currentStepIndex, revealedFields]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const startRarityAnimation = () => {
      const duration = 3000; // 3 seconds for the border to connect
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        setRarityAnimProgress(progress);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // Finished border animation
          const wasSuccessful = inspectionResults?.includes('rarity') || false;
          setStepGlow({ field: 'rarity', success: wasSuccessful });
          
          timeoutRef.current = setTimeout(() => {
            onInspectionStepComplete?.('rarity', wasSuccessful);
            setStepGlow(null);
            setRarityAnimProgress(0);
            setCurrentStepIndex(prev => prev + 1);
          }, 800);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    };

    if (currentStepIndex >= 0 && currentStepIndex < INSPECTION_STEPS.length) {
      if (lastProcessedStepRef.current === currentStepIndex) return;
      lastProcessedStepRef.current = currentStepIndex;

      const field = INSPECTION_STEPS[currentStepIndex];
      const baseField = field.split('_')[0];
      
      // If already revealed BEFORE inspection started, skip
      if (wasInitiallyRevealed(baseField)) {
        timeoutRef.current = setTimeout(() => setCurrentStepIndex(prev => prev + 1), 50);
        return;
      }

      // Special case for rarity - it has its own long animation
      if (field === 'rarity') {
        startRarityAnimation();
        return;
      }

      // Normal field inspection
      const wasSuccessful = inspectionResults?.includes(field) || false;
      
      // Special case for modifiers scan
      if (field === 'modifiers_scan') {
        const stepAtStart = currentStepIndex;
        const scanModifier = async () => {
          // 1. Smooth scan through all 3 slots
          for (let slot = 0; slot < 3; slot++) {
            if (currentStepRef.current !== stepAtStart) return;
            setModifierScanIndex(slot);
            // Faster scan, no stopping
            await new Promise(resolve => setTimeout(resolve, 150));
          }
          
          if (currentStepRef.current !== stepAtStart) return;
          
          // 2. Identify all modifiers to reveal
          const newlyDiscovered = [0, 1, 2].filter(i => {
            const modField = `modifiers_${i}`;
            return !isRevealed(modField) && (inspectionResults?.includes(modField) || false);
          });

          // 3. Show success/fail feedback briefly
          if (newlyDiscovered.length > 0) {
            setModifierScanSuccess(true);
          } else {
            setModifierScanSuccess(false);
          }
          
          await new Promise(resolve => setTimeout(resolve, 600));
          if (currentStepRef.current !== stepAtStart) return;

          // 4. Reveal all at once
          newlyDiscovered.forEach(idx => {
            onInspectionStepComplete?.(`modifiers_${idx}`, true);
          });

          setModifierScanSuccess(null);
          setModifierScanIndex(-1);
          setCurrentStepIndex(prev => prev + 1);
        };
        scanModifier();
        return;
      }

      setStepGlow({ field, success: wasSuccessful });
      
      timeoutRef.current = setTimeout(() => {
        onInspectionStepComplete?.(field, wasSuccessful);
        setStepGlow(null);
        timeoutRef.current = setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, 200);
      }, 600);
    } else if (currentStepIndex === INSPECTION_STEPS.length) {
      setCurrentStepIndex(-1);
      onInspectionFinished?.();
    }
  }, [currentStepIndex, isInspecting, inspectionResults, bottle, onInspectionStepComplete, onInspectionFinished, initialRevealedFields]);

  const renderName = () => {
    const line1 = [];
    if (isRevealed('year')) line1.push(bottle.year);
    if (brand) line1.push(brand.name);
    
    const ageDisplay = getAgeDisplay(bottle);
    if (isRevealed('age') && ageDisplay !== 'Unstated') {
      line1.push(ageDisplay);
    }

    const line2 = [];
    bottle.modifiers.forEach((mod, i) => {
      if (isRevealed(`modifiers_${i}`)) line2.push(mod);
    });

    const line3 = isRevealed('type') ? bottle.type : '?';

    return (
      <div className="flex flex-col gap-0.5">
        <div className="leading-tight">{line1.join(' ')}</div>
        <div className="text-[0.75em] text-whiskey-amber/80 h-[1.2em] leading-none font-sans uppercase tracking-wider">
          {line2.join(' ')}
        </div>
        <div className="leading-tight">{line3}</div>
      </div>
    );
  };

  const renderNameCompact = () => {
    const parts = [];
    if (isRevealed('year')) parts.push(bottle.year);
    if (brand) parts.push(brand.name);
    
    const ageDisplay = getAgeDisplay(bottle);
    if (isRevealed('age') && ageDisplay !== 'Unstated') {
      parts.push(ageDisplay);
    }

    bottle.modifiers.forEach((mod, i) => {
      if (isRevealed(`modifiers_${i}`)) parts.push(mod);
    });
    if (isRevealed('type')) parts.push(bottle.type);
    return parts.join(' ');
  };

  const rarityColors: Record<Rarity, string> = {
    [Rarity.COMMON]: 'border-gray-400',
    [Rarity.UNCOMMON]: 'border-green-500',
    [Rarity.RARE]: 'border-blue-500',
    [Rarity.EPIC]: 'border-purple-500',
    [Rarity.LEGENDARY]: 'border-yellow-500',
    [Rarity.UNICORN]: 'border-pink-500 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px]',
  };

  const rarityText = isRevealed('rarity') ? bottle.rarity : '?';
  const borderColor = isRevealed('rarity') ? rarityColors[bottle.rarity] : 'border-gray-200';

  const isUnicorn = isRevealed('rarity') && bottle.rarity === Rarity.UNICORN;

  if (compact) {
    return (
      <div className={`w-full rounded-2xl overflow-hidden shadow-lg bg-whiskey-medium border-2 ${isUnicorn ? rarityColors[Rarity.UNICORN] : borderColor}`}>
        <div className={`p-3 flex items-center gap-4 ${isUnicorn ? 'bg-whiskey-medium rounded-[14px]' : ''}`}>
          <div className="w-12 h-18 shrink-0 flex items-center justify-center scale-50 -mx-4">
             <BottleImage brand={brand} bottle={bottle} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm font-bold text-stone-200 truncate">
              {renderNameCompact()}
            </h4>
            <p className="text-[10px] font-bold text-whiskey-amber uppercase tracking-tighter truncate">
              {isRevealed('type') ? bottle.type : '?'} • {isRevealed('proof') ? `${bottle.proof} Proof` : '? Proof'} • {isRevealed('age') ? `${bottle.age}yr` : '?yr'}
            </p>
          </div>
          <div className="text-right shrink-0">
             {showPurchasePrice && bottle.purchasePrice && (
               <div>
                 <p className="text-[8px] font-bold text-stone-500 uppercase">Paid</p>
                 <p className="text-sm font-black text-whiskey-money">${bottle.purchasePrice.toLocaleString()}</p>
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      animate={rarityAnimProgress > 0 ? {
        scale: 1 + (rarityAnimProgress * 0.12),
        x: [0, -2, 2, -1, 3, -2, 1, -3, 2, 0],
        y: [0, 1, -2, 2, -1, 3, -2, 1, -3, 0],
        zIndex: 100,
        transition: {
          x: { repeat: Infinity, duration: 0.07 / (rarityAnimProgress + 0.1) },
          y: { repeat: Infinity, duration: 0.07 / (rarityAnimProgress + 0.1) },
          scale: { duration: 0.1 },
          zIndex: { duration: 0 }
        }
      } : { 
        scale: 1, 
        x: 0, 
        y: 0,
        zIndex: 0,
        transition: { zIndex: { delay: 0.5 } } // Keep z-index high slightly longer if needed, but 0 is fine
      }}
      className={`w-full ${negotiation ? 'h-[290px]' : 'max-w-[320px] aspect-[3/4]'} rounded-xl shadow-2xl bg-whiskey-medium flex flex-col relative ${isUnicorn ? rarityColors[Rarity.UNICORN] : `border-4 ${borderColor}`}`}
    >
      {/* Local Tutorial Spotlight Overlay */}
      {highlightedSection && (
        <div className="absolute inset-0 bg-black/60 z-[150] rounded-lg pointer-events-none" />
      )}

      {/* Top Left Overlay: Inspect & Price */}
      <div className={`absolute top-2 left-2 flex flex-col items-center gap-2 ${highlightedSection === 'inspect_button' ? 'z-[200] shadow-[0_0_20px_rgba(255,255,255,0.3),inset_0_0_10px_rgba(255,255,255,0.2)] bg-white/10 rounded-full' : 'z-20'}`}>
        {onInspect && !hasInspected && (
          <button 
            onClick={(e) => { e.stopPropagation(); onInspect(); }}
            className="w-8 h-8 rounded-full bg-whiskey-amber text-whiskey-dark flex items-center justify-center shadow-lg hover:bg-whiskey-gold transition-colors active:scale-90"
            title="Inspect Bottle"
          >
            <Search size={16} strokeWidth={3} />
          </button>
        )}
        
        {showPurchasePrice && bottle.purchasePrice && (
          <div className="bg-whiskey-dark/80 backdrop-blur-sm border border-whiskey-light/30 rounded px-1.5 py-1 flex flex-col items-center shadow-sm min-w-[50px]">
            <span className="text-[7px] font-bold text-whiskey-amber opacity-70 uppercase leading-none mb-0.5">Paid</span>
            <span className="text-[11px] font-black text-whiskey-money leading-tight">${bottle.purchasePrice.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Rarity Border Animation Overlay */}
      {rarityAnimProgress > 0 && (
        <RarityBorderAnimation progress={rarityAnimProgress} />
      )}

      {/* Tag Columns - Vertically Centered in the Card */}
      <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 w-[85px] ${highlightedSection === 'left_cells' ? 'z-[200] shadow-[0_0_25px_rgba(255,255,255,0.2),inset_0_0_15px_rgba(255,255,255,0.1)] rounded-lg bg-white/5' : 'z-10'}`}>
        <Tag 
          label={isRevealed('region') ? bottle.region : '?'} 
          glow={stepGlow?.field === 'region' ? (stepGlow.success ? 'success' : 'fail') : undefined}
        />
        <Tag 
          label={isRevealed('type') ? bottle.type : '?'} 
          glow={stepGlow?.field === 'type' ? (stepGlow.success ? 'success' : 'fail') : undefined}
        />
        <Tag 
          label={rarityText} 
          glow={stepGlow?.field === 'rarity' ? (stepGlow.success ? 'success' : 'fail') : undefined}
        />
      </div>
      <div className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 w-[85px] ${highlightedSection === 'right_cells' ? 'z-[200] shadow-[0_0_25px_rgba(255,255,255,0.2),inset_0_0_15px_rgba(255,255,255,0.1)] rounded-lg bg-white/5' : 'z-10'}`}>
        {[0, 1, 2].map((slotIdx) => {
          // Get all revealed modifiers and pack them at the top
          const revealedModifierIndices = [0, 1, 2].filter(i => isRevealed(`modifiers_${i}`));
          const revealedModifiers = revealedModifierIndices.map(i => bottle.modifiers[i]);
          const modValue = revealedModifiers[slotIdx];
          
          const isScanning = modifierScanIndex === slotIdx;
          // Show scanning state on the active slot, or success/fail on all slots during the result phase
          const isResultPhase = modifierScanIndex !== -1 && modifierScanSuccess !== null;
          const glowType = isResultPhase ? (modifierScanSuccess === true ? 'success' : 'fail') : undefined;

          return (
            <Tag 
              key={`slot_${slotIdx}`}
              label={modValue || ''} 
              empty={!modValue}
              glow={glowType}
              isScanning={isScanning && modifierScanSuccess === null}
            />
          );
        })}

        {/* Scanning Beam Visual */}
        {modifierScanIndex !== -1 && (
          <motion.div 
            className="absolute left-0 right-0 h-0.5 bg-whiskey-gold/80 z-20 pointer-events-none"
            initial={false}
            animate={{ 
              top: (modifierScanIndex * 26) + 11, // 22px height / 2 = 11px center
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ 
              top: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { repeat: Infinity, duration: 0.5 }
            }}
            style={{
              boxShadow: '0 0 8px 2px rgba(212, 175, 55, 0.6)',
            }}
          />
        )}
      </div>

      <div className={`flex-1 flex flex-col ${negotiation ? 'p-1' : 'p-4'} ${isUnicorn ? 'bg-whiskey-medium rounded-[10px]' : ''}`}>
        {/* Top Section: Image */}
        <div className={`flex justify-center items-center ${negotiation ? 'mb-0.5 min-h-[160px]' : 'mb-4 min-h-[180px]'}`}>
          <div className={`${negotiation ? 'scale-[0.75] -my-2' : 'scale-110'}`}>
            <BottleImage brand={brand} bottle={bottle} />
          </div>
        </div>

        <div className={`flex flex-col ${highlightedSection === 'name_bottom' ? 'z-[200] relative shadow-[0_0_25px_rgba(255,255,255,0.2),inset_0_0_15px_rgba(255,255,255,0.1)] rounded-lg bg-white/5' : ''}`}>
          {/* Name Section - Moved Down */}
          <div className={`text-center flex flex-col justify-center ${negotiation ? 'mb-1 mt-auto min-h-[2.5rem]' : 'mb-4 min-h-[5.5rem]'}`}>
            <div className={`${negotiation ? 'text-xs' : 'text-base'} font-serif font-bold text-whiskey-gold leading-tight`}>
              {renderName()}
            </div>
          </div>

          {/* Stats Row - Smaller Cells */}
          <div className={`grid grid-cols-3 gap-1 border-t border-whiskey-light ${negotiation ? 'pt-1' : 'pt-4'}`}>
            <StatCell 
              label="Proof" 
              value={isRevealed('proof') ? bottle.proof.toString() : '?'} 
              compact={negotiation} 
              glow={stepGlow?.field === 'proof' ? (stepGlow.success ? 'success' : 'fail') : undefined}
            />
            <StatCell 
              label="Age" 
              value={isRevealed('age') ? getAgeDisplay(bottle) : '?'} 
              compact={negotiation} 
              glow={stepGlow?.field === 'age' ? (stepGlow.success ? 'success' : 'fail') : undefined}
            />
            <StatCell 
              label="Year" 
              value={isRevealed('year') ? bottle.year.toString() : '?'} 
              compact={negotiation} 
              glow={stepGlow?.field === 'year' ? (stepGlow.success ? 'success' : 'fail') : undefined}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Tag = ({ label, empty, glow, isScanning }: { label: string; empty?: boolean; glow?: 'success' | 'fail'; isScanning?: boolean; key?: string }) => (
  <div className={`relative text-[9px] px-0.5 py-1 rounded border text-center font-bold uppercase whitespace-nowrap overflow-hidden min-h-[22px] flex items-center justify-center leading-[1.1] transition-colors duration-300 ${empty ? 'border-whiskey-light/40 text-whiskey-light/30 bg-whiskey-dark/50 border-dashed' : 'border-whiskey-light bg-whiskey-dark text-whiskey-gold shadow-sm'} ${isScanning ? 'border-whiskey-gold/60 bg-whiskey-dark/80' : ''}`}>
    <AutoScalingText maxFontSize={9} minFontSize={4} className="w-full px-0.5">
      {label || '\u00A0'}
    </AutoScalingText>
    <AnimatePresence>
      {glow && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          className="absolute inset-0 rounded z-10 pointer-events-none"
          style={{
            background: glow === 'success' 
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.2) 50%, transparent 100%)',
            boxShadow: glow === 'success'
              ? '0 0 15px 2px rgba(34, 197, 94, 0.5), inset 0 0 10px rgba(34, 197, 94, 0.3)'
              : '0 0 15px 2px rgba(239, 68, 68, 0.5), inset 0 0 10px rgba(239, 68, 68, 0.3)'
          }}
        />
      )}
    </AnimatePresence>
  </div>
);

const StatCell = ({ label, value, compact, glow }: { label: string; value: string; compact?: boolean; glow?: 'success' | 'fail' }) => (
  <div className={`relative flex flex-col items-center justify-center bg-whiskey-dark rounded-lg border border-whiskey-light overflow-hidden ${compact ? 'p-0.5' : 'p-2'}`}>
    <span className={`${compact ? 'text-[6px]' : 'text-[10px]'} uppercase font-bold text-whiskey-amber opacity-60`}>{label}</span>
    <div className="w-full flex items-center justify-center h-[20px]">
      <AutoScalingText maxFontSize={compact ? 9 : 14} minFontSize={5} className="font-black text-whiskey-gold w-full text-center px-0.5">
        {value}
      </AutoScalingText>
    </div>
    <AnimatePresence>
      {glow && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.3 }}
          className="absolute inset-0 rounded-lg z-10 pointer-events-none"
          style={{
            background: glow === 'success' 
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, rgba(239, 68, 68, 0.2) 50%, transparent 100%)',
            boxShadow: glow === 'success'
              ? '0 0 20px 5px rgba(34, 197, 94, 0.5), inset 0 0 15px rgba(34, 197, 94, 0.3)'
              : '0 0 20px 5px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(239, 68, 68, 0.3)'
          }}
        />
      )}
    </AnimatePresence>
  </div>
);

const RarityBorderAnimation = ({ progress }: { progress: number }) => {
  const colors = [
    { r: 156, g: 163, b: 175 }, // Common (Grey)
    { r: 34, g: 197, b: 94 },  // Uncommon (Green)
    { r: 59, g: 130, b: 246 }, // Rare (Blue)
    { r: 168, g: 85, b: 247 }, // Epic (Purple)
    { r: 234, g: 179, b: 8 },  // Legendary (Gold)
    { r: 236, g: 72, b: 153 }  // Unicorn (Pink/Magenta base)
  ];

  const getInterpolatedColor = (p: number) => {
    // Ensure we reach the final color exactly at progress = 1
    const scaledP = p * (colors.length - 1);
    const index = Math.min(Math.floor(scaledP), colors.length - 2);
    const nextIndex = index + 1;
    const factor = scaledP - index;

    const c1 = colors[index];
    const c2 = colors[nextIndex];

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const currentColor = getInterpolatedColor(progress);
  const isUnicorn = progress > 0.8; // Start unicorn transition earlier for prominence

  // Path coordinates - perfectly overlap the card bounds
  const offset = 0;
  const radius = 4.2;
  const path1 = `M 50 -${offset} L ${100 + offset - radius} -${offset} Q ${100 + offset} -${offset}, ${100 + offset} ${radius - offset} L ${100 + offset} ${100 + offset - radius} Q ${100 + offset} ${100 + offset}, ${100 + offset - radius} ${100 + offset} L 50 ${100 + offset}`;
  const path2 = `M 50 -${offset} L ${radius - offset} -${offset} Q -${offset} -${offset}, -${offset} ${radius - offset} L -${offset} ${100 + offset - radius} Q -${offset} ${100 + offset}, ${radius - offset} ${100 + offset} L 50 ${100 + offset}`;
  
  // Path length calculation: approx 200 units
  const totalPathLength = 200;
  const dashArray = 400; // Larger dash array for safety
  const currentDashOffset = dashArray - (progress * totalPathLength);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="unicornGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6">
              <animate attributeName="stop-color" values="#3b82f6;#ec4899;#3b82f6" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#a855f7">
              <animate attributeName="stop-color" values="#a855f7;#3b82f6;#a855f7" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ec4899">
              <animate attributeName="stop-color" values="#ec4899;#a855f7;#ec4899" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="unicornGlowFilter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="innerBlur" />
            <feGaussianBlur stdDeviation="12" result="outerBlur" />
            
            <feFlood floodColor="#3b82f6" result="blueColor" />
            <feComposite in="blueColor" in2="innerBlur" operator="in" result="blueGlow" />
            
            <feFlood floodColor="#ec4899" result="pinkColor" />
            <feComposite in="pinkColor" in2="outerBlur" operator="in" result="pinkGlow" />
            
            <feMerge>
              <feMergeNode in="pinkGlow" />
              <feMergeNode in="blueGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Right Path */}
        <path 
          d={path1} 
          fill="none" 
          stroke={isUnicorn ? "url(#unicornGradient)" : currentColor}
          strokeWidth={isUnicorn ? "6" : "5"}
          strokeLinecap="butt"
          strokeDasharray={dashArray}
          strokeDashoffset={currentDashOffset}
          filter={isUnicorn ? "url(#unicornGlowFilter)" : "url(#glowFilter)"}
          style={{ opacity: progress }}
        />
        {/* Left Path */}
        <path 
          d={path2} 
          fill="none" 
          stroke={isUnicorn ? "url(#unicornGradient)" : currentColor}
          strokeWidth={isUnicorn ? "6" : "5"}
          strokeLinecap="butt"
          strokeDasharray={dashArray}
          strokeDashoffset={currentDashOffset}
          filter={isUnicorn ? "url(#unicornGlowFilter)" : "url(#glowFilter)"}
          style={{ opacity: progress }}
        />
      </svg>
      
      {/* Outer Glow Gradient Fade (Box Shadow Layer) */}
      <div 
        className="absolute inset-0 rounded-xl transition-all duration-300"
        style={{
          boxShadow: isUnicorn 
            ? `0 0 ${30 * progress}px #3b82f6, 0 0 ${80 * progress}px #ec4899, inset 0 0 20px rgba(255,255,255,0.2)`
            : `0 0 ${45 * progress}px ${currentColor}`,
          opacity: progress * 0.95
        }}
      />
      
      {/* Extra shimmer for Unicorn */}
      {isUnicorn && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-[-10px] rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl z-[-1]"
        />
      )}
    </div>
  );
};
