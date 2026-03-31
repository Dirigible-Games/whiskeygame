import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export type TutorialStep = 'welcome' | 'shop_overview' | 'first_customer' | 'first_deal' | null;

interface ContextualTutorialProps {
  step: TutorialStep;
  page: number;
  onNext: () => void;
}

const TUTORIAL_CONTENT: Record<NonNullable<TutorialStep>, { title: string; content: string }[]> = {
  welcome: [
    {
      title: "Welcome to Vintage Spirits",
      content: "You are the owner of a rare whiskey shop. Your goal is to buy low, sell high, and build the ultimate collection of rare spirits. Name your shop and create your legacy."
    }
  ],
  shop_overview: [
    {
      title: "Open Shop",
      content: "Click 'Open Shop' to start your day. Customers will begin arriving with bottles to sell or looking to buy from your collection."
    },
    {
      title: "Auctions",
      content: "If your inventory is full, you can host an auction to sell off your most valuable bottles to the highest bidder. The 'Host Auction' button is always here, but you need inventory to use it."
    },
    {
      title: "Shop Upgrades",
      content: "To attract wealthier clientele and rarer bottles, you need to upgrade your shop. Upgrading requires both Money and Reputation. Keep an eye on the Upgrade button!"
    },
    {
      title: "Tools",
      content: "You can buy Tools to help identify fakes or appraise bottles more accurately. Check the Tools menu to see what's available."
    },
    {
      title: "Skills",
      content: "As you trade different types of whiskey, you gain XP and level up those skills. Higher skills give you an edge in negotiations. Check your progress in the Skills menu."
    },
    {
      title: "Inventory",
      content: "Your Inventory is where you manage your collection. You can view your bottles, check their stats, and decide what to keep or sell."
    },
    {
      title: "The Codex",
      content: "Every bottle you encounter adds knowledge to your Codex. Discover Distilleries, Brands, and Product Lines to better identify the true value of rare bottles."
    }
  ],
  first_customer: [
    {
      title: "Conversation",
      content: "When a customer enters, you enter a negotiation. Use greetings and small talk to build rapport, reduce their walk-away chance, and learn about their preferences."
    },
    {
      title: "Get to Business",
      content: "When you're ready to start haggling over the price, click 'Get to Business'. Be careful not to chat too long if the customer is impatient!"
    }
  ],
  first_deal: [
    {
      title: "The Bottle Card",
      content: "This is the Bottle Card. It contains all the information you need to appraise the bottle and negotiate a fair price."
    },
    {
      title: "Left Info Cells",
      content: "These cells show the Region, Whiskey Type, and Rarity. This helps you determine the base value of the bottle."
    },
    {
      title: "Right Info Cells",
      content: "These cells show any special Modifiers (like Single Barrel or Cask Strength)."
    },
    {
      title: "Name & Bottom Cells",
      content: "Here you'll find the Distillery, Brand, and specific Product Line, along with the Proof, Age Statement, and Year of Production."
    },
    {
      title: "Inspect Button",
      content: "Use the Inspect button to examine the bottle closely. This can reveal hidden flaws, confirm authenticity, or uncover special details."
    },
    {
      title: "Price & Bid",
      content: "This area shows the customer's asking price and your current bid. You can adjust your bid to negotiate."
    },
    {
      title: "Transaction History",
      content: "Click this to view past transactions for similar bottles. This helps you gauge the market value."
    },
    {
      title: "Tactics",
      content: "Use Tactics to influence the negotiation. Soft tactics build rapport, while Hard tactics push the price in your favor."
    },
    {
      title: "Final Actions",
      content: "When you're ready, Send your Counter Offer. If the price is right, you can Accept. If the deal goes sour, you can Walk Away."
    }
  ]
};

export const ContextualTutorial: React.FC<ContextualTutorialProps> = ({ step, page, onNext }) => {
  if (!step) return null;

  const content = TUTORIAL_CONTENT[step][page];
  if (!content) return null;

  const isTopPosition = 
    (step === 'shop_overview') || // All shop overview items are lower half
    (step === 'first_customer') || // Conversation buttons are at the bottom
    (step === 'first_deal' && page >= 5); // Negotiation actions are at the bottom

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-black/60 pointer-events-auto"
      />
      <div className="fixed inset-0 z-[250] pointer-events-auto" />
      <motion.div 
        initial={{ opacity: 0, y: isTopPosition ? -20 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isTopPosition ? -20 : 20 }}
        className={`fixed left-1/2 -translate-x-1/2 z-[500] w-[90%] max-w-md ${isTopPosition ? 'top-12' : 'bottom-24'}`}
      >
        <div className="bg-whiskey-medium border-2 border-whiskey-gold p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">{content.title}</h3>
            <p className="text-stone-300 text-sm mt-2">{content.content}</p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={onNext}
              className="p-3 bg-whiskey-gold text-whiskey-dark rounded-xl hover:bg-whiskey-amber font-black uppercase text-xs tracking-widest flex items-center gap-1 transition-colors"
            >
              {page === TUTORIAL_CONTENT[step].length - 1 ? 'Got it' : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
