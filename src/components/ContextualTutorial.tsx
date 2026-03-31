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
      content: "You've managed to score a liquor license in your city, and with it you've opened your rare and vintage whiskey business. Make a name for yourself and turn this street-side market stall into a tourist destination!"
    }
  ],
  shop_overview: [
    {
      title: "Operations",
      content: "Making good deals is key to raising your reputation. Failing deals will lower your reputation. Finishing 3 days with a negative reputation will result in license forfeiture. Rent is due every 7 days. Fail to make rent twice in a row, and you'll lose your business. Click 'Open Shop' to begin a day. "
    },
    {
      title: "Auctions",
      content: "If your inventory is getting full, you can host an auction to try to move some product to the highest bidders."
    },
    {
      title: "Shop Upgrades",
      content: "To attract wealthier clientele and rarer bottles, you need to upgrade your shop. Upgrading requires both Money and a minimum Reputation."
    },
    {
      title: "Tools",
      content: "You can buy Tools to help identify fakes or appraise bottles more accurately. Check the Tools menu to see what's available."
    },
    {
      title: "Skills",
      content: "As you trade different types of whiskey, you gain XP and level up those skills. Higher skills can give you an edge in negotiations. Check your progress in the Skills menu."
    },
    {
      title: "Inventory",
      content: "Your Inventory is where you manage your collection. You can view your bottles here, or spend extra time (and money) after hours researching them to learn what they might be worth."
    },
    {
      title: "The Codex",
      content: "Every bottle you encounter adds knowledge to your Codex. Discover Distilleries, Brands, and Product Lines to better identify the true value of rare bottles."
    }
  ],
  first_customer: [
    {
      title: "Conversation",
      content: "Use greetings and small talk to build rapport, reduce their walk-away chance, and maybe even learn something you didn't know."
    },
    {
      title: "Get to Business",
      content: "When you're ready to start making a deal, click 'Get to Business'."
    }
  ],
  first_deal: [
    {
      title: "The Bottle Card",
      content: "This is the Bottle Card. It contains all the information you know about the bottle, either from your own knowledge or from the customer's. Customers with higher knowledge will tell you more about the bottle."
    },
    {
      title: "Bottle Info",
      content: "These cells show the bottle's Region, Type, and Rarity. The rarer the bottle, the more money to be made."
    },
    {
      title: "Bottle Info",
      content: "These cells show any special Modifiers (think Single Barrel, Bottled-in-Bond, Cask Strength, or barrel finishes)."
    },
    {
      title: "Name & Statistics",
      content: "Here you'll find the Brand name and Product Line, along with the bottle's Proof, Age Statement, and Year of Production."
    },
    {
      title: "Inspect Button",
      content: "Use the Inspect button to examine the bottle closely. The more you learn about a type of whiskey, the better your chances of discovering unknown info about a bottle. The customer doesn't know what you learn, so use this to your advantage!"
    },
    {
      title: "Offers",
      content: "This area shows the customer's asking price and your current offer. Press on your offer (in green) to input your price, or raise/lower the price by $10 at a time with the buttons."
    },
    {
      title: "Transaction History",
      content: "Click this to view the history of your buy/sell transactions with this particular bottle. This can help you gauge the market value."
    },
    {
      title: "Tactics",
      content: "Use Tactics to influence the negotiation. Soft tactics can build rapport, while Hard tactics can push the price in your favor, but remember, every customer is different."
    },
    {
      title: "Final Actions",
      content: "When you're ready, Send your Counter Offer. If the price is right, you can Accept. If the deal starts to go sour, you can Walk Away."
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
