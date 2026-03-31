import { CustomerPersonality, Bottle } from '../types';

export const DEAL_TEXTS: Record<CustomerPersonality, { buying: string, selling: string }> = {
  [CustomerPersonality.EASYGOING]: {
    buying: "You've got yourself a deal! I'm happy to see this {brand} go to a good home.",
    selling: "That's a fair price for a {type}. I'll take it!"
  },
  [CustomerPersonality.EXPERT]: {
    buying: "A reasonable offer for a {year} bottling. We have a deal.",
    selling: "That matches my valuation of this {brand}. I'll buy it."
  },
  [CustomerPersonality.GREEDY]: {
    buying: "Fine, fine. Take the {productLine} before I change my mind.",
    selling: "I suppose that's acceptable for this {brand}. Deal."
  },
  [CustomerPersonality.DESPERATE]: {
    buying: "Thank you! Yes, that works. I really appreciate it.",
    selling: "I can afford that. Thank you so much."
  },
  [CustomerPersonality.COLLECTOR]: {
    buying: "I'm glad it's going to a serious shop. I hope you find a good home for it.",
    selling: "Excellent. This {brand} will be a fine addition to my collection."
  },
  [CustomerPersonality.NOVICE]: {
    buying: "Oh, okay! If you say that's what it's worth, I trust you.",
    selling: "I'll take it! I hope it's as good as you say."
  },
  [CustomerPersonality.SKEPTIC]: {
    buying: "Fine. I'll sell it. But I still think you're getting the better end of this.",
    selling: "Alright, I'll buy it. It seems legitimate enough."
  },
  [CustomerPersonality.BARGAIN_HUNTER]: {
    buying: "You drive a hard bargain, but I'll take the cash.",
    selling: "Finally, a price that makes sense for a {type}. Deal."
  }
};

export const WALK_AWAY_TEXTS: Record<CustomerPersonality, { buying: string, selling: string }> = {
  [CustomerPersonality.EASYGOING]: {
    buying: "I don't think we're going to find a middle ground here. I'll take my {brand} elsewhere.",
    selling: "I don't think we're going to find a middle ground here. I'll be heading out."
  },
  [CustomerPersonality.EXPERT]: {
    buying: "Your numbers for this {brand} are completely detached from reality. I'm wasting my time.",
    selling: "Your prices for this {brand} are completely detached from reality. I'm wasting my time."
  },
  [CustomerPersonality.GREEDY]: {
    buying: "You're trying to rob me blind! I'm taking my {type} and leaving.",
    selling: "You're trying to rob me blind! I'm not paying that."
  },
  [CustomerPersonality.DESPERATE]: {
    buying: "I... I can't do that. I need to find someone more reasonable to sell to. Sorry.",
    selling: "I... I can't do that. I need to find a cheaper bottle. Sorry."
  },
  [CustomerPersonality.COLLECTOR]: {
    buying: "I'm looking for serious buyers, not games. I'll look elsewhere to sell my {distillery} bottles.",
    selling: "I'm looking for serious sellers, not games. I'll look elsewhere for my {distillery} bottles."
  },
  [CustomerPersonality.NOVICE]: {
    buying: "This is all a bit too much for me. I think I'll just keep the bottle.",
    selling: "This is all a bit too much for me. I think I'll just go without."
  },
  [CustomerPersonality.SKEPTIC]: {
    buying: "I knew this was a waste of time. You're trying to steal my {brand}. I'm leaving.",
    selling: "I knew this was a waste of time. You're trying to rip me off. I'm leaving."
  },
  [CustomerPersonality.BARGAIN_HUNTER]: {
    buying: "I can find a better buyer than this at a gas station. I'm out.",
    selling: "I can find a better deal than this at a gas station. I'm out."
  }
};

export const COUNTER_TEXTS_FAR: Record<CustomerPersonality, { buying: string, selling: string }> = {
  [CustomerPersonality.EASYGOING]: {
    buying: "Whoa, that's a bit lower than I was hoping for. Can you come up closer to my ask?",
    selling: "Whoa, that's a bit higher than I was hoping for. Can you come down closer to my budget?"
  },
  [CustomerPersonality.EXPERT]: {
    buying: "That's an insulting offer for a {brand} of this caliber. You'll need to do much better.",
    selling: "That's an insulting price for a {brand} of this caliber. You'll need to do much better."
  },
  [CustomerPersonality.GREEDY]: {
    buying: "Are you joking? I'm not giving this {type} away. My price is firm, but I'll drop a tiny bit.",
    selling: "Are you joking? I'm not paying that much. My price is firm, but I'll go up a tiny bit."
  },
  [CustomerPersonality.DESPERATE]: {
    buying: "Please, I really need more than that. It's a special bottle...",
    selling: "Please, I really can't afford that much. Can we do better?"
  },
  [CustomerPersonality.COLLECTOR]: {
    buying: "I know exactly what this {productLine} is worth. Your offer is nowhere near the market value.",
    selling: "I know exactly what this {productLine} is worth. Your price is nowhere near the market value."
  },
  [CustomerPersonality.NOVICE]: {
    buying: "Is it really only worth that much? I thought it was more... can we do better?",
    selling: "Is it really that expensive? I thought it was less... can we do better?"
  },
  [CustomerPersonality.SKEPTIC]: {
    buying: "I expected as much. You're trying to lowball me. I'm not biting.",
    selling: "I expected as much. You're trying to overcharge me. I'm not biting."
  },
  [CustomerPersonality.BARGAIN_HUNTER]: {
    buying: "You're going to have to do better than that if you want my {brand}.",
    selling: "You're going to have to do better than that if you want my money."
  }
};

export const COUNTER_TEXTS_CLOSE: Record<CustomerPersonality, { buying: string, selling: string }> = {
  [CustomerPersonality.EASYGOING]: {
    buying: "We're getting there! Just a little more and we've got a deal for this {brand}.",
    selling: "We're getting there! Just a little less and we've got a deal."
  },
  [CustomerPersonality.EXPERT]: {
    buying: "You're closer to the mark now. Still a bit off for a {year} bottling, though.",
    selling: "You're closer to the mark now. Still a bit high for a {year} bottling, though."
  },
  [CustomerPersonality.GREEDY]: {
    buying: "Better. Still not enough. Let's meet here for the {type}.",
    selling: "Better. Still too much. Let's meet here."
  },
  [CustomerPersonality.DESPERATE]: {
    buying: "That's almost enough... just a bit more and I can let it go.",
    selling: "That's almost affordable... just a bit less and I can take it."
  },
  [CustomerPersonality.COLLECTOR]: {
    buying: "We are approaching a fair valuation for this {brand}. Let's refine it.",
    selling: "We are approaching a fair price for this {brand}. Let's refine it."
  },
  [CustomerPersonality.NOVICE]: {
    buying: "Oh, that sounds closer to what I was thinking! How about this?",
    selling: "Oh, that sounds closer to what I can afford! How about this?"
  },
  [CustomerPersonality.SKEPTIC]: {
    buying: "Hmm. That's a more realistic number. But I still need a bit more.",
    selling: "Hmm. That's a more realistic number. But I still need a bit less."
  },
  [CustomerPersonality.BARGAIN_HUNTER]: {
    buying: "Now we're talking. Just a little more of a premium and you've got a seller.",
    selling: "Now we're talking. Just a little more of a discount and you've got a buyer."
  }
};
