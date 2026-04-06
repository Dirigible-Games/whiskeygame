import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, X, Calendar, Info } from 'lucide-react';
import { MarketTrend } from '../data/trends';

interface MarketTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  trend: MarketTrend;
  daysRemaining: number;
}

export const MarketTrendModal: React.FC<MarketTrendModalProps> = ({ isOpen, onClose, trend, daysRemaining }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-whiskey-medium border border-whiskey-light rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Header / Banner */}
            <div className="bg-whiskey-gold/10 p-8 border-b border-whiskey-light/30 relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-whiskey-gold rounded-2xl flex items-center justify-center shadow-lg shadow-whiskey-gold/20">
                  <TrendingUp size={24} className="text-whiskey-dark" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
                    {trend.name}
                  </h2>
                  <div className="flex items-center gap-2 text-whiskey-gold font-bold uppercase tracking-widest text-[10px]">
                    <Calendar size={12} />
                    <span>Duration: {daysRemaining} Days Remaining</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-whiskey-gold/20 rounded-lg text-whiskey-gold">
                    <Info size={16} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {trend.description}
                    </p>
                    <p className="text-whiskey-gold font-bold italic text-sm leading-relaxed">
                      "{trend.flavorText}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-whiskey-dark/50 p-4 rounded-2xl border border-whiskey-light/20">
                <p className="text-stone-500 text-[10px] uppercase font-black tracking-widest mb-2">Market Insight</p>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Market trends shift periodically. Keep an eye on the icon in your shop header to review this information at any time.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-whiskey-gold hover:bg-whiskey-amber text-whiskey-dark rounded-xl font-black uppercase tracking-widest shadow-xl shadow-whiskey-gold/20 transition-all active:scale-95"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
