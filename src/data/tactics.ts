import { Tactic } from '../types';

export const NEGOTIATION_TACTICS: Tactic[] = [
  {
    id: 'sample',
    name: 'Offer a Sample',
    description: 'Offer a small pour to build hospitality. Increases patience and trust.',
    minSkill: 0,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 2 
      ? (isPlayerBuying ? "Uh, would you mind if I had a tiny sip of this? I want to be sure." : "Uh, would you like a tiny sip of this? I think it's supposed to be pretty good.")
      : (isPlayerBuying ? "Before we talk numbers, I'd appreciate a small pour to truly evaluate the complexity of this bottling." : "This particular bottling has a legendary finish. Let's have a small pour so you can truly appreciate the complexity before we talk numbers.")
  },
  {
    id: 'admire',
    name: 'Admire the Bottle',
    description: 'Validate the customer\'s taste. Increases trust.',
    minSkill: 0,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 2
      ? "That's a really nice looking bottle you have there."
      : "The presentation on this era of bottling is exquisite. You clearly have a refined eye for quality."
  },
  {
    id: 'fair_shake',
    name: 'The Fair Shake',
    description: 'A direct statement of professional integrity. Reduces aggressiveness.',
    minSkill: 0,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 2
      ? "I just want to make a deal that's fair, you know?"
      : "I pride myself on transparency. My goal is a transaction where we both walk away satisfied with the value."
  },
  {
    id: 'ledger',
    name: 'Consult the Ledger',
    description: 'Use historical data to anchor the price. Reduces aggressiveness and moves target price.',
    minSkill: 0,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 2
      ? "Wait, let me look at my price list... I want to be sure I'm not making a mistake here."
      : "The recent market data for this distillery is quite specific. Let me pull up my latest records so we can ensure this transaction is accurate to current values."
  },
  {
    id: 'flattery',
    name: 'Flattery',
    description: 'Charm the customer with compliments. High trust boost, but can backfire on skeptics.',
    minSkill: 2,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 4 
      ? "You look like someone who knows their whiskey!" 
      : "It's rare to meet someone with such an impeccable sense of timing and taste."
  },
  {
    id: 'market_insight',
    name: 'Market Insight',
    description: 'Show off your knowledge of current trends to justify your price.',
    minSkill: 2,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 4
      ? "I heard this distillery is getting popular lately."
      : "Given the recent acquisition of this distillery, the secondary market for these older labels is tightening significantly."
  },
  {
    id: 'shared_passion',
    name: 'Shared Passion',
    description: 'Connect over the craft. Massive trust boost for enthusiasts.',
    minSkill: 4,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 6
      ? "I really love the way they make this one."
      : "I can tell you really appreciate the craft. This distillery uses a very specific char on their barrels that creates that unique profile..."
  },
  {
    id: 'point_out_flaws',
    name: 'Point Out Flaws',
    description: 'Highlight minor issues to lower their price or justify yours. Hurts patience.',
    minSkill: 4,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 6
      ? "The label is a bit scuffed up, don't you think?"
      : "While the liquid is pristine, the slight oxidation on the capsule is a factor we must consider in the final valuation."
  },
  {
    id: 'long_game',
    name: 'The Long Game',
    description: 'Show you are in no rush. Maxes out patience.',
    minSkill: 6,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 8
      ? "I'm in no hurry, take your time."
      : (isPlayerBuying ? "Take your time, I'm in no rush to acquire this. Quality like this deserves careful consideration." : "Take your time, I'm in no rush to see this leave the shelf. Quality like this deserves careful consideration.")
  },
  {
    id: 'scarcity',
    name: 'Scarcity Play',
    description: 'Create urgency. Increases walk-away chance but can force a quick deal.',
    minSkill: 6,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 8
      ? (isPlayerBuying ? "I've seen a few of these around lately." : "I have another guy interested in this one.")
      : (isPlayerBuying ? "I should mention I've seen several of these specific bottlings at auction recently. It's not as rare as it once was." : "I should mention I've had several inquiries about this specific bottling this morning. It likely won't be here by closing.")
  },
  {
    id: 'guarantee',
    name: 'Personal Guarantee',
    description: 'Stake your reputation. High success rate if price is reasonable.',
    minSkill: 8,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => isPlayerBuying ? "I stand behind my offers. You won't find a better, more honest valuation anywhere else." : "I stand behind every bottle in this shop. You have my word on its provenance and quality."
  },
  {
    id: 'the_walk_away',
    name: 'The Walk Away',
    description: 'The ultimate power move. High risk, high reward price shift.',
    minSkill: 8,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 10
      ? "Maybe we just can't make a deal today."
      : "It seems we are at an impasse. I've given my best offer; perhaps this isn't the right time for this particular transaction."
  }
];
