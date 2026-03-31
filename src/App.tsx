/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { WhiskeyEngine, CURRENT_YEAR } from './engine';
import { NEGOTIATION_TACTICS } from './data/tactics';
import { Bottle, GameState, NegotiationState, Customer, CustomerPersonality, NegotiationPhase, Message, DialogueOption, Rarity, SaveSlot, Settings, WhiskeyType, TransactionRecord, Tactic, SkillInfo, Brand, ParentDistillery, AuctionState, AuctionBidEvent, DistilleryCategory, ReleaseType, DistilleryCodexEntry, ProductLineKnowledge, BrandKnowledge, CodexState, DailyStats } from './types';
import { BottleCard } from './components/BottleCard';
import { ShopIllustration } from './components/ShopIllustration';
import { StoreInterior } from './components/StoreInterior';
import { ContextualTutorial } from './components/ContextualTutorial';
import { SplashScreen } from './components/SplashScreen';
import { soundSystem } from './SoundSystem';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, BookOpen, Sparkles, RefreshCw, Trash2, Wallet, Calendar, User, MessageSquare, Check, X, Send, Package, TrendingUp, ArrowUpCircle, Settings as SettingsIcon, Save, Play, Plus, Minus, LogOut, ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronRight, ChevronLeft, Wrench, AlertTriangle } from 'lucide-react';
import { SHOP_TIERS, TOOLKIT_ITEMS } from './constants';

const AuctionView = ({ state, bottle, onAccept, onEndDay, isLastBottle, totalBottles, engine, gameState }: { 
  state: AuctionState, 
  bottle?: Bottle, 
  onAccept: () => void, 
  onEndDay: () => void,
  isLastBottle: boolean,
  totalBottles: number,
  engine: any,
  gameState: GameState
}) => {
  const brand = bottle ? engine.getBrand(bottle.brandId) : null;
  const [now, setNow] = useState(Date.now());

  const productLine = bottle ? gameState.productLines.find(pl => pl.id === bottle.productLineId) : null;

  useEffect(() => {
    if (state.isFinished || state.isComplete) return;
    const timer = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(timer);
  }, [state.isFinished, state.isComplete, state.startTime]);

  if (state.isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 w-full max-w-md mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-whiskey-medium p-8 rounded-[32px] border border-whiskey-light shadow-2xl w-full space-y-6"
        >
          <div className="w-20 h-20 bg-whiskey-gold/20 rounded-full flex items-center justify-center mx-auto">
            <Check size={40} className="text-whiskey-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Auction Complete</h2>
            <p className="text-stone-400 text-xs uppercase tracking-widest font-bold mt-1">All items have been sold</p>
          </div>
          <div className="bg-whiskey-dark p-4 rounded-xl border border-whiskey-light/30">
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-1">Auction Day Summary</p>
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-400 text-xs">Bottles Sold</span>
              <span className="text-white font-black">{totalBottles}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-whiskey-light/10">
              <span className="text-stone-400 text-xs">Day Status</span>
              <span className="text-whiskey-gold font-black uppercase text-[10px]">Concluded</span>
            </div>
          </div>
          <button 
            onClick={onEndDay}
            className="w-full py-4 bg-whiskey-gold hover:bg-whiskey-amber text-whiskey-dark rounded-xl font-black uppercase tracking-widest shadow-xl shadow-whiskey-gold/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Calendar size={20} />
            Finish Day
          </button>
        </motion.div>
      </div>
    );
  }

  const timeLeft = Math.max(0, Math.ceil((state.startTime + state.duration - now) / 1000));
  const elapsed = now - state.startTime;
  const smoothProgress = Math.max(0, 1 - (elapsed / state.duration));
  
  return (
    <div className="flex flex-col items-center gap-2 py-2 w-full max-h-screen overflow-hidden">
      <div className="bg-whiskey-medium p-4 rounded-[24px] border border-whiskey-light shadow-2xl w-full max-w-md text-center space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h2 className="text-xl font-black text-whiskey-gold uppercase tracking-tighter">Live Auction</h2>
            <p className="text-stone-400 text-[9px] uppercase tracking-widest font-bold">Bottle {state.currentBottleIndex + 1} of {totalBottles}</p>
          </div>
          
          {/* Clock Timer */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="fill-whiskey-dark stroke-whiskey-light/20"
                strokeWidth="3"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="10"
                className="fill-whiskey-gold"
                initial={false}
                animate={{ scale: smoothProgress }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 20}
                animate={{ strokeDashoffset: (2 * Math.PI * 20) * (1 - smoothProgress) }}
                transition={{ ease: "linear", duration: 0.1 }}
                className="text-whiskey-gold"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[9px] font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {bottle && (
          <div className="relative scale-90 -my-4">
            <BottleCard 
              bottle={bottle} 
              brand={brand} 
              negotiation={true} 
              showPurchasePrice={true} 
            />
          </div>
        )}

        <div className="bg-whiskey-dark p-3 rounded-xl border border-whiskey-light space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest">Bidders Interested</span>
            <span className="text-white font-black text-sm">{state.bidders}</span>
          </div>
          
          <div className="space-y-0.5 py-1">
            <div className="flex flex-col items-center justify-center">
              <span className="text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">Current Bid</span>
              <motion.span 
                key={state.currentBid}
                initial={{ scale: 1.1, color: '#F27D26' }}
                animate={{ scale: 1, color: '#22c55e' }}
                className="text-3xl font-black"
              >
                ${state.currentBid.toLocaleString()}
              </motion.span>
            </div>
          </div>

          {state.isFinished && (
            <div className="pt-1 border-t border-whiskey-light/30 space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-[8px] font-bold uppercase tracking-widest">Commission (15%)</span>
                <span className="text-red-400 text-[8px] font-bold">-${Math.floor(state.currentBid * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-whiskey-gold text-[9px] font-black uppercase tracking-widest">Net Payout</span>
                <span className="text-whiskey-money text-base font-black">${Math.floor(state.currentBid * 0.85).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {state.isFinished ? (
          <button 
            onClick={onAccept}
            className="w-full py-3 bg-whiskey-gold hover:bg-whiskey-amber text-whiskey-dark rounded-xl font-black uppercase tracking-widest shadow-xl shadow-whiskey-gold/20 transition-all active:scale-95 text-sm"
          >
            Accept Payout
          </button>
        ) : (
          <div className="w-full py-3 bg-whiskey-dark text-stone-600 rounded-xl font-black uppercase tracking-widest border border-whiskey-light opacity-50 text-sm">
            Bidding in Progress...
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const engine = useMemo(() => new WhiskeyEngine(), []);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const world = engine.getWorld();
    return {
      shopName: "My Whiskey Shop",
      money: 2000,
      day: 1,
      inventory: [],
      reputation: 0,
      negativeReputationDays: 0,
      isShopOpen: false,
      shopLevel: 1,
      rentOwed: 0,
      lastRentPaidDay: 0,
      customersServedToday: 0,
      dailyCustomerLimit: 3,
      isAuctionDay: false,
      auctionBottleIds: [],
      skills: {
        [WhiskeyType.BOURBON]: { level: 0, xp: 0 },
        [WhiskeyType.RYE]: { level: 0, xp: 0 },
        [WhiskeyType.SINGLE_MALT_SCOTCH]: { level: 0, xp: 0 },
        [WhiskeyType.IRISH_WHISKEY]: { level: 0, xp: 0 },
        [WhiskeyType.JAPANESE_WHISKY]: { level: 0, xp: 0 },
        [WhiskeyType.CANADIAN_WHISKY]: { level: 0, xp: 0 },
        negotiation: { level: 0, xp: 0 },
      },
      toolkit: [],
      knownCustomerNames: [],
      transactionHistory: [],
      distilleries: world.distilleries,
      brands: world.brands,
      productLines: world.productLines,
      codex: {
        discoveredDistilleries: {},
        discoveredBrands: {},
        discoveredProductLines: {}
      },
      dailyStats: {
        profit: 0,
        bottlesPurchased: 0,
        bottlesSold: 0,
        bestDealProfit: 0,
      }
    };
  });

  const addSkillXP = (skillId: string, amount: number) => {
    setGameState(prev => {
      const skills = { ...prev.skills };
      const skill = skills[skillId] || { level: 0, xp: 0 };
      
      if (skill.level >= 20) return prev; // Cap at level 20

      let newXP = skill.xp + amount;
      let newLevel = skill.level;
      
      let nextLevelXP = WhiskeyEngine.getNextLevelXP(newLevel);
      
      while (newXP >= nextLevelXP && newLevel < 20) {
        newXP -= nextLevelXP;
        newLevel++;
        if (newLevel >= 20) {
          newXP = 0; // Reset XP when hitting max level
          break;
        }
        nextLevelXP = WhiskeyEngine.getNextLevelXP(newLevel);
      }
      
      return {
        ...prev,
        skills: {
          ...skills,
          [skillId]: { level: newLevel, xp: newXP }
        }
      };
    });
  };

  const [selectedCodexDistillery, setSelectedCodexDistillery] = useState<ParentDistillery | null>(null);
  const [selectedCodexBrand, setSelectedCodexBrand] = useState<Brand | null>(null);
  const [view, setView] = useState<'main-menu' | 'inventory' | 'codex' | 'shop' | 'skills' | 'expansion' | 'tools'>('main-menu');
  const [showSplash, setShowSplash] = useState(true);
  const [isSelectingAuctionBottles, setIsSelectingAuctionBottles] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<'welcome' | 'shop_overview' | 'first_customer' | 'first_deal' | null>(null);
  const [tutorialPage, setTutorialPage] = useState(0);
  const [isNamingShop, setIsNamingShop] = useState(false);
  const [tempShopName, setTempShopName] = useState("");
  const [isSkipTutorials, setIsSkipTutorials] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState<number | null>(null);
  
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([
    { id: 1, gameState: null, lastSaved: null },
    { id: 2, gameState: null, lastSaved: null },
    { id: 3, gameState: null, lastSaved: null },
  ]);

  const [settings, setSettings] = useState<Settings>({
    musicVolume: 50,
    soundVolume: 50,
  });

  useEffect(() => {
    const savedSlots = localStorage.getItem('whiskey_save_slots');
    if (savedSlots) {
      setSaveSlots(JSON.parse(savedSlots));
    }
    const savedSettings = localStorage.getItem('whiskey_settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      soundSystem.setMusicVolume(parsedSettings.musicVolume);
      soundSystem.setSoundVolume(parsedSettings.soundVolume);
    }
  }, []);

  const saveGame = (slotId: number, state: GameState) => {
    const newSlots = saveSlots.map(slot => 
      slot.id === slotId ? { ...slot, gameState: state, lastSaved: Date.now() } : slot
    );
    setSaveSlots(newSlots);
    localStorage.setItem('whiskey_save_slots', JSON.stringify(newSlots));
  };

  const deleteSave = (slotId: number) => {
    const newSlots = saveSlots.map(slot => 
      slot.id === slotId ? { ...slot, gameState: null, lastSaved: null } : slot
    );
    setSaveSlots(newSlots);
    localStorage.setItem('whiskey_save_slots', JSON.stringify(newSlots));
  };

  const loadGame = (slotId: number) => {
    const slot = saveSlots.find(s => s.id === slotId);
    if (slot && slot.gameState) {
      if (slot.gameState.distilleries && slot.gameState.brands && slot.gameState.productLines) {
        engine.setWorld(slot.gameState.distilleries, slot.gameState.brands, slot.gameState.productLines);
      } else {
        // Fallback for older saves
        const world = engine.getWorld();
        slot.gameState.distilleries = world.distilleries;
        slot.gameState.brands = world.brands;
        slot.gameState.productLines = world.productLines;
        engine.setWorld(world.distilleries, world.brands, world.productLines);
      }
      
      // Fallback for codex
      if (!slot.gameState.codex) {
        slot.gameState.codex = {
          discoveredDistilleries: {},
          discoveredBrands: {},
          discoveredProductLines: {}
        };
      } else {
        if (!slot.gameState.codex.discoveredProductLines || Array.isArray(slot.gameState.codex.discoveredProductLines)) {
          const migrated: Record<string, ProductLineKnowledge> = {};
          if (Array.isArray(slot.gameState.codex.discoveredProductLines)) {
            slot.gameState.codex.discoveredProductLines.forEach((id: any) => {
              migrated[id] = { baseAgeKnown: true, baseProofKnown: true, modifiersKnown: [] };
            });
          }
          slot.gameState.codex.discoveredProductLines = migrated;
        }
        if (!slot.gameState.codex.discoveredBrands || Array.isArray(slot.gameState.codex.discoveredBrands)) {
          const migrated: Record<string, BrandKnowledge> = {};
          if (Array.isArray(slot.gameState.codex.discoveredBrands)) {
            slot.gameState.codex.discoveredBrands.forEach((id: any) => {
              migrated[id] = {};
            });
          }
          slot.gameState.codex.discoveredBrands = migrated;
        }
      }

      // Fallback for dailyStats
      if (!slot.gameState.dailyStats) {
        slot.gameState.dailyStats = {
          profit: 0,
          bottlesPurchased: 0,
          bottlesSold: 0,
          bestDealProfit: 0,
        };
      }
      
      setGameState(slot.gameState);
      setCurrentSlotId(slotId);
      setNegotiation(null);
      setIsSelectingAuctionBottles(false);
      setView('shop');
    }
  };

  const startNewGame = (slotId: number) => {
    setCurrentSlotId(slotId);
    setTempShopName("");
    setIsNamingShop(true);
  };

  const handleTutorialNext = () => {
    if (activeTutorial === 'welcome') {
      setActiveTutorial(null);
      setIsNamingShop(true);
    } else if (activeTutorial === 'shop_overview') {
      if (tutorialPage < 6) {
        setTutorialPage(tutorialPage + 1);
      } else {
        setActiveTutorial(null);
        setGameState(prev => ({ ...prev, tutorialProgress: { ...prev.tutorialProgress, shopOverviewSeen: true } }));
      }
    } else if (activeTutorial === 'first_customer') {
      if (tutorialPage < 1) {
        setTutorialPage(tutorialPage + 1);
      } else {
        setActiveTutorial(null);
        setGameState(prev => ({ ...prev, tutorialProgress: { ...prev.tutorialProgress, firstCustomerSeen: true } }));
      }
    } else if (activeTutorial === 'first_deal') {
      if (tutorialPage < 8) {
        setTutorialPage(tutorialPage + 1);
      } else {
        setActiveTutorial(null);
        setGameState(prev => ({ ...prev, tutorialProgress: { ...prev.tutorialProgress, firstDealSeen: true } }));
      }
    }
  };

  const finalizeNewGame = () => {
    if (!tempShopName.trim()) return;
    
    engine.regenerateWorld();
    const world = engine.getWorld();
    
    // Pre-populate codex with Legacy knowledge
    const discoveredDistilleries: Record<string, DistilleryCodexEntry> = {};
    const discoveredBrands: Record<string, BrandKnowledge> = {};
    const discoveredProductLines: Record<string, ProductLineKnowledge> = {};

    world.distilleries.forEach(d => {
      if (d.category === DistilleryCategory.LEGACY) {
        discoveredDistilleries[d.id] = {
          id: d.id,
          foundedYearKnown: true,
          statusKnown: true,
          categoryKnown: true,
          regionKnown: true
        };
        
        // Discover brands for this legacy distillery
        const legacyBrands = world.brands.filter(b => b.parentDistilleryId === d.id);
        legacyBrands.forEach(b => {
          discoveredBrands[b.id] = {};
          
          // Discover currently produced CORE product lines for these brands
          const coreProductLines = world.productLines.filter(pl => 
            pl.brandId === b.id && 
            pl.releaseType === ReleaseType.CORE && 
            (!pl.endYear || pl.endYear >= CURRENT_YEAR)
          );
          coreProductLines.forEach(pl => {
            discoveredProductLines[pl.id] = {
              baseAgeKnown: true,
              baseProofKnown: true,
              modifiersKnown: pl.modifiers
            };
          });
        });
      }
    });

    const initialState: GameState = {
      shopName: tempShopName,
      money: 2000,
      day: 1,
      inventory: [],
      reputation: 0,
      negativeReputationDays: 0,
      isShopOpen: false,
      shopLevel: 1,
      rentOwed: 0,
      lastRentPaidDay: 0,
      customersServedToday: 0,
      dailyCustomerLimit: 3,
      isAuctionDay: false,
      auctionBottleIds: [],
      skills: {
        [WhiskeyType.BOURBON]: { level: 0, xp: 0 },
        [WhiskeyType.RYE]: { level: 0, xp: 0 },
        [WhiskeyType.SINGLE_MALT_SCOTCH]: { level: 0, xp: 0 },
        [WhiskeyType.IRISH_WHISKEY]: { level: 0, xp: 0 },
        [WhiskeyType.JAPANESE_WHISKY]: { level: 0, xp: 0 },
        [WhiskeyType.CANADIAN_WHISKY]: { level: 0, xp: 0 },
        negotiation: { level: 0, xp: 0 },
      },
      knownCustomerNames: [],
      toolkit: [],
      transactionHistory: [],
      distilleries: world.distilleries,
      brands: world.brands,
      productLines: world.productLines,
      codex: {
        discoveredDistilleries,
        discoveredBrands,
        discoveredProductLines
      },
      tutorialProgress: {
        welcomeSeen: true,
        shopOverviewSeen: isSkipTutorials,
        firstCustomerSeen: isSkipTutorials,
        firstDealSeen: isSkipTutorials
      },
      dailyStats: {
        profit: 0,
        bottlesPurchased: 0,
        bottlesSold: 0,
        bestDealProfit: 0,
      }
    };
    setGameState(initialState);
    saveGame(currentSlotId!, initialState);
    setIsNamingShop(false);
    setNegotiation(null);
    setIsSelectingAuctionBottles(false);
    setView('shop');
    
    if (isSkipTutorials) {
      setActiveTutorial(null);
    } else {
      setActiveTutorial('shop_overview');
      setTutorialPage(0);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('whiskey_settings', JSON.stringify(updated));
    if (newSettings.musicVolume !== undefined) soundSystem.setMusicVolume(newSettings.musicVolume);
    if (newSettings.soundVolume !== undefined) soundSystem.setSoundVolume(newSettings.soundVolume);
  };

  const currentTier = useMemo(() => SHOP_TIERS[gameState.shopLevel - 1], [gameState.shopLevel]);
  const nextTier = useMemo(() => SHOP_TIERS[gameState.shopLevel], [gameState.shopLevel]);

  const [negotiation, setNegotiation] = useState<NegotiationState | null>(null);
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [isTacticsModalOpen, setIsTacticsModalOpen] = useState(false);
  const [openTacticCategory, setOpenTacticCategory] = useState<'soft' | 'hard' | null>(null);
  const [offerInput, setOfferInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [negotiation?.messages]);

  useEffect(() => {
    if (!gameState.isAuctionDay || !gameState.auctionState || gameState.auctionState.isFinished) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev.auctionState) return prev;
        const elapsed = Date.now() - prev.auctionState.startTime;
        const progress = Math.min(1, elapsed / prev.auctionState.duration);
        
        // Find current bid based on events
        let currentBid = prev.auctionState.currentBid;
        const pastEvents = prev.auctionState.bidEvents.filter(e => e.time <= elapsed);
        if (pastEvents.length > 0) {
          currentBid = pastEvents[pastEvents.length - 1].amount;
        }

        if (progress >= 1) {
          return {
            ...prev,
            auctionState: {
              ...prev.auctionState,
              currentBid: prev.auctionState.finalBid,
              isFinished: true
            }
          };
        }

        if (currentBid === prev.auctionState.currentBid) return prev;

        return {
          ...prev,
          auctionState: {
            ...prev.auctionState,
            currentBid
          }
        };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState.isAuctionDay, gameState.auctionState?.isFinished]);

  const generateBidEvents = (startBid: number, finalBid: number, duration: number): AuctionBidEvent[] => {
    const events: AuctionBidEvent[] = [];
    let currentTime = 0;
    let currentAmount = startBid;
    
    // Target to reach final bid 3 seconds before end
    const targetEndTime = duration - 3000;
    
    while (currentTime < targetEndTime) {
      // Every 2-12 seconds
      const wait = Math.floor(Math.random() * (12000 - 2000 + 1)) + 2000;
      currentTime += wait;
      
      if (currentTime >= targetEndTime) break;
      
      // Increase bid
      const remainingAmount = finalBid - currentAmount;
      if (remainingAmount <= 0) break;

      // Random step
      const step = Math.floor(remainingAmount * (Math.random() * 0.4 + 0.1));
      currentAmount += step;
      
      events.push({ time: currentTime, amount: currentAmount });
    }
    
    // Final bid event
    events.push({ time: targetEndTime, amount: finalBid });
    
    return events;
  };

  const updateCodexWithBottle = (codex: CodexState, bottle: Bottle, brand: Brand): { codex: CodexState, updated: boolean } => {
    const newCodex = { ...codex };
    let updated = false;

    // Ensure structures are objects (migration)
    if (Array.isArray(newCodex.discoveredBrands)) {
      const migrated: Record<string, BrandKnowledge> = {};
      newCodex.discoveredBrands.forEach((id: any) => { migrated[id] = {}; });
      newCodex.discoveredBrands = migrated;
      updated = true;
    }
    if (Array.isArray(newCodex.discoveredProductLines)) {
      const migrated: Record<string, ProductLineKnowledge> = {};
      newCodex.discoveredProductLines.forEach((id: any) => {
        migrated[id] = { baseAgeKnown: true, baseProofKnown: true, modifiersKnown: [] };
      });
      newCodex.discoveredProductLines = migrated;
      updated = true;
    }

    // Update Distillery
    const distilleryId = brand.parentDistilleryId;
    const distilleryEntry = newCodex.discoveredDistilleries[distilleryId] || {
      id: distilleryId,
      foundedYearKnown: false,
      statusKnown: false,
      categoryKnown: false,
      regionKnown: false,
    };
    
    const newMinD = distilleryEntry.minKnownYear ? Math.min(distilleryEntry.minKnownYear, bottle.year) : bottle.year;
    const newMaxD = distilleryEntry.maxKnownYear ? Math.max(distilleryEntry.maxKnownYear, bottle.year) : bottle.year;
    
    if (newMinD !== distilleryEntry.minKnownYear || newMaxD !== distilleryEntry.maxKnownYear || !newCodex.discoveredDistilleries[distilleryId]) {
      newCodex.discoveredDistilleries = {
        ...newCodex.discoveredDistilleries,
        [distilleryId]: {
          ...distilleryEntry,
          minKnownYear: newMinD,
          maxKnownYear: newMaxD
        }
      };
      updated = true;
    }

    // Update Brand
    const brandEntry = newCodex.discoveredBrands[brand.id] || {};
    const newMinB = brandEntry.minKnownYear ? Math.min(brandEntry.minKnownYear, bottle.year) : bottle.year;
    const newMaxB = brandEntry.maxKnownYear ? Math.max(brandEntry.maxKnownYear, bottle.year) : bottle.year;
    
    if (newMinB !== brandEntry.minKnownYear || newMaxB !== brandEntry.maxKnownYear || !newCodex.discoveredBrands[brand.id]) {
      newCodex.discoveredBrands = {
        ...newCodex.discoveredBrands,
        [brand.id]: {
          ...brandEntry,
          minKnownYear: newMinB,
          maxKnownYear: newMaxB
        }
      };
      updated = true;
    }

    // Update Product Line
    const plEntry = newCodex.discoveredProductLines[bottle.productLineId] || {
      baseProofKnown: false,
      baseAgeKnown: false,
      modifiersKnown: []
    };
    const newMinPL = plEntry.minKnownYear ? Math.min(plEntry.minKnownYear, bottle.year) : bottle.year;
    const newMaxPL = plEntry.maxKnownYear ? Math.max(plEntry.maxKnownYear, bottle.year) : bottle.year;
    
    if (newMinPL !== plEntry.minKnownYear || newMaxPL !== plEntry.maxKnownYear || !newCodex.discoveredProductLines[bottle.productLineId]) {
      newCodex.discoveredProductLines = {
        ...newCodex.discoveredProductLines,
        [bottle.productLineId]: {
          ...plEntry,
          minKnownYear: newMinPL,
          maxKnownYear: newMaxPL
        }
      };
      updated = true;
    }

    return { codex: newCodex, updated };
  };

  const discoverBottle = (bottle: Bottle, brand: Brand | undefined) => {
    if (!brand) return;
    
    setGameState(prev => {
      const { codex, updated } = updateCodexWithBottle(prev.codex || { 
        discoveredDistilleries: {}, 
        discoveredBrands: {}, 
        discoveredProductLines: {} 
      }, bottle, brand);
      
      if (updated) {
        return { ...prev, codex };
      }
      return prev;
    });
  };

  const handleSimulateOffer = () => {
    if (gameState.customersServedToday >= gameState.dailyCustomerLimit) {
      return;
    }

    const customer = engine.generateCustomer(gameState.shopLevel, gameState.reputation);
    
    // Dynamic buyer probability based on inventory size:
    // Base 15% + 5% per bottle, capped at 60%.
    const inventory = gameState.inventory || [];
    const auctionBottleIds = gameState.auctionBottleIds || [];
    const buyerProbability = Math.min(0.6, 0.15 + (inventory.length * 0.05));
    const isAuctionCustomer = gameState.isAuctionDay && auctionBottleIds.length > 0;
    const canBuyFromPlayer = isAuctionCustomer || (inventory.length > 0 && Math.random() < buyerProbability);

    setGameState(prev => {
      const newState = { 
        ...prev, 
        isShopOpen: true,
        customersServedToday: prev.customersServedToday + 1
      };
      
      return newState;
    });

    if (canBuyFromPlayer) {
      // Customer wants to buy from player
      let bottleToSell: Bottle;
      
      if (isAuctionCustomer) {
        const bottleId = (gameState.auctionBottleIds || [])[0];
        bottleToSell = (gameState.inventory || []).find(b => b.id === bottleId)!;
        // Remove from auction list for next customer
        setGameState(prev => ({
          ...prev,
          auctionBottleIds: (prev.auctionBottleIds || []).slice(1)
        }));
      } else {
        const inventory = gameState.inventory || [];
        bottleToSell = inventory[Math.floor(Math.random() * inventory.length)];
      }

      const isKnown = (gameState.knownCustomerNames || []).includes(customer.name);
      const neg = engine.startNegotiation(customer, bottleToSell, false, isKnown);
      discoverBottle(bottleToSell, engine.getBrand(bottleToSell.brandId));
      
      // If auction, give a premium starting offer
      if (isAuctionCustomer) {
        neg.customerPrice = Math.floor(neg.customerPrice * 1.25);
        neg.messages.push({
          id: Math.random().toString(36).substr(2, 9),
          sender: 'system',
          text: "AUCTION PREMIUM: This high-tier collector is willing to pay more for your curated selection.",
          timestamp: Date.now()
        });
      }

      setNegotiation(neg);
      setIsEditingOffer(false);
      if (!isKnown) {
        setGameState(prev => ({
          ...prev,
          knownCustomerNames: [...(prev.knownCustomerNames || []), customer.name]
        }));
      }
    } else {
      // Customer wants to sell to player
      const bottle = engine.generateRandomBottle(currentTier.rarityWeights, gameState.shopLevel);
      const isKnown = (gameState.knownCustomerNames || []).includes(customer.name);
      const neg = engine.startNegotiation(customer, bottle, true, isKnown);
      discoverBottle(bottle, engine.getBrand(bottle.brandId));
      setNegotiation(neg);
      setIsEditingOffer(false);
      if (!isKnown) {
        setGameState(prev => ({
          ...prev,
          knownCustomerNames: [...(prev.knownCustomerNames || []), customer.name]
        }));
      }
    }

    if (!gameState.tutorialProgress?.firstCustomerSeen) {
      setActiveTutorial('first_customer');
      setTutorialPage(0);
    }
  };

  const handleDialogueOption = (option: DialogueOption) => {
    if (!negotiation) return;
    if ((negotiation.usedDialogueIds || []).includes(option.id)) return;

    const playerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'player',
      text: option.label,
      timestamp: Date.now()
    };

    let newUsedIds = [...negotiation.usedDialogueIds, option.id];
    
    // Mutual exclusion for greetings
    if (option.id === 'friendly_greeting') {
      newUsedIds.push('professional_greeting');
    } else if (option.id === 'professional_greeting') {
      newUsedIds.push('friendly_greeting');
    }

    let walkAwayImpact = 0;
    const sociability = negotiation.customer.sociability;

    if (option.id === 'get_to_business') {
      // If customer is NOT chatty (low sociability), they appreciate getting to business
      if (sociability < 30) {
        walkAwayImpact = -2; // Slight decrease in walk-away chance
      }

      let customerText = engine.interpolateDialogue(
        negotiation.isPlayerBuying 
          ? `Hi, I've got this {brand} here. Interested? I'm looking for $${negotiation.customerPrice}.`
          : `Hey, I heard you might have something special for me. I'm interested in that {brand} you've got. What's your price?`,
        negotiation.customer,
        negotiation.bottle
      );

      let newlyRevealed: string[] = [];
      if (negotiation.isPlayerBuying) {
        const listeningResult = engine.processActiveListening(customerText, negotiation.bottle, negotiation.revealedFields || []);
        customerText = listeningResult.text;
        newlyRevealed = listeningResult.newlyRevealed;
      }

      const customerMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'customer',
        text: customerText,
        timestamp: Date.now() + 500
      };

      setNegotiation({
        ...negotiation,
        phase: NegotiationPhase.DEAL,
        usedDialogueIds: newUsedIds,
        walkAwayChance: Math.max(0, negotiation.walkAwayChance + walkAwayImpact),
        messages: [...negotiation.messages, playerMsg, customerMsg],
        revealedFields: [...(negotiation.revealedFields || []), ...newlyRevealed]
      });
      
      if (!gameState.tutorialProgress?.firstDealSeen) {
        setActiveTutorial('first_deal');
        setTutorialPage(0);
      }
      return;
    }

    // Small talk impact
    if (option.type === 'smalltalk') {
      if (sociability < 30) {
        // Low sociability customer gets annoyed by small talk
        walkAwayImpact = 5; 
      } else if (sociability > 70) {
        // High sociability customer enjoys small talk
        walkAwayImpact = -3;
      }
    }

    let customerText = engine.getDialogueResponse(negotiation.customer, option.id, negotiation.isPlayerBuying, negotiation.bottle);
    let newlyRevealed: string[] = [];

    if (negotiation.isPlayerBuying) {
      const listeningResult = engine.processActiveListening(customerText, negotiation.bottle, negotiation.revealedFields || []);
      customerText = listeningResult.text;
      newlyRevealed = listeningResult.newlyRevealed;
    }

    const customerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'customer',
      text: customerText,
      timestamp: Date.now() + 500
    };

    setNegotiation({
      ...negotiation,
      usedDialogueIds: newUsedIds,
      walkAwayChance: Math.max(0, negotiation.walkAwayChance + walkAwayImpact),
      messages: [...negotiation.messages, playerMsg, customerMsg],
      revealedFields: [...(negotiation.revealedFields || []), ...newlyRevealed]
    });
  };

  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResults, setInspectionResults] = useState<string[]>([]);
  const [preInspectionRevealedFields, setPreInspectionRevealedFields] = useState<string[]>([]);

  const handleInspectBottle = useCallback(() => {
    if (!negotiation || negotiation.hasInspected || isInspecting) return;
    
    const skillInfo = (gameState.skills || {})[negotiation.bottle.type] || { level: 0, xp: 0 };
    const mastery = skillInfo.level;
    const ownedToolkit = TOOLKIT_ITEMS.filter(item => (gameState.toolkit || []).includes(item.id));
    const revealed = engine.calculateInspectResult(negotiation.bottle, mastery, ownedToolkit);
    
    setInspectionResults(revealed);
    setPreInspectionRevealedFields(negotiation.revealedFields || []);
    setIsInspecting(true);
    
    setNegotiation(current => {
      if (!current) return current;
      return {
        ...current,
        hasInspected: true
      };
    });
  }, [negotiation, isInspecting, gameState.skills, gameState.toolkit, engine]);

  const handleInspectionStepComplete = useCallback((field: string, wasSuccessful: boolean) => {
    if (!negotiation) return;
    
    if (wasSuccessful) {
      setNegotiation(prev => {
        if (!prev) return null;
        const currentRevealed = prev.revealedFields || [];
        if (currentRevealed.includes(field)) return prev;
        return {
          ...prev,
          revealedFields: [...currentRevealed, field]
        };
      });
    }
  }, [negotiation]);

  const handleInspectionFinished = useCallback(() => {
    setIsInspecting(false);
    if (!negotiation) return;

    const newlyRevealed = inspectionResults.filter(f => {
      const prevRevealed = preInspectionRevealedFields || [];
      if (prevRevealed.includes(f)) return false;
      if (f.startsWith('modifiers_')) {
        const idx = parseInt(f.split('_')[1]);
        const modValue = negotiation.bottle.modifiers[idx];
        if (prevRevealed.includes('modifiers') || (modValue && prevRevealed.includes(modValue))) {
          return false;
        }
      }
      return true;
    });
    
    const fieldNames: Record<string, string> = {
      'year': 'Year',
      'rarity': 'Rarity',
      'age': 'Age',
      'proof': 'Proof',
      'type': 'Type',
      'region': 'Region',
      'modifiers_0': 'Modifier',
      'modifiers_1': 'Modifier',
      'modifiers_2': 'Modifier'
    };
    const newlyRevealedNames = newlyRevealed.map(f => fieldNames[f] || f);

    const playerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'player',
      text: "Let me take a closer look at this bottle...",
      timestamp: Date.now()
    };

    const responseText = engine.getDialogueResponse(negotiation.customer, 'inspect_bottle', negotiation.isPlayerBuying, negotiation.bottle);
    const customerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'customer',
      text: responseText + (newlyRevealedNames.length > 0 ? ` (You discovered: ${newlyRevealedNames.join(', ')})` : " (You didn't find anything new)"),
      timestamp: Date.now() + 500
    };

    // Increase walk away chance
    let nextWalkAwayChance = negotiation.walkAwayChance;
    if (Math.random() < 0.7) {
      nextWalkAwayChance = Math.min(100, nextWalkAwayChance + 10 + (negotiation.customer.aggressiveness / 5));
    }

    setGameState(prev => {
      const newCodex = { ...prev.codex };
      const brand = engine.getBrand(negotiation.bottle.brandId);
      const distillery = engine.getDistillery(brand?.parentDistilleryId || '');
      let updatedCodex = false;

      // Ensure discoveredProductLines is an object (migration from array if needed)
      if (Array.isArray(newCodex.discoveredProductLines)) {
        const migrated: Record<string, any> = {};
        newCodex.discoveredProductLines.forEach(id => {
          migrated[id] = { baseAgeKnown: true, baseProofKnown: true, modifiersKnown: [] };
        });
        newCodex.discoveredProductLines = migrated;
        updatedCodex = true;
      }
      if (!newCodex.discoveredProductLines) {
        newCodex.discoveredProductLines = {};
        updatedCodex = true;
      }

      const plId = negotiation.bottle.productLineId;
        if (plId) {
          if (!newCodex.discoveredProductLines[plId]) {
            newCodex.discoveredProductLines[plId] = {
              baseAgeKnown: false,
              baseProofKnown: false,
              modifiersKnown: []
            };
            updatedCodex = true;
          }
          
          const plKnowledge = newCodex.discoveredProductLines[plId];
          
          if (inspectionResults.includes('age') && !plKnowledge.baseAgeKnown) {
          plKnowledge.baseAgeKnown = true;
          updatedCodex = true;
        }
        if (inspectionResults.includes('proof') && !plKnowledge.baseProofKnown) {
          plKnowledge.baseProofKnown = true;
          updatedCodex = true;
        }

        negotiation.bottle.modifiers.forEach((mod, index) => {
          if (inspectionResults.includes(`modifiers_${index}`)) {
            if (!plKnowledge.modifiersKnown.includes(mod)) {
              plKnowledge.modifiersKnown.push(mod);
              updatedCodex = true;
            }
          }
        });
      }

      if (brand) {
        const { codex: updatedCodexState, updated } = updateCodexWithBottle(newCodex as CodexState, negotiation.bottle, brand);
        if (updated) {
          newCodex.discoveredDistilleries = updatedCodexState.discoveredDistilleries;
          newCodex.discoveredBrands = updatedCodexState.discoveredBrands;
          newCodex.discoveredProductLines = updatedCodexState.discoveredProductLines;
          updatedCodex = true;
        }
      }

      return updatedCodex ? { ...prev, codex: newCodex } : prev;
    });

    setNegotiation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        walkAwayChance: nextWalkAwayChance,
        turn: prev.turn + 1,
        messages: [...prev.messages, playerMsg, customerMsg]
      };
    });

    // Skill progression: 25% chance to gain 10 XP on inspection
    if (Math.random() < 0.25) {
      addSkillXP(negotiation.bottle.type, 10);
    }
  }, [negotiation, inspectionResults, engine, gameState.skills, gameState.toolkit]);

  const finalizeTransaction = (price: number) => {
    if (!negotiation) return;

    if (negotiation.isPlayerBuying) {
      if ((gameState.inventory || []).length >= currentTier.inventoryLimit) {
        const systemMsg: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'system',
          text: `Inventory full! Your ${currentTier.name} can only hold ${currentTier.inventoryLimit} bottles. Upgrade your shop to hold more.`,
          timestamp: Date.now()
        };
        setNegotiation({
          ...negotiation,
          messages: [...negotiation.messages, systemMsg]
        });
        return false;
      }

      if (gameState.money < price) {
        const systemMsg: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'system',
          text: "Insufficient funds. You cannot afford this bottle.",
          timestamp: Date.now()
        };
        setNegotiation({
          ...negotiation,
          messages: [...negotiation.messages, systemMsg]
        });
        return false;
      }
    }

    const discoveredFields = negotiation.isPlayerBuying 
      ? (negotiation.revealedFields || [])
      : (negotiation.bottle.discoveredFields || []);

    const wasYearKnown = discoveredFields.includes('year');
    const revealedModifiers = negotiation.bottle.modifiers.filter((m, idx) => 
      discoveredFields.includes(m) || 
      discoveredFields.includes('modifiers') || 
      discoveredFields.includes(`modifiers_${idx}`)
    );

    const brand = engine.getBrand(negotiation.bottle.brandId);
    const brandName = brand ? brand.name : negotiation.bottle.name.split(' ').slice(1, -1).join(' ');

    const transaction: TransactionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      bottleId: negotiation.bottle.id,
      brandId: negotiation.bottle.brandId,
      brandName,
      year: negotiation.bottle.year,
      modifiers: revealedModifiers,
      rarity: negotiation.bottle.rarity,
      type: negotiation.bottle.type,
      buyPrice: negotiation.isPlayerBuying ? price : undefined,
      sellPrice: !negotiation.isPlayerBuying ? price : undefined,
      wasYearKnown,
      timestamp: Date.now()
    };

    if (negotiation.isPlayerBuying) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - price,
        inventory: [{ 
          ...negotiation.bottle, 
          purchasePrice: price,
          discoveredFields: [...(negotiation.revealedFields || []), 'region', 'type']
        }, ...(prev.inventory || [])],
        transactionHistory: [transaction, ...(prev.transactionHistory || [])],
        dailyStats: {
          ...prev.dailyStats,
          profit: prev.dailyStats.profit - price,
          bottlesPurchased: prev.dailyStats.bottlesPurchased + 1
        }
      }));
    } else {
      setGameState(prev => {
        const history = prev.transactionHistory || [];
        // Try to find the original buy record to link them
        const existingRecordIndex = history.findIndex(t => t.bottleId === negotiation.bottle.id && t.buyPrice !== undefined);
        
        let newHistory = [...history];
        let bottleProfit = 0;
        if (existingRecordIndex !== -1) {
          const buyPrice = newHistory[existingRecordIndex].buyPrice || 0;
          bottleProfit = price - buyPrice;
          // Update the existing record with the sell price and current knowledge
          newHistory[existingRecordIndex] = {
            ...newHistory[existingRecordIndex],
            sellPrice: price,
            wasYearKnown,
            modifiers: revealedModifiers, // Update with potentially more discovered modifiers
            timestamp: Date.now() // Update timestamp to reflect the latest action
          };
        } else {
          // If for some reason we don't have a buy record (e.g. starting inventory), add a new one
          newHistory = [transaction, ...newHistory];
        }

        return {
          ...prev,
          money: prev.money + price,
          inventory: (prev.inventory || []).filter(b => b.id !== negotiation.bottle.id),
          transactionHistory: newHistory,
          dailyStats: {
            ...prev.dailyStats,
            profit: prev.dailyStats.profit + price,
            bottlesSold: prev.dailyStats.bottlesSold + 1,
            bestDealProfit: Math.max(prev.dailyStats.bestDealProfit, bottleProfit)
          }
        };
      });
    }
    
    // Reputation gain based on rarity
    const rarityGains: Record<Rarity, number> = {
      [Rarity.COMMON]: 1,
      [Rarity.UNCOMMON]: 2,
      [Rarity.RARE]: 3,
      [Rarity.EPIC]: 5,
      [Rarity.LEGENDARY]: 8,
      [Rarity.UNICORN]: 15,
    };
    adjustReputation(rarityGains[negotiation.bottle.rarity] || 1);
    
    // Award XP for successful deal
    addSkillXP('negotiation', 50);
    addSkillXP(negotiation.bottle.type, 30);

    return true;
  };

  const handleBuyToolkitItem = (itemId: string) => {
    const item = TOOLKIT_ITEMS.find(i => i.id === itemId);
    if (!item || gameState.money < item.cost || (gameState.toolkit || []).includes(itemId)) return;

    setGameState(prev => ({
      ...prev,
      money: prev.money - item.cost,
      toolkit: [...(prev.toolkit || []), itemId]
    }));
    
    soundSystem.playEffect('cash');
  };

  const adjustReputation = (amount: number) => {
    setGameState(prev => {
      let change = amount;
      
      // If it's a loss, scale it by shop level (harder to maintain at higher tiers)
      if (amount < 0) {
        // Tier 1: 1x loss, Tier 6: 2.5x loss
        const scalingFactor = 1 + (prev.shopLevel - 1) * 0.3;
        change = amount * scalingFactor;
      } else {
        // Gains are slightly harder at higher tiers too
        const gainFactor = Math.max(0.4, 1 - (prev.shopLevel - 1) * 0.1);
        change = amount * gainFactor;
      }

      const newRep = Math.max(-100, Math.min(100, prev.reputation + change));
      return { ...prev, reputation: newRep };
    });
  };

  const adjustPrice = (amount: number) => {
    if (!negotiation) return;
    const newVal = negotiation.isPlayerBuying
      ? Math.max(negotiation.minPrice, Math.min(negotiation.maxPrice, negotiation.currentOffer + amount))
      : Math.max(1, negotiation.currentOffer + amount);
    setNegotiation({ ...negotiation, currentOffer: newVal });
    setOfferInput(newVal.toString());
  };

  const handleCounterOffer = (amount: number) => {
    if (!negotiation) return;

    const newTurn = negotiation.turn + 1;
    const tolerance = (negotiation.bottle.value * 0.15) * (negotiation.customer.patience / 50);

    if (amount <= 0) return;

    const playerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'player',
      text: `I can offer $${amount}.`,
      timestamp: Date.now()
    };

    const response = engine.getCounterOfferResponse(
      negotiation.customer,
      negotiation.isPlayerBuying,
      amount,
      negotiation.targetPrice,
      negotiation.customerPrice,
      tolerance,
      newTurn,
      negotiation.walkAwayChance,
      gameState.reputation,
      negotiation.bottle
    );

    let customerText = response.text;
    let newlyRevealed: string[] = [];

    if (negotiation.isPlayerBuying) {
      const listeningResult = engine.processActiveListening(customerText, negotiation.bottle, negotiation.revealedFields || []);
      customerText = listeningResult.text;
      newlyRevealed = listeningResult.newlyRevealed;
    }

    const customerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'customer',
      text: customerText,
      timestamp: Date.now() + 500
    };

    if (response.walkAway) {
      let penalty = -2; // Base penalty for average customers
      if (negotiation.customer.personality === CustomerPersonality.EXPERT || 
          negotiation.customer.personality === CustomerPersonality.GREEDY) {
        penalty = -5; // High impact: Experts and Greedy customers complain more
      } else if (negotiation.customer.personality === CustomerPersonality.SKEPTIC) {
        penalty = -4; // Moderate impact: Skeptics are vocal
      } else if (negotiation.customer.personality === CustomerPersonality.COLLECTOR) {
        penalty = -3; // Standard impact: Collectors are disappointed
      }
      adjustReputation(penalty);
    }

    if (response.deal) {
      const success = finalizeTransaction(amount);
      if (success) {
        setNegotiation({
          ...negotiation,
          currentOffer: amount,
          turn: newTurn,
          walkAwayChance: response.nextWalkAwayChance,
          messages: [...negotiation.messages, playerMsg, customerMsg],
          isFinished: true,
          revealedFields: [...(negotiation.revealedFields || []), ...newlyRevealed]
        });
      }
    } else if (response.walkAway) {
      setNegotiation({
        ...negotiation,
        messages: [...negotiation.messages, playerMsg, customerMsg],
        isFinished: true,
        revealedFields: [...(negotiation.revealedFields || []), ...newlyRevealed]
      });
    } else {
      setNegotiation({
        ...negotiation,
        customerPrice: response.counter!,
        currentOffer: amount,
        turn: newTurn,
        walkAwayChance: response.nextWalkAwayChance,
        messages: [...negotiation.messages, playerMsg, customerMsg],
        revealedFields: [...(negotiation.revealedFields || []), ...newlyRevealed]
      });
    }
  };

  const handleApplyTactic = (tacticId: string) => {
    if (!negotiation) return;
    
    const tactic = NEGOTIATION_TACTICS.find(t => t.id === tacticId);
    if (!tactic) return;

    const skillInfo = (gameState.skills || {}).negotiation || { level: 0, xp: 0 };
    const skillLevel = skillInfo.level;
    
    const playerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'player',
      text: tactic.playerDialogue(skillLevel, negotiation.isPlayerBuying),
      timestamp: Date.now()
    };

    const result = engine.applyTactic(negotiation, tacticId, skillLevel);
    
    let customerText = result.response;
    let loreText = "";

    if (result.loreDrop) {
      const brand = engine.getBrand(negotiation.bottle.brandId);
      const distillery = engine.getDistillery(brand?.parentDistilleryId || '');
      
      if (brand && distillery) {
        const codex = gameState.codex;
        const entry = codex.discoveredDistilleries[distillery.id] || {
          id: distillery.id,
          foundedYearKnown: false,
          statusKnown: false,
          categoryKnown: false,
        };

        if (result.loreDrop === 'foundedYear' && !entry.foundedYearKnown) {
          loreText = `[Codex Updated: ${distillery.name} was founded in ${distillery.foundedYear}]`;
        } else if (result.loreDrop === 'status' && !entry.statusKnown) {
          loreText = `[Codex Updated: ${distillery.name} is ${distillery.closedYear ? 'Defunct' : 'Active'}]`;
        } else if (result.loreDrop === 'category' && !entry.categoryKnown) {
          loreText = `[Codex Updated: ${distillery.name} is a ${distillery.category} distillery]`;
        } else if (result.loreDrop === 'region' && !entry.regionKnown) {
          loreText = `[Codex Updated: ${distillery.name} is located in ${distillery.region}]`;
        } else if (result.loreDrop === 'brand') {
          const allBrands = engine.getAllBrands().filter(b => b.parentDistilleryId === distillery.id);
          const undiscovered = allBrands.find(b => !codex.discoveredBrands[b.id]);
          if (undiscovered) {
            loreText = `[Codex Updated: Discovered brand '${undiscovered.name}' from ${distillery.name}]`;
          }
        }

        if (loreText) {
          setGameState(prev => {
            const newCodex = { ...prev.codex };
            const newEntry = { ...(newCodex.discoveredDistilleries[distillery.id] || entry) };

            if (result.loreDrop === 'foundedYear') newEntry.foundedYearKnown = true;
            else if (result.loreDrop === 'status') newEntry.statusKnown = true;
            else if (result.loreDrop === 'category') newEntry.categoryKnown = true;
            else if (result.loreDrop === 'region') newEntry.regionKnown = true;
            else if (result.loreDrop === 'brand') {
              const allBrands = engine.getAllBrands().filter(b => b.parentDistilleryId === distillery.id);
              const undiscovered = allBrands.find(b => !newCodex.discoveredBrands[b.id]);
              if (undiscovered) {
                const { codex: updatedCodexState } = updateCodexWithBottle(newCodex as CodexState, engine.generateBottle(undiscovered.id, undiscovered.startYear), undiscovered);
                newCodex.discoveredDistilleries = updatedCodexState.discoveredDistilleries;
                newCodex.discoveredBrands = updatedCodexState.discoveredBrands;
                newCodex.discoveredProductLines = updatedCodexState.discoveredProductLines;
              }
            }

            newCodex.discoveredDistilleries[distillery.id] = newEntry;
            return { ...prev, codex: newCodex };
          });
        }
      }
    }

    const customerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'customer',
      text: customerText,
      timestamp: Date.now() + 500,
      color: result.color
    };

    const newMessages = [...negotiation.messages, playerMsg, customerMsg];
    if (loreText) {
      newMessages.push({
        id: Math.random().toString(36).substr(2, 9),
        sender: 'system',
        text: loreText,
        timestamp: Date.now() + 1000,
        color: 'green'
      });
    }

    setNegotiation({
      ...result.state,
      messages: newMessages
    });
    
    setIsTacticsModalOpen(false);
    
    // Award XP for using a tactic
    addSkillXP('negotiation', result.xpGain);
  };

  const handleAcceptDeal = () => {
    if (!negotiation) return;

    const price = negotiation.customerPrice;
    const success = finalizeTransaction(price);

    if (!success) return;

    const playerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'player',
      text: "I'll take that deal.",
      timestamp: Date.now()
    };

    const customerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'customer',
      text: "Excellent. Pleasure doing business with you!",
      timestamp: Date.now() + 300
    };

    const nextNeg = {
      ...negotiation,
      messages: [...negotiation.messages, playerMsg, customerMsg],
      isFinished: true
    };
    setNegotiation(nextNeg);
    
    // Auto-save after deal
    if (currentSlotId) {
      setGameState(prev => {
        saveGame(currentSlotId, prev);
        return prev;
      });
    }
  };

  const handleDeclineDeal = () => {
    if (!negotiation) return;

    const playerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'player',
      text: "I'm not interested at that price. I'll pass.",
      timestamp: Date.now()
    };

    const customerMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'customer',
      text: "Suit yourself. I'll find someone else.",
      timestamp: Date.now() + 300
    };

    setNegotiation({
      ...negotiation,
      messages: [...negotiation.messages, playerMsg, customerMsg],
      isFinished: true
    });

    adjustReputation(-2);
  };

  const handleResearchBottle = (bottle: Bottle) => {
    const skillInfo = (gameState.skills || {})[bottle.type] || { level: 0, xp: 0 };
    const skillLevel = skillInfo.level;
    
    // Cost decreases with skill level
    const researchCost = Math.max(25, 150 - (skillLevel * 25));

    if (gameState.money < researchCost) {
      // Not enough money
      return;
    }

    setGameState(prev => {
      const newCodex = { ...prev.codex };
      const brand = engine.getBrand(bottle.brandId);
      const distillery = engine.getDistillery(brand?.parentDistilleryId || '');
      
      let updatedCodex = false;

      if (bottle.productLineId) {
        if (!newCodex.discoveredProductLines[bottle.productLineId]) {
          const brand = engine.getBrand(bottle.brandId);
          if (brand) {
            const { codex: updatedCodexState, updated } = updateCodexWithBottle(newCodex as CodexState, bottle, brand);
            if (updated) {
              newCodex.discoveredDistilleries = updatedCodexState.discoveredDistilleries;
              newCodex.discoveredBrands = updatedCodexState.discoveredBrands;
              newCodex.discoveredProductLines = updatedCodexState.discoveredProductLines;
              updatedCodex = true;
            }
          }
        }
      }

      if (brand) {
        const { codex: updatedCodexState, updated } = updateCodexWithBottle(newCodex as CodexState, negotiation.bottle, brand);
        if (updated) {
          newCodex.discoveredDistilleries = updatedCodexState.discoveredDistilleries;
          newCodex.discoveredBrands = updatedCodexState.discoveredBrands;
          newCodex.discoveredProductLines = updatedCodexState.discoveredProductLines;
          updatedCodex = true;
        }
      }

      if (distillery) {
        const entry = newCodex.discoveredDistilleries[distillery.id] || {
          id: distillery.id,
          foundedYearKnown: false,
          statusKnown: false,
          categoryKnown: false,
          regionKnown: false,
        };

        // Level 0+: Category & Region
        if (!entry.categoryKnown) { entry.categoryKnown = true; updatedCodex = true; }
        if (!entry.regionKnown) { entry.regionKnown = true; updatedCodex = true; }
        
        // Level 4+: Discover a random brand
        if (skillLevel >= 4) {
          const allBrands = engine.getAllBrands().filter(b => b.parentDistilleryId === distillery.id);
          const undiscovered = allBrands.find(b => !newCodex.discoveredBrands[b.id]);
          if (undiscovered) {
            discoverBottle(engine.generateBottle(undiscovered.id, undiscovered.startYear), undiscovered);
          }
        }

        if (updatedCodex) {
          newCodex.discoveredDistilleries[distillery.id] = entry;
        }
      }

      const newState = {
        ...prev,
        money: prev.money - researchCost,
        codex: updatedCodex ? newCodex : prev.codex,
        inventory: prev.inventory.map(b => b.id === bottle.id ? { 
          ...b, 
          rarityDiscovered: true,
          discoveredFields: ['year', 'type', 'proof', 'age', 'region', 'rarity', 'modifiers', 'name', 'value']
        } : b)
      };
      if (currentSlotId) saveGame(currentSlotId, newState);
      return newState;
    });
  };

  const handleNextDay = () => {
    startNextDay();
  };

  const startNextDay = () => {
    const nextTierObj = SHOP_TIERS[gameState.shopLevel - 1];
    const newLimit = Math.floor(Math.random() * (nextTierObj.maxCustomers - nextTierObj.minCustomers + 1)) + nextTierObj.minCustomers;
    
    const newDay = gameState.day + 1;
    let newRentOwed = gameState.rentOwed;
    let newGameOver = false;
    let gameOverReason: 'bankruptcy' | 'reputation' | undefined = undefined;

    // Rent Logic (Every 7 days)
    if (newDay % 7 === 0) {
      // If they already owed rent from the PREVIOUS cycle and it's now the NEXT rent day
      if (newRentOwed > 0) {
        newGameOver = true;
        gameOverReason = 'bankruptcy';
      }
      newRentOwed += nextTierObj.rent;
    }

    // Reputation Logic
    let newNegativeReputationDays = gameState.reputation < 0 ? gameState.negativeReputationDays + 1 : 0;
    if (newNegativeReputationDays >= 3) {
      newGameOver = true;
      gameOverReason = 'reputation';
    }

    const newState: GameState = { 
      ...gameState, 
      day: newDay, 
      isShopOpen: false, 
      customersServedToday: 0,
      dailyCustomerLimit: newLimit,
      isAuctionDay: false,
      auctionBottleIds: [],
      auctionState: undefined,
      rentOwed: newRentOwed,
      negativeReputationDays: newNegativeReputationDays,
      isGameOver: newGameOver,
      gameOverReason: gameOverReason,
      dailyStats: {
        profit: 0,
        bottlesPurchased: 0,
        bottlesSold: 0,
        bestDealProfit: 0,
      }
    };
    
    setGameState(newState);
    if (currentSlotId) saveGame(currentSlotId, newState);
    setNegotiation(null);
    setIsSelectingAuctionBottles(false);
  };

  const handlePayRent = () => {
    if (gameState.money < gameState.rentOwed) return;
    
    setGameState(prev => {
      const newState = {
        ...prev,
        money: prev.money - prev.rentOwed,
        rentOwed: 0,
        lastRentPaidDay: prev.day
      };
      if (currentSlotId) saveGame(currentSlotId, newState);
      return newState;
    });
    soundSystem.playEffect('cash');
  };

  const startAuction = (selectedBottleIds: string[]) => {
    const firstBottleId = selectedBottleIds[0];
    const firstBottle = (gameState.inventory || []).find(b => b.id === firstBottleId);
    
    let auctionState: AuctionState | undefined;
    if (firstBottle) {
      const bidders = engine.getAuctionBidders(gameState.shopLevel);
      const finalBid = engine.getAuctionFinalBid(firstBottle, gameState.shopLevel, bidders);
      const startBid = Math.floor(finalBid * 0.3);
      const duration = 30000;
      auctionState = {
        currentBottleIndex: 0,
        bidders,
        finalBid,
        currentBid: startBid,
        startTime: Date.now(),
        duration,
        isFinished: false,
        bidEvents: generateBidEvents(startBid, finalBid, duration)
      };
    }

    setGameState(prev => ({
      ...prev,
      isAuctionDay: true,
      auctionBottleIds: selectedBottleIds,
      isShopOpen: true,
      customersServedToday: prev.dailyCustomerLimit, // Auction takes the whole day
      auctionState
    }));
    setIsSelectingAuctionBottles(false);
  };

  const handleAcceptAuctionBid = () => {
    if (!gameState.auctionState || !gameState.auctionState.isFinished) return;

    const bottleId = gameState.auctionBottleIds[gameState.auctionState.currentBottleIndex];
    const bottle = gameState.inventory.find(b => b.id === bottleId)!;
    const finalBid = gameState.auctionState.finalBid;
    const netPayout = Math.floor(finalBid * 0.85);

    const transaction: TransactionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      bottleId: bottle.id,
      brandId: bottle.brandId,
      brandName: engine.getBrand(bottle.brandId)?.name || 'Unknown',
      year: bottle.year,
      modifiers: bottle.modifiers,
      rarity: bottle.rarity,
      type: bottle.type,
      sellPrice: netPayout,
      wasYearKnown: bottle.discoveredFields.includes('year'),
      wasAuction: true,
      timestamp: Date.now()
    };

    const nextIndex = gameState.auctionState.currentBottleIndex + 1;
    const isLastBottle = nextIndex >= gameState.auctionBottleIds.length;

    let nextAuctionState: AuctionState | undefined;
    if (!isLastBottle) {
      const nextBottleId = gameState.auctionBottleIds[nextIndex];
      const nextBottle = gameState.inventory.find(b => b.id === nextBottleId)!;
      const bidders = engine.getAuctionBidders(gameState.shopLevel);
      const finalBid = engine.getAuctionFinalBid(nextBottle, gameState.shopLevel, bidders);
      const startBid = Math.floor(finalBid * 0.3);
      const duration = 30000;
      nextAuctionState = {
        currentBottleIndex: nextIndex,
        bidders,
        finalBid,
        currentBid: startBid,
        startTime: Date.now(),
        duration,
        isFinished: false,
        bidEvents: generateBidEvents(startBid, finalBid, duration)
      };
    } else {
      // Last bottle sold, set isComplete to show summary
      nextAuctionState = {
        ...gameState.auctionState,
        isComplete: true
      };
    }

    setGameState(prev => {
      const history = prev.transactionHistory || [];
      const existingRecordIndex = history.findIndex(t => t.bottleId === bottleId && t.buyPrice !== undefined);
      let bottleProfit = 0;
      if (existingRecordIndex !== -1) {
        const buyPrice = history[existingRecordIndex].buyPrice || 0;
        bottleProfit = netPayout - buyPrice;
      }

      return {
        ...prev,
        money: prev.money + netPayout,
        inventory: prev.inventory.filter(b => b.id !== bottleId),
        transactionHistory: [...prev.transactionHistory, transaction],
        auctionState: nextAuctionState,
        dailyStats: {
          ...prev.dailyStats,
          profit: prev.dailyStats.profit + netPayout,
          bottlesSold: prev.dailyStats.bottlesSold + 1,
          bestDealProfit: Math.max(prev.dailyStats.bestDealProfit, bottleProfit)
        }
      };
    });
  };

  const handleUpgradeShop = () => {
    if (!nextTier || gameState.money < nextTier.upgradeCost || gameState.reputation < currentTier.minReputationToUpgrade) return;

    const newState: GameState = {
      ...gameState,
      money: gameState.money - nextTier.upgradeCost,
      shopLevel: gameState.shopLevel + 1,
      reputation: nextTier.baseReputation
    };
    setGameState(newState);
    if (currentSlotId) saveGame(currentSlotId, newState);
    setView('shop');
  };

  if (view === 'main-menu') {
    return (
      <>
        <AnimatePresence>
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>
        <div className="min-h-screen bg-whiskey-dark text-stone-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-whiskey-gold/10 to-transparent opacity-50" />
        
        {/* Placeholder Logo */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 mb-6 text-center"
        >
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-whiskey-gold/20 blur-2xl rounded-full" />
            <img 
              src="/logo.png" 
              alt="Vintage Spirits Logo" 
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
            Vintage <span className="text-whiskey-gold">Spirits</span>
          </h1>
          <p className="text-stone-400 uppercase tracking-widest text-[10px] font-bold mt-2">The Ultimate Whiskey Merchant Sim</p>
        </motion.div>

        {/* Save Slots */}
        <div className="w-full max-w-sm space-y-1.5 relative z-10">
          {saveSlots.map(slot => (
            <div key={slot.id} className="bg-whiskey-medium border border-whiskey-light rounded-xl p-2.5 flex items-center justify-between shadow-xl">
              <div className="flex-1">
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Slot {slot.id}</h3>
                {slot.gameState ? (
                  <div className="text-[9px] text-stone-400">
                    <p className="text-whiskey-gold font-bold">{slot.gameState.shopName}</p>
                    <p>Day {slot.gameState.day} • ${slot.gameState.money.toLocaleString()}</p>
                    {slot.gameState.isGameOver && (
                      <p className="text-red-500 font-bold uppercase tracking-widest mt-0.5">Game Over</p>
                    )}
                  </div>
                ) : (
                  <p className="text-[9px] text-stone-500 italic">Empty Slot</p>
                )}
              </div>
              <div className="flex gap-1.5">
                {slot.gameState ? (
                  <>
                    <button 
                      onClick={() => loadGame(slot.id)}
                      className="p-1.5 bg-whiskey-gold text-whiskey-dark rounded-lg hover:bg-whiskey-amber transition-all"
                    >
                      <Play size={16} />
                    </button>
                    <button 
                      onClick={() => deleteSave(slot.id)}
                      className="p-1.5 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => startNewGame(slot.id)}
                    className="p-1.5 bg-whiskey-dark text-whiskey-gold border border-whiskey-light rounded-lg hover:bg-black transition-all"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="mt-6 flex gap-4 relative z-10">
          <button 
            onClick={() => setIsOptionsOpen(true)}
            className="px-5 py-2 bg-whiskey-medium border border-whiskey-light text-stone-300 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-whiskey-dark transition-all flex items-center gap-2"
          >
            <SettingsIcon size={14} />
            Options
          </button>
        </div>

        {/* Shop Naming Prompt */}
        <AnimatePresence>
          {isNamingShop && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-whiskey-medium border border-whiskey-light p-8 rounded-[32px] max-w-sm w-full text-center space-y-6 shadow-2xl"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Establish Your Shop</h2>
                  <p className="text-sm text-stone-400">What will you name your whiskey empire?</p>
                </div>
                <input 
                  autoFocus
                  type="text"
                  value={tempShopName}
                  onChange={(e) => setTempShopName(e.target.value)}
                  placeholder="The Golden Cask..."
                  className="w-full bg-whiskey-dark border border-whiskey-light rounded-xl px-4 py-3 text-whiskey-gold font-bold focus:outline-none focus:ring-2 focus:ring-whiskey-gold"
                />
                <div className="flex items-center gap-2 justify-center">
                  <input 
                    type="checkbox" 
                    id="skipTutorials" 
                    checked={isSkipTutorials}
                    onChange={(e) => setIsSkipTutorials(e.target.checked)}
                    className="w-4 h-4 rounded border-whiskey-light text-whiskey-gold focus:ring-whiskey-gold bg-whiskey-dark"
                  />
                  <label htmlFor="skipTutorials" className="text-stone-400 text-xs font-bold uppercase tracking-widest cursor-pointer">
                    Skip Tutorials
                  </label>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsNamingShop(false)}
                    className="flex-1 py-3 bg-whiskey-dark text-stone-500 rounded-xl font-bold uppercase text-xs tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!tempShopName.trim()}
                    onClick={finalizeNewGame}
                    className="flex-1 py-3 bg-whiskey-gold text-whiskey-dark rounded-xl font-black uppercase text-xs tracking-widest disabled:opacity-30"
                  >
                    Establish
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options Overlay */}
        <AnimatePresence>
          {isOptionsOpen && (
            <OptionsMenu 
              settings={settings} 
              onClose={() => setIsOptionsOpen(false)} 
              onUpdate={updateSettings}
              onReturnToMenu={() => {
                setIsOptionsOpen(false);
                setView('main-menu');
              }}
              inGame={view !== 'main-menu'}
              money={gameState.money}
              onUpdateMoney={(m) => setGameState(prev => ({ ...prev, money: m }))}
            />
          )}
        </AnimatePresence>
      </div>
      </>
    );
  }

  if (gameState.isGameOver) {
    return (
      <>
        <AnimatePresence>
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        </AnimatePresence>
        <div className="min-h-screen bg-whiskey-dark flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-whiskey-medium border-2 border-red-900/50 p-12 rounded-[40px] max-w-md w-full text-center space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-900/5 pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto border border-red-900/50">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Business <span className="text-red-500">Closed</span></h1>
            <p className="text-stone-400 text-sm font-medium">
              {gameState.gameOverReason === 'bankruptcy' 
                ? "You failed to pay your rent for two consecutive cycles. The bank has seized your inventory and closed your shop."
                : "Your reputation has remained negative for too long. The whiskey community has blacklisted you, and your license has been revoked."}
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="bg-whiskey-dark/50 p-4 rounded-2xl border border-whiskey-light/30">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Final Stats</p>
              <p className="text-whiskey-gold font-black text-xl">{gameState.shopName}</p>
              <p className="text-stone-400 text-xs">Survived for {gameState.day} Days</p>
              <p className="text-whiskey-money font-black text-lg mt-1">${gameState.money.toLocaleString()}</p>
            </div>

            <button 
              onClick={() => setView('main-menu')}
              className="w-full py-4 bg-white text-whiskey-dark rounded-2xl font-black uppercase tracking-widest hover:bg-stone-200 transition-all active:scale-95"
            >
              Return to Menu
            </button>
          </div>
        </motion.div>
      </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      <div className="min-h-screen bg-whiskey-dark text-stone-200 font-sans pb-12">
      {/* Header */}
      <header className="bg-whiskey-medium text-white py-1 px-2 sm:px-4 h-auto min-h-[40px] shadow-2xl sticky top-0 z-50 border-b border-whiskey-light">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 shrink-0">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-[10px] sm:text-xs font-black tracking-tighter uppercase leading-none text-whiskey-gold truncate max-w-[100px] sm:max-w-none">{gameState.shopName}</h1>
              <p className="text-[7px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Day {gameState.day}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 sm:gap-4 text-right ml-auto">
            <div className="flex flex-col">
              <p className="text-[6px] font-bold text-stone-400 uppercase leading-none mb-0.5">Rep</p>
              <p className={`text-[10px] font-black ${gameState.reputation >= 0 ? 'text-whiskey-gold' : 'text-red-500'}`}>{gameState.reputation}%</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[6px] font-bold text-stone-400 uppercase leading-none mb-0.5">Inv</p>
              <p className="text-[10px] font-black text-whiskey-gold">
                {gameState.inventory.length}<span className="text-stone-500 text-[8px]">/{currentTier.inventoryLimit}</span>
              </p>
            </div>
            <div className="flex flex-col">
              <p className={`text-[6px] font-bold uppercase leading-none mb-0.5 ${gameState.rentOwed > 0 ? (gameState.day % 7 === 0 ? 'text-whiskey-gold' : 'text-red-400') : 'text-stone-400'}`}>
                {gameState.rentOwed > 0 && gameState.day % 7 !== 0 ? 'Overdue' : 'Rent'} <span className="hidden sm:inline">Due (D{Math.ceil(gameState.day / 7) * 7})</span><span className="sm:hidden">D{Math.ceil(gameState.day / 7) * 7}</span>
              </p>
              <p className={`text-[10px] font-black ${gameState.rentOwed > 0 ? (gameState.day % 7 === 0 ? 'text-whiskey-gold' : 'text-red-400') : 'text-stone-300'}`}>
                ${(gameState.rentOwed > 0 ? gameState.rentOwed : currentTier.rent).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-[6px] font-bold text-stone-400 uppercase leading-none mb-0.5">Balance</p>
              <p className="text-[10px] font-black text-whiskey-money">${gameState.money.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setIsOptionsOpen(true)}
              className="p-1.5 bg-whiskey-dark border border-whiskey-light rounded-lg text-whiskey-gold hover:bg-black transition-all shrink-0"
            >
              <SettingsIcon size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-1.5 sm:p-3">
        {view === 'shop' && (
          <div className="space-y-0.5 sm:space-y-1">
            {gameState.auctionState ? (
              <AuctionView 
                state={gameState.auctionState} 
                bottle={gameState.inventory.find(b => b.id === gameState.auctionBottleIds[gameState.auctionState.currentBottleIndex])}
                onAccept={handleAcceptAuctionBid}
                onEndDay={handleNextDay}
                isLastBottle={gameState.auctionState.currentBottleIndex >= gameState.auctionBottleIds.length - 1}
                totalBottles={gameState.auctionBottleIds.length}
                engine={engine}
                gameState={gameState}
              />
            ) : !negotiation ? (
              <section className="space-y-0.5 sm:space-y-1">
                {/* Shop Illustration in its own space */}
                <div className="flex flex-col items-center text-center space-y-0 mb-0 pt-0.5">
                  <div className="h-40 sm:h-60 w-full flex items-center justify-center">
                    <ShopIllustration level={currentTier.level} shopName={gameState.shopName} className="max-w-xl" />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{currentTier.name}</h2>
                  <p className="text-stone-400 text-[9px] max-w-xs italic leading-tight">"{currentTier.description}"</p>
                </div>

                <div className="bg-whiskey-medium rounded-[20px] overflow-visible border border-whiskey-light shadow-2xl">
                  <div className="p-2 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-whiskey-dark/30">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Inventory</p>
                      <p className="text-base font-black text-whiskey-gold">{(gameState.inventory || []).length} <span className="text-stone-600 text-xs">/ {currentTier.inventoryLimit}</span></p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Expected Customers</p>
                      <p className="text-base font-black text-whiskey-gold">{currentTier.minCustomers}-{currentTier.maxCustomers}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Reputation</p>
                      <p className="text-base font-black text-whiskey-gold">{gameState.reputation}%</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Day</p>
                      <p className="text-base font-black text-whiskey-gold">{gameState.day}</p>
                    </div>
                  </div>
                </div>

                <div className={`bg-whiskey-medium p-1.5 rounded-[20px] border border-whiskey-light shadow-sm flex flex-col items-center text-center relative ${activeTutorial === 'shop_overview' && (tutorialPage === 0 || tutorialPage === 1) ? 'z-[200] shadow-[0_0_40px_rgba(255,191,0,0.4),inset_0_0_25px_rgba(255,191,0,0.2)] bg-whiskey-gold/10' : ''}`}>
                  {/* Local Spotlight Overlay */}
                  {activeTutorial === 'shop_overview' && (tutorialPage === 0 || tutorialPage === 1) && (
                    <div className="absolute inset-0 bg-black/60 z-[150] pointer-events-none rounded-[20px]" />
                  )}
                    <div className="mb-1">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight mb-0.5">Daily Operations</h3>
                      <p className="text-[10px] text-stone-400 max-w-md">
                        {!gameState.isShopOpen 
                          ? "The shop is closed. Open up to start receiving customers." 
                          : gameState.customersServedToday >= gameState.dailyCustomerLimit 
                            ? "You've served all customers for today. Time to rest." 
                            : `You have served ${gameState.customersServedToday} of ${gameState.dailyCustomerLimit} customers today.`}
                      </p>
                    </div>

                    {/* Daily Stats Summary */}
                    <div className="grid grid-cols-4 gap-1.5 mt-1 mb-1.5 w-full px-2">
                      <div className="bg-whiskey-dark/30 p-1.5 rounded-lg border border-whiskey-light/10">
                        <p className="text-[6px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Profit</p>
                        <p className={`text-[10px] font-black ${gameState.dailyStats.profit >= 0 ? 'text-whiskey-money' : 'text-red-500'}`}>
                          {gameState.dailyStats.profit >= 0 ? '+' : ''}${gameState.dailyStats.profit.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-whiskey-dark/30 p-1.5 rounded-lg border border-whiskey-light/10">
                        <p className="text-[6px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Best</p>
                        <p className="text-[10px] font-black text-whiskey-gold">
                          +${gameState.dailyStats.bestDealProfit.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-whiskey-dark/30 p-1.5 rounded-lg border border-whiskey-light/10">
                        <p className="text-[6px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Buy</p>
                        <p className="text-[10px] font-black text-white">{gameState.dailyStats.bottlesPurchased}</p>
                      </div>
                      <div className="bg-whiskey-dark/30 p-1.5 rounded-lg border border-whiskey-light/10">
                        <p className="text-[6px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Sell</p>
                        <p className="text-[10px] font-black text-white">{gameState.dailyStats.bottlesSold}</p>
                      </div>
                    </div>
                    
                    <div className="w-full max-w-xs space-y-1.5">
                    {gameState.rentOwed > 0 && (
                      <button 
                        onClick={handlePayRent}
                        disabled={gameState.money < gameState.rentOwed}
                        className={`${gameState.day % 7 === 0 ? 'bg-whiskey-gold/20 hover:bg-whiskey-gold/30 text-whiskey-gold border-whiskey-gold/40' : 'bg-red-900/40 hover:bg-red-900/60 text-red-200 border-red-500/50'} px-6 py-3 rounded-xl font-black shadow-lg border transition-all active:scale-95 flex flex-col items-center justify-center w-full text-sm uppercase tracking-tight disabled:opacity-50`}
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={18} />
                          {gameState.day % 7 === 0 ? "Pay Rent Due" : "Pay Overdue Rent"}: ${gameState.rentOwed.toLocaleString()}
                        </div>
                        {gameState.money < gameState.rentOwed && (
                          <span className={`text-[8px] mt-1 ${gameState.day % 7 === 0 ? 'text-whiskey-gold/60' : 'text-red-400/80'}`}>Insufficient Funds</span>
                        )}
                      </button>
                    )}

                    {!gameState.isShopOpen ? (
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={handleSimulateOffer}
                          className={`bg-whiskey-gold hover:bg-whiskey-amber text-whiskey-dark px-6 py-3 rounded-xl font-black shadow-lg shadow-whiskey-dark/50 transition-all active:scale-95 flex items-center justify-center gap-2 w-full text-sm uppercase tracking-tight ${activeTutorial === 'shop_overview' && tutorialPage === 0 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-xl before:pointer-events-none' : ''}`}
                        >
                          <RefreshCw size={18} />
                          Open Shop
                        </button>
                        
                        <button 
                          onClick={() => setIsSelectingAuctionBottles(true)}
                          disabled={(gameState.inventory || []).length === 0}
                          className={`bg-whiskey-dark hover:bg-black text-whiskey-gold px-6 py-3 rounded-xl font-black shadow-lg border border-whiskey-light transition-all active:scale-95 flex items-center justify-center gap-2 w-full text-sm uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed ${activeTutorial === 'shop_overview' && tutorialPage === 1 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-xl before:pointer-events-none' : ''}`}
                        >
                          <Sparkles size={18} />
                          Host Auction
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handleSimulateOffer}
                          disabled={gameState.customersServedToday >= gameState.dailyCustomerLimit}
                          className="bg-whiskey-gold hover:bg-whiskey-amber disabled:opacity-30 text-whiskey-dark px-4 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                        >
                          <User size={16} />
                          Next
                        </button>
                        <button 
                          onClick={handleNextDay}
                          className="bg-whiskey-dark hover:bg-black text-whiskey-gold px-4 py-3 rounded-xl font-bold shadow-lg border border-whiskey-light transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                        >
                          <Calendar size={16} />
                          End Day
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`fixed top-10 bottom-12 left-0 right-0 bg-whiskey-dark flex flex-col ${isInspecting ? 'z-[60]' : (activeTutorial === 'first_customer' || activeTutorial === 'first_deal' ? 'z-[200]' : 'z-40')}`}
              >
                {/* Local Spotlight Overlay */}
                {activeTutorial && (activeTutorial === 'first_customer' || activeTutorial === 'first_deal') && (
                  <div className="absolute inset-0 bg-black/60 z-[150] pointer-events-none" />
                )}
                {/* Transaction Type Banner */}
                {negotiation.phase === NegotiationPhase.DEAL && (
                  <div className={`flex-none h-4 flex items-center justify-center px-4 border-b border-whiskey-light shadow-sm ${
                    !negotiation.isPlayerBuying ? 'bg-whiskey-buy/20' : 'bg-whiskey-gold/10'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {negotiation.isPlayerBuying ? (
                        <>
                          <ArrowDownLeft size={8} className="text-whiskey-gold" />
                          <span className="text-[7px] font-black text-whiskey-gold uppercase tracking-[0.15em]">Purchasing Bottle</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight size={8} className="text-whiskey-buy-light" />
                          <span className="text-[7px] font-black text-whiskey-buy-light uppercase tracking-[0.15em]">Selling from Inventory</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Top Section: Bottle/Mystery Item - Height adjusted to fit BottleCard (290px) */}
                <div className="flex-none h-[290px] px-4 flex items-center justify-center bg-whiskey-medium border-b border-whiskey-light shadow-sm">
                  <div className="w-full h-full flex items-center justify-center transition-transform">
                    {negotiation.phase === NegotiationPhase.DEAL ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-full max-w-[280px]">
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 20 }}
                            className={`${isInspecting ? "relative z-[70]" : ""} ${(activeTutorial === 'first_customer' && tutorialPage === 0) || (activeTutorial === 'first_deal' && tutorialPage >= 0 && tutorialPage <= 4) ? `z-[200] relative rounded-xl ${activeTutorial === 'first_deal' && tutorialPage === 0 ? 'shadow-[0_0_40px_rgba(255,191,0,0.4),inset_0_0_25px_rgba(255,191,0,0.2)] bg-whiskey-gold/10' : ''}` : ''}`}
                          >
                            <BottleCard 
                              bottle={negotiation.bottle} 
                              brand={engine.getBrand(negotiation.bottle.brandId)} 
                              negotiation={true}
                              showPurchasePrice={!negotiation.isPlayerBuying}
                              revealedFields={negotiation.revealedFields}
                              onInspect={negotiation.isPlayerBuying ? handleInspectBottle : undefined}
                              isInspecting={isInspecting}
                              inspectionResults={inspectionResults}
                              onInspectionStepComplete={handleInspectionStepComplete}
                              onInspectionFinished={handleInspectionFinished}
                              hasInspected={negotiation.hasInspected}
                              highlightedSection={
                                activeTutorial === 'first_deal' 
                                  ? (tutorialPage === 1 ? 'left_cells' 
                                    : tutorialPage === 2 ? 'right_cells' 
                                    : tutorialPage === 3 ? 'name_bottom' 
                                    : tutorialPage === 4 ? 'inspect_button' 
                                    : null) 
                                  : null
                              }
                            />
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <StoreInterior className="w-full h-full" />
                    )}
                  </div>
                </div>

                {/* Dimming Overlay for Inspection */}
                <AnimatePresence>
                  {isInspecting && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Persistent Customer Info Row - Extra Slim */}
                <div className="flex-none h-5 bg-whiskey-dark border-b border-whiskey-light px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-[7px] font-black text-white uppercase tracking-tighter">
                      {negotiation.customer.name}
                    </p>
                    <div className="w-[1px] h-2 bg-whiskey-gold/20 mx-1" />
                    <p className="text-[6px] font-bold text-whiskey-gold/60 uppercase tracking-widest">
                      {negotiation.customer.personality}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-[6px] font-bold text-stone-400 uppercase tracking-widest">
                      Walk-Away Chance:
                    </p>
                    <p className={`text-[7px] font-black uppercase tracking-tighter ${
                      negotiation.walkAwayChance > 70 ? 'text-red-500' : 
                      negotiation.walkAwayChance > 40 ? 'text-yellow-500' : 
                      'text-green-500'
                    }`}>
                      {Math.floor(negotiation.walkAwayChance)}%
                    </p>
                  </div>
                </div>

                {/* Middle Section: Chat History - Stable flexible area */}
                <div className="flex-1 min-h-[60px] overflow-y-auto p-2 space-y-1 custom-scrollbar bg-whiskey-medium/90 border-b border-whiskey-light">
                  {negotiation.messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'player' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[90%] p-1.5 px-2.5 rounded-xl text-[9px] font-medium shadow-sm ${
                        msg.sender === 'player' 
                          ? 'bg-whiskey-gold text-whiskey-dark rounded-tr-none' 
                          : msg.sender === 'system'
                            ? 'bg-transparent text-stone-400 w-full text-center italic'
                            : msg.color === 'green'
                              ? 'bg-green-900/40 text-green-200 border border-green-500/50 rounded-tl-none'
                              : msg.color === 'red'
                                ? 'bg-red-900/40 text-red-200 border border-red-500/50 rounded-tl-none'
                                : 'bg-whiskey-dark text-stone-200 rounded-tl-none border border-whiskey-light'
                      }`}
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Bottom Section: Controls - Fixed Height to prevent resizing */}
                <div className="flex-none h-[125px] bg-whiskey-medium pt-1 px-2 pb-1.5 border-t border-whiskey-light">
                  {negotiation.phase === NegotiationPhase.CONVERSATION ? (
                    <div className="h-full flex flex-col justify-start py-1 gap-1 overflow-y-auto custom-scrollbar">
                      <p className="text-[7px] font-bold text-whiskey-gold uppercase tracking-widest text-center mb-0.5">Dialogue Options</p>
                      <div className="grid grid-cols-2 gap-1 overflow-y-auto custom-scrollbar pr-1">
                        {engine.getDialogueOptions().map((option) => {
                          const isUsed = (negotiation.usedDialogueIds || []).includes(option.id);
                          return (
                            <button
                              key={option.id}
                              onClick={() => handleDialogueOption(option)}
                              disabled={isUsed}
                              className={`px-2 py-1 rounded-lg font-bold text-[9px] transition-all active:scale-[0.98] border border-whiskey-light shadow-sm flex items-center justify-center text-center ${
                                isUsed 
                                  ? 'bg-whiskey-dark/50 border-whiskey-light/20 text-stone-600 cursor-not-allowed'
                                  : option.type === 'business' 
                                    ? `bg-whiskey-gold border-whiskey-gold text-whiskey-dark col-span-2 ${activeTutorial === 'first_customer' && tutorialPage === 1 ? 'z-[200] relative shadow-[0_0_30px_rgba(255,191,0,0.5),inset_0_0_15px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}` 
                                    : `bg-whiskey-dark border-whiskey-light text-whiskey-gold ${activeTutorial === 'first_customer' && tutorialPage === 0 ? 'z-[200] relative shadow-[0_0_30px_rgba(255,191,0,0.5),inset_0_0_15px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}`
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-end gap-1.5">
                      {negotiation.isFinished ? (
                        <div className="flex flex-col gap-1.5 h-full justify-center">
                          <button 
                            onClick={() => {
                              setIsEditingOffer(false);
                              if (gameState.customersServedToday >= gameState.dailyCustomerLimit) {
                                setNegotiation(null);
                              } else {
                                handleSimulateOffer();
                              }
                            }}
                            disabled={gameState.customersServedToday >= gameState.dailyCustomerLimit && !negotiation.isFinished}
                            className="w-full py-2 bg-whiskey-gold hover:bg-whiskey-amber disabled:opacity-50 text-whiskey-dark rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={18} />
                            {gameState.customersServedToday >= gameState.dailyCustomerLimit ? "Finish Day" : "Next Customer"}
                          </button>
                          <button 
                            onClick={() => {
                              setIsEditingOffer(false);
                              setNegotiation(null);
                            }}
                            className="w-full py-1 border border-whiskey-light bg-whiskey-dark text-stone-400 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-[10px]"
                          >
                            <X size={14} />
                            Close Shop
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className={`flex flex-col gap-2 ${activeTutorial === 'first_deal' && tutorialPage === 5 ? 'z-[200] relative shadow-[0_0_40px_rgba(255,191,0,0.4),inset_0_0_25px_rgba(255,191,0,0.2)] rounded-xl bg-whiskey-gold/10' : ''}`}>
                            <div className="flex justify-between items-stretch bg-whiskey-dark p-1.5 rounded-xl border border-whiskey-light shadow-inner gap-2">
                              <div className="flex-1 bg-whiskey-medium/30 p-2 rounded-lg border border-whiskey-light/30 flex flex-col justify-center">
                                <p className="text-[6px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1">
                                  {negotiation.isPlayerBuying ? "THEIR ASKING PRICE" : "THEIR OFFER"}
                                </p>
                                <p className={`text-sm font-black ${negotiation.isPlayerBuying ? 'text-whiskey-gold' : 'text-whiskey-buy-light'} leading-none`}>
                                  {negotiation.customerPrice > 0 ? `$${negotiation.customerPrice.toLocaleString()}` : '---'}
                                </p>
                              </div>

                              <div className="w-10 flex flex-col items-center justify-center bg-whiskey-dark border border-whiskey-light/50 rounded-lg">
                                 <p className="text-[5px] font-black text-stone-500 uppercase tracking-widest">Turn</p>
                                 <p className="text-xs font-black text-whiskey-amber leading-none">{negotiation.turn}</p>
                              </div>

                              <div className="flex-1 bg-whiskey-medium/30 p-2 rounded-lg border border-whiskey-light/30 flex flex-col justify-center text-right">
                                <p className="text-[6px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1">
                                  {negotiation.isPlayerBuying ? "YOUR BID" : "YOUR ASKING PRICE"}
                                </p>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      adjustPrice(-10);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center bg-whiskey-medium border border-whiskey-light rounded-md hover:bg-whiskey-light/20 transition-colors active:scale-90"
                                  >
                                    <Minus size={10} className="text-stone-400" />
                                  </button>
                                  
                                  <p 
                                    onClick={() => {
                                      setOfferInput(negotiation.currentOffer.toString());
                                      setIsEditingOffer(true);
                                    }}
                                    className="text-sm font-black text-whiskey-money leading-none cursor-pointer hover:text-whiskey-gold transition-colors min-w-[50px] text-center"
                                  >
                                    ${negotiation.currentOffer.toLocaleString()}
                                  </p>

                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      adjustPrice(10);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center bg-whiskey-medium border border-whiskey-light rounded-md hover:bg-whiskey-light/20 transition-colors active:scale-90"
                                  >
                                    <Plus size={10} className="text-stone-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                              <button 
                                onClick={() => handleCounterOffer(negotiation.currentOffer)}
                                className={`flex-[2] py-1 ${negotiation.isPlayerBuying ? 'bg-whiskey-gold hover:bg-whiskey-amber' : 'bg-whiskey-buy hover:bg-whiskey-buy-light'} text-whiskey-dark rounded-lg font-bold text-[10px] shadow-lg transition-all active:scale-95 ${activeTutorial === 'first_deal' && tutorialPage === 8 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}`}
                              >
                                Send Counter Offer
                              </button>
                              <button 
                                onClick={() => setIsTacticsModalOpen(true)}
                                className={`flex-1 py-1 bg-whiskey-dark border border-whiskey-gold/50 text-whiskey-gold rounded-lg font-bold shadow-lg flex items-center justify-center gap-1 text-[9px] transition-all active:scale-95 ${activeTutorial === 'first_deal' && tutorialPage === 7 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}`}
                              >
                                <Sparkles size={10} />
                                Tactics
                              </button>
                            </div>
                            
                            <div className="flex gap-1">
                              <button 
                                onClick={handleAcceptDeal}
                                disabled={negotiation.customerPrice === 0}
                                className={`flex-1 py-1 bg-whiskey-money disabled:bg-stone-800 disabled:text-stone-600 text-whiskey-dark rounded-lg font-bold shadow-lg flex items-center justify-center gap-1 text-[9px] transition-all active:scale-95 disabled:scale-100 disabled:cursor-not-allowed ${activeTutorial === 'first_deal' && tutorialPage === 8 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}`}
                              >
                                <Check size={10} />
                                Accept
                              </button>
                              <button 
                                onClick={() => setIsHistoryOpen(true)}
                                className={`flex-1 py-1 bg-whiskey-dark border border-whiskey-light text-whiskey-gold rounded-lg font-bold shadow-lg flex items-center justify-center gap-1 text-[9px] transition-all active:scale-95 ${activeTutorial === 'first_deal' && tutorialPage === 6 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}`}
                              >
                                <BookOpen size={10} />
                                History
                              </button>
                              <button 
                                onClick={handleDeclineDeal}
                                className={`flex-1 py-1 border border-whiskey-light bg-whiskey-dark text-stone-400 rounded-lg font-bold flex items-center justify-center gap-1 text-[9px] transition-all active:scale-95 ${activeTutorial === 'first_deal' && tutorialPage === 8 ? 'z-[200] relative shadow-[0_0_35px_rgba(255,191,0,0.6),inset_0_0_20px_rgba(255,191,0,0.3)] before:absolute before:inset-0 before:bg-whiskey-gold/20 before:rounded-lg before:pointer-events-none' : ''}`}
                              >
                                <X size={10} />
                                Walk Away
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {view === 'shop' && isSelectingAuctionBottles && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-whiskey-gold uppercase tracking-tighter">Auction Selection</h2>
                <p className="text-stone-400">Select any number of bottles from your inventory to feature in today's exclusive auction.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(gameState.inventory || []).map(bottle => {
                  const isSelected = (gameState.auctionBottleIds || []).includes(bottle.id);
                  return (
                    <div 
                      key={bottle.id} 
                      onClick={() => {
                        if (isSelected) {
                          setGameState(prev => ({ ...prev, auctionBottleIds: (prev.auctionBottleIds || []).filter(id => id !== bottle.id) }));
                        } else {
                          setGameState(prev => ({ ...prev, auctionBottleIds: [...(prev.auctionBottleIds || []), bottle.id] }));
                        }
                      }}
                      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-4 ring-whiskey-gold scale-95' : 'hover:scale-105'}`}
                    >
                      <BottleCard 
                        bottle={bottle} 
                        brand={engine.getBrand(bottle.brandId)} 
                        negotiation={true} 
                        showPurchasePrice={true} 
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-whiskey-gold text-whiskey-dark p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="sticky bottom-0 bg-black/50 p-6 backdrop-blur-md rounded-t-[32px] flex gap-4">
                <button 
                  onClick={() => {
                    setIsSelectingAuctionBottles(false);
                    setGameState(prev => ({ ...prev, auctionBottleIds: [] }));
                  }}
                  className="flex-1 py-4 bg-whiskey-dark text-stone-400 rounded-2xl font-bold uppercase tracking-widest border border-whiskey-light"
                >
                  Cancel
                </button>
                <button 
                  disabled={(gameState.auctionBottleIds || []).length === 0}
                  onClick={() => startAuction(gameState.auctionBottleIds || [])}
                  className="flex-[2] py-4 bg-whiskey-gold hover:bg-whiskey-amber disabled:opacity-30 text-whiskey-dark rounded-2xl font-black uppercase tracking-widest shadow-xl"
                >
                  Start Auction ({(gameState.auctionBottleIds || []).length})
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {isOptionsOpen && (
            <OptionsMenu 
              settings={settings} 
              onClose={() => setIsOptionsOpen(false)} 
              onUpdate={updateSettings}
              onReturnToMenu={() => {
                setIsOptionsOpen(false);
                setView('main-menu');
              }}
              inGame={view !== 'main-menu'}
              money={gameState.money}
              onUpdateMoney={(m) => setGameState(prev => ({ ...prev, money: m }))}
            />
          )}
        </AnimatePresence>

        {view === 'expansion' && (
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <div className="bg-whiskey-medium p-3 rounded-[24px] border border-whiskey-light shadow-2xl text-center">
              <h2 className="text-xl font-black text-whiskey-gold uppercase tracking-tighter">Shop Expansion</h2>
              <p className="text-stone-400 text-[10px] mt-0.5">Grow your business and attract wealthier clientele.</p>
            </div>

            {nextTier ? (
              <div className="bg-whiskey-medium rounded-[24px] overflow-hidden border border-whiskey-light shadow-lg flex flex-col">
                {/* Large Preview Image */}
                <div className="bg-whiskey-dark/30 p-3 flex flex-col items-center justify-center border-b border-whiskey-light/30">
                  <div className="h-40 sm:h-56 w-full flex items-center justify-center">
                    <ShopIllustration level={nextTier.level} shopName={gameState.shopName} className="max-w-xs" />
                  </div>
                  <div className="mt-1 text-center">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{nextTier.name}</h3>
                    <p className="text-whiskey-gold font-black text-xs mt-0.5">${nextTier.upgradeCost.toLocaleString()}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-3 space-y-3">
                  <p className="text-stone-300 text-[10px] italic text-center leading-tight">"{nextTier.description}"</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-whiskey-dark/50 p-2 rounded-xl border border-whiskey-light/50">
                      <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Inventory Limit</p>
                      <p className="text-sm font-black text-white">{currentTier.inventoryLimit} <span className="text-whiskey-gold">→ {nextTier.inventoryLimit}</span></p>
                    </div>
                    <div className="bg-whiskey-dark/50 p-2 rounded-xl border border-whiskey-light/50">
                      <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Expected Customers</p>
                      <p className="text-sm font-black text-white">{currentTier.maxCustomers} <span className="text-whiskey-gold">→ {nextTier.maxCustomers}</span></p>
                    </div>
                    <div className="bg-whiskey-dark/50 p-2 rounded-xl border border-whiskey-light/50 col-span-2">
                      <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Reputation Required</p>
                      <p className={`text-sm font-black ${gameState.reputation >= currentTier.minReputationToUpgrade ? 'text-green-400' : 'text-red-400'}`}>
                        {gameState.reputation}% / {currentTier.minReputationToUpgrade}%
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleUpgradeShop}
                    disabled={gameState.money < nextTier.upgradeCost || gameState.reputation < currentTier.minReputationToUpgrade}
                    className="w-full py-2.5 bg-whiskey-gold hover:bg-whiskey-amber disabled:opacity-30 text-whiskey-dark rounded-xl font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-tight text-xs"
                  >
                    <ArrowUpCircle size={16} />
                    Confirm Upgrade
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-whiskey-medium p-8 rounded-[24px] border border-whiskey-light shadow-lg text-center">
                <Sparkles className="text-whiskey-gold mx-auto mb-2" size={32} />
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Maximum Tier Reached</h3>
                <p className="text-stone-400 text-xs mt-1">You are operating at the pinnacle of the spirits world.</p>
              </div>
            )}
          </div>
        )}

        {view === 'tools' && (
          <div className="max-w-md mx-auto space-y-3">
            {/* Appraiser's Toolkit Section */}
            <div className="bg-whiskey-medium p-3 rounded-[20px] border border-whiskey-light shadow-2xl text-center">
              <h2 className="text-lg font-black text-whiskey-gold uppercase tracking-tighter">Appraiser's Toolkit</h2>
              <p className="text-stone-400 text-[9px] mt-0.5">Professional equipment to reveal hidden bottle details.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TOOLKIT_ITEMS.map(item => {
                const isOwned = (gameState.toolkit || []).includes(item.id);
                const canAfford = gameState.money >= item.cost;
                
                return (
                  <div key={item.id} className={`bg-whiskey-medium p-2 rounded-xl border ${isOwned ? 'border-whiskey-gold/50' : 'border-whiskey-light'} shadow-lg flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-[10px] font-black uppercase tracking-tight leading-tight ${isOwned ? 'text-whiskey-gold' : 'text-white'}`}>{item.name}</h3>
                        {isOwned && <Check size={12} className="text-whiskey-gold shrink-0 ml-1" />}
                      </div>
                      <p className="text-stone-400 text-[8px] leading-tight mb-2">{item.description}</p>
                    </div>
                    
                    <button
                      onClick={() => handleBuyToolkitItem(item.id)}
                      disabled={isOwned || !canAfford}
                      className={`w-full py-1.5 rounded-lg font-black text-[9px] uppercase transition-all flex items-center justify-center gap-1.5 ${
                        isOwned 
                          ? 'bg-whiskey-dark text-stone-500 cursor-default' 
                          : canAfford 
                            ? 'bg-whiskey-gold hover:bg-whiskey-amber text-whiskey-dark active:scale-95 shadow-md' 
                            : 'bg-whiskey-dark text-stone-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {isOwned ? 'Owned' : (
                        <>
                          <Wallet size={10} />
                          ${item.cost.toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'inventory' && (
          <div className="flex flex-col gap-6 items-center">
            {(gameState.inventory || []).length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="text-stone-400" size={28} />
                </div>
                <p className="text-stone-400 font-medium">Empty inventory.</p>
              </div>
            ) : (
              (gameState.inventory || []).map((bottle) => (
                <div key={bottle.id} className="relative w-full max-w-[280px]">
                  <BottleCard 
                    bottle={bottle} 
                    brand={engine.getBrand(bottle.brandId)} 
                    negotiation={true}
                    showPurchasePrice={true}
                  />
                  {!bottle.rarityDiscovered && (
                    <button 
                      onClick={() => handleResearchBottle(bottle)}
                      className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg hover:bg-amber-600 transition-colors z-10 flex items-center gap-1"
                      title={`Research Bottle ($${Math.max(25, 150 - (((gameState.skills || {})[bottle.type] || { level: 0 }).level * 25))})`}
                    >
                      <Sparkles size={16} />
                      <span className="text-[10px] font-bold">${Math.max(25, 150 - (((gameState.skills || {})[bottle.type] || { level: 0 }).level * 25))}</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {view === 'skills' && (
          <div className="max-w-md mx-auto space-y-3">
            <div className="bg-whiskey-medium p-3 rounded-[20px] border border-whiskey-light shadow-2xl text-center">
              <h2 className="text-lg font-black text-whiskey-gold uppercase tracking-tighter">Expertise</h2>
              <p className="text-stone-400 text-[9px] mt-0.5">Your knowledge and negotiation skills improve as you complete deals.</p>
            </div>

            <div className="space-y-2">
              {Object.entries(gameState.skills).map(([type, skillInfo]) => {
                const info = skillInfo as SkillInfo;
                const isMaxLevel = info.level >= 20;
                const nextLevelXP = isMaxLevel ? 1 : WhiskeyEngine.getNextLevelXP(info.level);
                const progress = isMaxLevel ? 100 : (info.xp / nextLevelXP) * 100;
                
                return (
                  <div key={type} className="bg-whiskey-medium p-3 rounded-xl border border-whiskey-light shadow-lg">
                    <div className="flex justify-between items-center mb-1.5">
                      <h3 className="text-xs font-black text-white uppercase tracking-tight">{type}</h3>
                      <span className="text-[10px] font-black text-whiskey-gold">
                        {isMaxLevel ? 'MAX LEVEL' : `Level ${info.level}`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-whiskey-dark rounded-full overflow-hidden border border-whiskey-light/30">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-whiskey-gold"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-[8px] text-stone-500 uppercase tracking-widest font-bold">
                        {info.level < 5 ? "Novice" : info.level < 10 ? "Apprentice" : info.level < 15 ? "Journeyman" : info.level < 20 ? "Master" : "Grandmaster"}
                      </p>
                      <p className="text-[8px] text-whiskey-gold font-black">
                        {isMaxLevel ? 'MAX' : `${Math.floor(info.xp)} / ${nextLevelXP} XP`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'codex' && (
          <div className="flex flex-col gap-4">
            {(() => {
              const discoveredDistilleriesList = engine.getAllDistilleries().filter(d => gameState.codex?.discoveredDistilleries[d.id]);
              const distilleriesByRegion = discoveredDistilleriesList.reduce<Record<string, ParentDistillery[]>>((acc, d) => {
                if (!acc[d.region]) acc[d.region] = [];
                acc[d.region].push(d);
                return acc;
              }, {});

              if (discoveredDistilleriesList.length === 0) {
                return (
                  <div className="text-center p-8 text-stone-500">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No distilleries discovered yet.</p>
                    <p className="text-sm">Encounter bottles to start logging distilleries and brands.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-8">
                  {Object.entries(distilleriesByRegion).map(([region, distilleries]: [string, ParentDistillery[]]) => (
                    <div key={region} className="space-y-4">
                      <h2 className="text-xl font-black text-whiskey-gold uppercase tracking-widest border-b border-whiskey-gold/30 pb-2">{region}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {distilleries.map(distillery => {
                          const codexEntry = gameState.codex?.discoveredDistilleries[distillery.id]!;
                          const allBrands = engine.getAllBrands().filter(b => b.parentDistilleryId === distillery.id);
                          const discoveredBrands = allBrands.filter(b => !!gameState.codex?.discoveredBrands?.[b.id]);

                          return (
                            <button 
                              key={distillery.id} 
                              onClick={() => setSelectedCodexDistillery(distillery)}
                              className="bg-whiskey-medium p-3 rounded-xl border border-whiskey-light shadow-md text-left hover:border-whiskey-gold transition-colors group flex flex-col h-full"
                            >
                              <div className="flex justify-between items-start mb-2 w-full">
                                <div className="pr-2">
                                  <h3 className="text-base font-black text-white uppercase tracking-tighter group-hover:text-whiskey-gold transition-colors leading-tight">{distillery.name}</h3>
                                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                                    {codexEntry.foundedYearKnown ? distillery.foundedYear : (codexEntry.minKnownYear || '????')} - {codexEntry.statusKnown ? (distillery.closedYear || 'Present') : (codexEntry.maxKnownYear || '????')}
                                  </p>
                                </div>
                                {codexEntry.categoryKnown ? (
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase bg-whiskey-dark text-whiskey-gold border border-whiskey-gold/30 shrink-0">
                                    {distillery.category}
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase bg-whiskey-dark text-stone-500 border border-dashed border-whiskey-light/30 shrink-0">
                                    ???
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-whiskey-light/20 w-full">
                                {discoveredBrands.map(brand => (
                                  <span key={brand.id} className="text-[8px] bg-whiskey-dark border border-whiskey-light px-1.5 py-0.5 rounded text-stone-300 font-bold uppercase tracking-tight">
                                    {brand.name}
                                  </span>
                                ))}
                                {/* Hidden unknown brands count to prevent player from knowing total portfolio size */}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-whiskey-medium border-t border-whiskey-light px-2 sm:px-4 py-1 h-10 flex justify-between items-center ${activeTutorial === 'shop_overview' && tutorialPage >= 2 ? 'z-[200]' : 'z-50'} shadow-[0_-4px_20px_rgba(0,0,0,0.2)] overflow-visible`}>
        {/* Local Spotlight Overlay */}
        {activeTutorial === 'shop_overview' && tutorialPage >= 2 && (
          <div className="absolute inset-0 bg-black/60 z-[150] pointer-events-none" />
        )}
        <NavButton 
          active={view === 'shop'} 
          onClick={() => setView('shop')} 
          icon={<RefreshCw size={16} />} 
          label="Shop" 
        />
        <NavButton 
          active={view === 'expansion'} 
          onClick={() => setView('expansion')} 
          icon={<ArrowUpCircle size={16} />} 
          label="Upgrade" 
          highlight={activeTutorial === 'shop_overview' && tutorialPage === 2}
        />
        <NavButton 
          active={view === 'tools'} 
          onClick={() => setView('tools')} 
          icon={<Wrench size={16} />} 
          label="Tools" 
          highlight={activeTutorial === 'shop_overview' && tutorialPage === 3}
        />
        <NavButton 
          active={view === 'skills'} 
          onClick={() => setView('skills')} 
          icon={<TrendingUp size={16} />} 
          label="Skills" 
          highlight={activeTutorial === 'shop_overview' && tutorialPage === 4}
        />
        <NavButton 
          active={view === 'inventory'} 
          onClick={() => setView('inventory')} 
          icon={<ShoppingBag size={16} />} 
          label="Inventory" 
          badge={(gameState.inventory || []).length > 0 ? (gameState.inventory || []).length : undefined}
          highlight={activeTutorial === 'shop_overview' && tutorialPage === 5}
        />
        <NavButton 
          active={view === 'codex'} 
          onClick={() => setView('codex')} 
          icon={<BookOpen size={16} />} 
          label="Codex" 
          highlight={activeTutorial === 'shop_overview' && tutorialPage === 6}
        />
      </nav>

      {/* Codex Modals */}
      <AnimatePresence>
        {selectedCodexDistillery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => { setSelectedCodexDistillery(null); setSelectedCodexBrand(null); }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-whiskey-dark border border-whiskey-light rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-whiskey-light flex justify-between items-center bg-whiskey-medium">
                {selectedCodexBrand ? (
                  <button onClick={() => setSelectedCodexBrand(null)} className="flex items-center text-whiskey-gold hover:text-white transition-colors">
                    <ChevronLeft size={20} className="mr-1" /> Back to {selectedCodexDistillery.name}
                  </button>
                ) : (
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedCodexDistillery.name}</h2>
                )}
                <button onClick={() => { setSelectedCodexDistillery(null); setSelectedCodexBrand(null); }} className="text-stone-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {selectedCodexBrand ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-whiskey-gold uppercase tracking-tighter mb-2">{selectedCodexBrand.name}</h3>
                      <p className="text-sm text-stone-400 font-bold uppercase tracking-widest">
                        Est. {gameState.codex?.discoveredBrands?.[selectedCodexBrand.id]?.minKnownYear || '????'} {gameState.codex?.discoveredBrands?.[selectedCodexBrand.id]?.maxKnownYear ? `- ${gameState.codex.discoveredBrands[selectedCodexBrand.id].maxKnownYear}` : ''}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white uppercase tracking-widest border-b border-whiskey-light/50 pb-2">Product Lines</h4>
                      <div className="space-y-4">
                        {engine.getWorld().productLines.filter(pl => pl.brandId === selectedCodexBrand.id).map(pl => {
                          const knowledge = gameState.codex?.discoveredProductLines?.[pl.id];
                          
                          // Handle array case for UI just in case it wasn't migrated yet
                          const isDiscovered = Array.isArray(gameState.codex?.discoveredProductLines) 
                            ? gameState.codex.discoveredProductLines.includes(pl.id as any)
                            : !!knowledge;
                            
                          const plKnowledge = Array.isArray(gameState.codex?.discoveredProductLines)
                            ? { baseAgeKnown: true, baseProofKnown: true, modifiersKnown: pl.modifiers } // Fallback for old saves
                            : knowledge;

                          if (!isDiscovered || !plKnowledge) {
                            return null;
                          }
                          return (
                            <div key={pl.id} className="bg-whiskey-medium p-4 rounded-2xl border border-whiskey-light shadow-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-[8px] text-whiskey-gold font-black uppercase tracking-widest mb-0.5">{selectedCodexBrand.name}</p>
                                  <h3 className="text-base font-black text-white uppercase tracking-tighter">{pl.name}</h3>
                                </div>
                              </div>
                              
                              <p className="text-[10px] text-stone-400 leading-tight mb-3 italic">"{pl.description}"</p>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-whiskey-dark p-2 rounded-lg border border-whiskey-light/30">
                                  <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Type</p>
                                  <p className="text-[9px] font-black text-white uppercase">{pl.type}</p>
                                </div>
                                {plKnowledge.baseProofKnown && (
                                  <div className="bg-whiskey-dark p-2 rounded-lg border border-whiskey-light/30">
                                    <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Base Proof</p>
                                    <p className="text-[9px] font-black text-white">{pl.baseProof}</p>
                                  </div>
                                )}
                                {plKnowledge.baseAgeKnown && (
                                  <div className="bg-whiskey-dark p-2 rounded-lg border border-whiskey-light/30">
                                    <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">Base Age</p>
                                    <p className="text-[9px] font-black text-white">{pl.baseAge}yr</p>
                                  </div>
                                )}
                              </div>

                              {plKnowledge.modifiersKnown.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {plKnowledge.modifiersKnown.map(mod => (
                                    <span key={mod} className="text-[7px] font-black bg-whiskey-dark text-stone-400 px-1.5 py-0.5 rounded border border-whiskey-light/20 uppercase">
                                      {mod}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <div className="mt-3 pt-2 border-t border-whiskey-light/10 flex justify-between items-center">
                                <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest">Production Period</p>
                                <p className="text-[9px] font-black text-stone-300">{plKnowledge.minKnownYear || '????'} - {plKnowledge.maxKnownYear || '????'}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="bg-whiskey-medium px-4 py-2 rounded-lg border border-whiskey-light/30">
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">Region</p>
                        <p className="text-sm font-black text-white uppercase">{selectedCodexDistillery.region}</p>
                      </div>
                      <div className="bg-whiskey-medium px-4 py-2 rounded-lg border border-whiskey-light/30">
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">Category</p>
                        <p className="text-sm font-black text-white uppercase">{selectedCodexDistillery.category}</p>
                      </div>
                      <div className="bg-whiskey-medium px-4 py-2 rounded-lg border border-whiskey-light/30">
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">Timeline</p>
                        <p className="text-sm font-black text-white uppercase">
                          {gameState.codex?.discoveredDistilleries[selectedCodexDistillery.id]?.foundedYearKnown ? selectedCodexDistillery.foundedYear : (gameState.codex?.discoveredDistilleries[selectedCodexDistillery.id]?.minKnownYear || '????')} - {gameState.codex?.discoveredDistilleries[selectedCodexDistillery.id]?.statusKnown ? (selectedCodexDistillery.closedYear || 'Present') : (gameState.codex?.discoveredDistilleries[selectedCodexDistillery.id]?.maxKnownYear || '????')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white uppercase tracking-widest border-b border-whiskey-light/50 pb-2">Brands</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {engine.getAllBrands().filter(b => b.parentDistilleryId === selectedCodexDistillery.id).map(brand => {
                          const knowledge = gameState.codex?.discoveredBrands?.[brand.id];
                          const isDiscovered = !!knowledge;
                          if (!isDiscovered) {
                            return null;
                          }
                          return (
                            <button 
                              key={brand.id}
                              onClick={() => setSelectedCodexBrand(brand)}
                              className="bg-whiskey-medium p-4 rounded-xl border border-whiskey-light hover:border-whiskey-gold transition-colors text-left group flex justify-between items-center"
                            >
                              <div>
                                <h5 className="text-base font-black text-white uppercase tracking-tighter group-hover:text-whiskey-gold transition-colors">{brand.name}</h5>
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Est. {knowledge.minKnownYear || '????'} {knowledge.maxKnownYear ? `- ${knowledge.maxKnownYear}` : ''}</p>
                              </div>
                              <ChevronRight size={20} className="text-stone-500 group-hover:text-whiskey-gold transition-colors" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction History Modal */}
      <AnimatePresence>
        {isHistoryOpen && negotiation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsHistoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-whiskey-dark border border-whiskey-light rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-whiskey-light flex justify-between items-center bg-whiskey-medium">
                <div>
                  <h3 className="text-whiskey-gold font-black text-sm uppercase tracking-tighter">Transaction History</h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                    {(() => {
                      const brand = engine.getBrand(negotiation.bottle.brandId);
                      return brand ? `${brand.name} ${negotiation.bottle.type}` : negotiation.bottle.name;
                    })()}
                  </p>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="text-stone-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
                {(() => {
                  const brandHistory = (gameState.transactionHistory || []).filter(t => 
                    t.brandId === negotiation.bottle.brandId && 
                    t.type === negotiation.bottle.type
                  );
                  
                  if (brandHistory.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <BookOpen size={32} className="mx-auto text-stone-600 mb-2 opacity-20" />
                        <p className="text-stone-500 text-xs font-medium italic">No past transactions found for this specific bottle type.</p>
                      </div>
                    );
                  }

                  // Aggregate by year + modifiers
                  const groups: Record<string, { 
                    year: number | 'Unknown', 
                    modifiers: string[],
                    buys: number[], 
                    sells: { price: number, wasAuction: boolean }[] 
                  }> = {};

                  brandHistory.forEach(record => {
                    const modKey = (record.modifiers || []).sort().join('|');
                    const key = `${record.wasYearKnown ? record.year.toString() : 'Unknown'}-${modKey}`;
                    if (!groups[key]) {
                      groups[key] = { 
                        year: record.wasYearKnown ? record.year : 'Unknown', 
                        modifiers: record.modifiers || [],
                        buys: [], 
                        sells: [] 
                      };
                    }
                    if (record.buyPrice) groups[key].buys.push(record.buyPrice);
                    if (record.sellPrice) groups[key].sells.push({ price: record.sellPrice, wasAuction: !!record.wasAuction });
                  });

                  // Sort groups: Unknown first, then by year descending, then by modifiers length
                  const sortedKeys = Object.keys(groups).sort((a, b) => {
                    const groupA = groups[a];
                    const groupB = groups[b];
                    
                    if (groupA.year === 'Unknown' && groupB.year !== 'Unknown') return -1;
                    if (groupA.year !== 'Unknown' && groupB.year === 'Unknown') return 1;
                    
                    if (groupA.year !== 'Unknown' && groupB.year !== 'Unknown') {
                      if (groupB.year !== groupA.year) return (groupB.year as number) - (groupA.year as number);
                    }
                    
                    return groupB.modifiers.length - groupA.modifiers.length;
                  });

                  return sortedKeys.map(key => {
                    const group = groups[key];
                    const minBuy = group.buys.length > 0 ? Math.min(...group.buys) : null;
                    const maxBuy = group.buys.length > 0 ? Math.max(...group.buys) : null;
                    
                    const sellPrices = group.sells.map(s => s.price);
                    const minSell = sellPrices.length > 0 ? Math.min(...sellPrices) : null;
                    const maxSell = sellPrices.length > 0 ? Math.max(...sellPrices) : null;
                    const hasAuction = group.sells.some(s => s.wasAuction);

                    return (
                      <div key={key} className="bg-whiskey-medium/50 border border-whiskey-light/30 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-black text-whiskey-gold uppercase tracking-tighter">
                              {group.year === 'Unknown' ? 'Unknown Year' : group.year}
                            </p>
                            {group.modifiers.length > 0 && (
                              <p className="text-[8px] font-bold text-whiskey-amber uppercase tracking-widest mt-0.5">
                                {group.modifiers.join(' • ')}
                              </p>
                            )}
                          </div>
                          {hasAuction && (
                            <span className="text-[7px] font-black bg-whiskey-gold/20 text-whiskey-gold px-1.5 py-0.5 rounded uppercase tracking-widest border border-whiskey-gold/30">
                              Auction
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mb-1">Buy Range ({group.buys.length})</p>
                            <p className="text-xs font-black text-red-400">
                              {minBuy !== null ? (
                                minBuy === maxBuy ? `$${minBuy.toLocaleString()}` : `$${minBuy.toLocaleString()} - $${maxBuy!.toLocaleString()}`
                              ) : '—'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mb-1">Sell Range ({group.sells.length})</p>
                            <p className="text-xs font-black text-whiskey-money">
                              {minSell !== null ? (
                                minSell === maxSell ? `$${minSell.toLocaleString()}` : `$${minSell.toLocaleString()} - $${maxSell!.toLocaleString()}`
                              ) : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              
              <div className="p-4 bg-whiskey-medium border-t border-whiskey-light">
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="w-full py-2 bg-whiskey-gold text-whiskey-dark rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Back to Negotiation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tactics Modal */}
      <AnimatePresence>
        {isTacticsModalOpen && negotiation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsTacticsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-whiskey-dark border border-whiskey-light rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-whiskey-light flex justify-between items-start bg-whiskey-medium">
                <div className="flex-1 pr-4">
                  <h3 className="text-whiskey-gold font-black text-sm uppercase tracking-tighter mb-1">Negotiation Tactics</h3>
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      {((gameState.skills || {}).negotiation || { level: 0 }).level >= 20 ? 'Mastery Level: MAX' : `Mastery Level: ${((gameState.skills || {}).negotiation || { level: 0 }).level}`}
                    </p>
                    <p className="text-[9px] text-whiskey-gold font-black">
                      {((gameState.skills || {}).negotiation || { level: 0 }).level >= 20 ? 'MAX' : `${Math.floor(((gameState.skills || {}).negotiation || { xp: 0 }).xp)} / ${WhiskeyEngine.getNextLevelXP(((gameState.skills || {}).negotiation || { level: 0 }).level)} XP`}
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-whiskey-dark rounded-full overflow-hidden border border-whiskey-light/20">
                    <div 
                      className="h-full bg-whiskey-gold" 
                      style={{ width: ((gameState.skills || {}).negotiation || { level: 0 }).level >= 20 ? '100%' : `${(((gameState.skills || {}).negotiation || { xp: 0 }).xp / WhiskeyEngine.getNextLevelXP(((gameState.skills || {}).negotiation || { level: 0 }).level)) * 100}%` }}
                    />
                  </div>
                </div>
                <button onClick={() => setIsTacticsModalOpen(false)} className="text-stone-400 hover:text-white mt-0.5">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
                <AnimatePresence mode="wait">
                  {!openTacticCategory ? (
                    <motion.div
                      key="categories"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <button
                        onClick={() => setOpenTacticCategory('soft')}
                        className="w-full flex items-center justify-between p-4 bg-whiskey-dark rounded-xl border border-whiskey-light hover:border-whiskey-gold transition-colors group"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-whiskey-gold font-black uppercase tracking-widest text-lg">Soft Skills</span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest">Relational Tactics</span>
                        </div>
                        <ChevronRight size={24} className="text-whiskey-gold group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <button
                        onClick={() => setOpenTacticCategory('hard')}
                        className="w-full flex items-center justify-between p-4 bg-whiskey-dark rounded-xl border border-whiskey-light hover:border-whiskey-gold transition-colors group"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-whiskey-gold font-black uppercase tracking-widest text-lg">Hard Skills</span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest">Transactional Tactics</span>
                        </div>
                        <ChevronRight size={24} className="text-whiskey-gold group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tactics-list"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      <button 
                        onClick={() => setOpenTacticCategory(null)}
                        className="flex items-center gap-2 text-stone-400 hover:text-whiskey-gold transition-colors mb-2"
                      >
                        <ChevronLeft size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Categories</span>
                      </button>
                      
                      <div className="space-y-1.5">
                        {NEGOTIATION_TACTICS.filter(t => t.category === openTacticCategory).map(tactic => {
                          const skillLevel = ((gameState.skills || {}).negotiation || { level: 0 }).level;
                          const isLocked = skillLevel < tactic.minSkill;
                          const isUsed = (negotiation.usedTacticIds || []).includes(tactic.id);
                          
                          return (
                            <button
                              key={tactic.id}
                              disabled={isLocked || isUsed}
                              onClick={() => handleApplyTactic(tactic.id)}
                              className={`w-full px-3 py-2 rounded-lg border transition-all text-left flex flex-col ${
                                isLocked 
                                  ? 'bg-stone-900/50 border-stone-800 opacity-50 cursor-not-allowed'
                                  : isUsed
                                    ? 'bg-whiskey-dark/30 border-whiskey-light/10 opacity-40 cursor-not-allowed'
                                    : 'bg-whiskey-dark border-whiskey-light hover:border-whiskey-gold hover:bg-whiskey-dark/80 active:scale-[0.98]'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className={`text-xs font-black uppercase tracking-tight ${isLocked ? 'text-stone-500' : 'text-whiskey-gold'}`}>
                                  {tactic.name}
                                </span>
                                {isLocked && (
                                  <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">
                                    Req: {tactic.minSkill}
                                  </span>
                                )}
                                {isUsed && (
                                  <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">
                                    Used
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-stone-400 leading-tight mt-0.5">
                                {tactic.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="p-4 bg-whiskey-medium/50 border-t border-whiskey-light text-center">
                <p className="text-[9px] text-stone-500 italic">
                  Tactics can only be used once per negotiation. Use them wisely.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Input Modal */}
      <AnimatePresence>
        {isEditingOffer && negotiation && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-whiskey-dark border border-whiskey-gold p-6 rounded-3xl w-full max-w-xs shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-whiskey-gold font-black text-center mb-1 uppercase tracking-tighter">Adjust Your Offer</h3>
              
              {/* Customer Offer Display in Modal */}
              <div className="mb-4 bg-whiskey-medium/50 p-2 rounded-xl border border-whiskey-light/30 text-center">
                <p className="text-[7px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">
                  {negotiation.isPlayerBuying ? "Their Asking Price" : "Customer's Offer"}
                </p>
                <p className={`text-lg font-black ${negotiation.isPlayerBuying ? 'text-whiskey-gold' : 'text-whiskey-buy-light'}`}>
                  {negotiation.customerPrice > 0 ? `$${negotiation.customerPrice.toLocaleString()}` : '---'}
                </p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => adjustPrice(-50)}
                  className="w-12 h-12 bg-whiskey-medium border border-whiskey-light rounded-xl flex items-center justify-center text-stone-400 active:scale-95"
                >
                  -50
                </button>
                <div className="flex-1 text-center">
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-whiskey-money font-black text-xl">$</span>
                    <input
                      autoFocus
                      type="number"
                      value={offerInput}
                      onChange={(e) => setOfferInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(offerInput);
                          if (!isNaN(val) && negotiation) {
                            const clampedVal = negotiation.isPlayerBuying 
                              ? Math.max(negotiation.minPrice, Math.min(negotiation.maxPrice, val))
                              : Math.max(1, val);
                            setNegotiation({ ...negotiation, currentOffer: clampedVal });
                          }
                          setIsEditingOffer(false);
                        }
                      }}
                      className="w-full bg-transparent border-b-2 border-whiskey-gold text-2xl font-black text-whiskey-money text-center focus:outline-none pb-1 pl-4"
                    />
                  </div>
                  {negotiation.isPlayerBuying && (
                    <p className="text-[10px] text-stone-500 font-bold mt-2 uppercase">Min: ${negotiation.minPrice} | Max: ${negotiation.maxPrice}</p>
                  )}
                </div>
                <button 
                  onClick={() => adjustPrice(50)}
                  className="w-12 h-12 bg-whiskey-medium border border-whiskey-light rounded-xl flex items-center justify-center text-stone-400 active:scale-95"
                >
                  +50
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsEditingOffer(false)}
                  className="py-3 bg-whiskey-medium text-stone-400 rounded-xl font-bold uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const val = parseInt(offerInput);
                    if (!isNaN(val) && negotiation) {
                      const clampedVal = negotiation.isPlayerBuying 
                        ? Math.max(negotiation.minPrice, Math.min(negotiation.maxPrice, val))
                        : Math.max(1, val);
                      setNegotiation({ ...negotiation, currentOffer: clampedVal });
                    }
                    setIsEditingOffer(false);
                  }}
                  className="py-3 bg-whiskey-gold text-whiskey-dark rounded-xl font-black uppercase text-xs tracking-widest"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contextual Tutorial */}
      <ContextualTutorial 
        step={activeTutorial} 
        page={tutorialPage} 
        onNext={handleTutorialNext} 
      />
    </div>
    </>
  );
}

const NavButton = ({ active, onClick, icon, label, badge, highlight }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number, highlight?: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 relative transition-all ${active ? 'text-whiskey-gold' : 'text-stone-500'} ${highlight ? 'z-[200] relative rounded-lg px-1 h-[34px] flex items-center justify-center shadow-[0_0_30px_rgba(255,191,0,0.5),inset_0_0_15px_rgba(255,191,0,0.3)] bg-whiskey-gold/15' : ''}`}
  >
    <div className={`p-1 rounded-lg transition-colors ${active ? 'bg-whiskey-dark' : ''}`}>
      {icon}
    </div>
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
    {badge !== undefined && (
      <span className="absolute -top-1 -right-1 bg-whiskey-money text-whiskey-dark text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-whiskey-medium">
        {badge}
      </span>
    )}
  </button>
);

const OptionsMenu = ({ settings, onClose, onUpdate, onReturnToMenu, inGame, money, onUpdateMoney }: { 
  settings: Settings, 
  onClose: () => void, 
  onUpdate: (s: Partial<Settings>) => void,
  onReturnToMenu: () => void,
  inGame: boolean,
  money: number,
  onUpdateMoney: (m: number) => void
}) => {
  const [isEditingMoney, setIsEditingMoney] = useState(false);
  const [moneyInput, setMoneyInput] = useState(money.toString());

  const handleMoneySubmit = () => {
    const val = parseInt(moneyInput);
    if (!isNaN(val)) {
      onUpdateMoney(val);
    }
    setIsEditingMoney(false);
  };

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-whiskey-medium border border-whiskey-light p-8 rounded-[32px] max-w-sm w-full space-y-8 shadow-2xl relative"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-stone-500 hover:text-white">
        <X size={24} />
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Options</h2>
      </div>

      <div className="space-y-6">
        {/* Music Volume */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Music Volume</p>
            <p className="text-sm font-black text-whiskey-gold">{settings.musicVolume}%</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onUpdate({ musicVolume: Math.max(0, settings.musicVolume - 25) })}
              className="p-2 bg-whiskey-dark border border-whiskey-light rounded-lg text-whiskey-gold"
            >
              <Minus size={16} />
            </button>
            <div className="flex-1 h-2 bg-whiskey-dark rounded-full overflow-hidden">
              <div className="h-full bg-whiskey-gold transition-all" style={{ width: `${settings.musicVolume}%` }} />
            </div>
            <button 
              onClick={() => onUpdate({ musicVolume: Math.min(100, settings.musicVolume + 25) })}
              className="p-2 bg-whiskey-dark border border-whiskey-light rounded-lg text-whiskey-gold"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Sound Volume */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Sound Volume</p>
            <p className="text-sm font-black text-whiskey-gold">{settings.soundVolume}%</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onUpdate({ soundVolume: Math.max(0, settings.soundVolume - 25) })}
              className="p-2 bg-whiskey-dark border border-whiskey-light rounded-lg text-whiskey-gold"
            >
              <Minus size={16} />
            </button>
            <div className="flex-1 h-2 bg-whiskey-dark rounded-full overflow-hidden">
              <div className="h-full bg-whiskey-gold transition-all" style={{ width: `${settings.soundVolume}%` }} />
            </div>
            <button 
              onClick={() => onUpdate({ soundVolume: Math.min(100, settings.soundVolume + 25) })}
              className="p-2 bg-whiskey-dark border border-whiskey-light rounded-lg text-whiskey-gold"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Dev Options */}
        <div className="pt-6 border-t border-whiskey-light space-y-3">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest text-center">Dev Options</p>
          <div className="flex items-center justify-between bg-whiskey-dark p-3 rounded-xl border border-whiskey-light">
            <p className="text-xs font-bold text-stone-400">Money</p>
            <div className="flex items-center gap-3">
              <button onClick={() => onUpdateMoney(Math.max(0, money - 1000))} className="text-red-400"><Minus size={14} /></button>
              {isEditingMoney ? (
                <input
                  autoFocus
                  type="number"
                  value={moneyInput}
                  onChange={(e) => setMoneyInput(e.target.value)}
                  onBlur={handleMoneySubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleMoneySubmit()}
                  className="w-24 bg-whiskey-dark border border-whiskey-gold rounded px-1 text-sm font-black text-whiskey-money text-center focus:outline-none"
                />
              ) : (
                <span 
                  onClick={() => {
                    setMoneyInput(money.toString());
                    setIsEditingMoney(true);
                  }}
                  className="text-sm font-black text-whiskey-money cursor-pointer hover:text-whiskey-gold transition-colors"
                >
                  ${money.toLocaleString()}
                </span>
              )}
              <button onClick={() => onUpdateMoney(money + 1000)} className="text-whiskey-money"><Plus size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {inGame && (
          <button 
            onClick={onReturnToMenu}
            className="w-full py-3 bg-red-900/30 text-red-400 border border-red-900/50 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Return to Main Menu
          </button>
        )}
        <button 
          onClick={onClose}
          className="w-full py-3 bg-whiskey-gold text-whiskey-dark rounded-xl font-black uppercase text-xs tracking-widest"
        >
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
  );
};
