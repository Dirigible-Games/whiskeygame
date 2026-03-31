import { CustomerPersonality, Customer, Bottle } from '../types';

export const DIALOGUE_RESPONSES: Record<string, Record<CustomerPersonality, string>> = {
  'friendly_greeting': {
    [CustomerPersonality.EASYGOING]: "Hey there! Good to see a friendly face. I brought something from this {brand} in today.|Hey there! Good to see a friendly face. It's a beautiful day to buy some {type}, isn't it?",
    [CustomerPersonality.EXPERT]: "Hello. I've brought a {year} bottle from {distillery} that I think you'll find interesting. Let's see if you agree.|Hello. I appreciate the warm welcome, but let's see if your inventory matches your hospitality.",
    [CustomerPersonality.GREEDY]: "Yeah, yeah, hi. I've got a {brand} {productLine} bottle here that's worth a fortune. Hope you've got deep pockets today.|Yeah, yeah, hi. I'm busy, so let's hope you've got some good prices on some {type} bottles today.",
    [CustomerPersonality.DESPERATE]: "Oh, hello! Thank you for seeing me. I... I really need to sell this bottle of {brand}.|Oh, hello! Thank you for seeing me. I... I really need a bottle of {type} for tonight.",
    [CustomerPersonality.COLLECTOR]: "Good day. I'm thinning out my collection and thought your shop might appreciate this {brand} {productLine} bottle.|Good day. I've heard your shop has some interesting pieces. I'm looking for a bottle from {brand} to complete a set.",
    [CustomerPersonality.NOVICE]: "Hi! I found this bottle of {brand} in my grandfather's attic. I'm not sure what it is, but it looks old!|Hi! Wow, you have so many bottles here. I'm just starting to learn about {type}.",
    [CustomerPersonality.SKEPTIC]: "Hello. I've heard a lot of talk about this place. Let's see if you give a fair price for this bottle of {brand}.|Hello. I've heard a lot of talk about this place. Let's see if your {type} selection is actually any good.",
    [CustomerPersonality.BARGAIN_HUNTER]: "Hey. I'm looking to offload some {type}. Hope you're buying today.|Hey. Hope you're ready to move some inventory today. I'm looking for a deal on something from {brand}."
  },
  'professional_greeting': {
    [CustomerPersonality.EASYGOING]: "Good day to you too! Very formal, I like it. I'm hoping to sell this bottle of {brand}.|Good day to you too! Very formal, I like it. Let's see what {type} you have.",
    [CustomerPersonality.EXPERT]: "Good day. I prefer a business-like approach. I have a {year} bottle from {distillery} to discuss.|Good day. I prefer a business-like approach. Let's see your {type} selection.",
    [CustomerPersonality.GREEDY]: "Right. Business. That's what I'm here for. Let's talk numbers on this {brand} bottle soon.|Right. Business. That's what I'm here for. Show me the good stuff.",
    [CustomerPersonality.DESPERATE]: "Yes, hello. I'm ready to discuss terms for this {brand} {productLine} whenever you are.|Yes, hello. I'm looking to buy some {type}, but I need a good price.",
    [CustomerPersonality.COLLECTOR]: "Greetings. I appreciate a professional establishment. I'm offering a piece of my {brand} collection.|Greetings. I appreciate a professional establishment. It suggests your inventory is well-curated.",
    [CustomerPersonality.NOVICE]: "Hello, sir. I'm here to... well, I'm here to sell this {brand} bottle, I think.|Hello, sir. I'm here to... well, I'm here to buy something nice, I think.",
    [CustomerPersonality.SKEPTIC]: "Good day. Let's keep this professional and straightforward. I have a {type} to sell.|Good day. Let's keep this professional and straightforward. No games.",
    [CustomerPersonality.BARGAIN_HUNTER]: "Hello. Let's get right to it. I'm here to see what you can offer me for this bottle of {brand}.|Hello. Let's get right to it. I'm here to see what kind of deal you can give me on a {type}."
  },
  'whiskey_smalltalk': {
    [CustomerPersonality.EASYGOING]: "Oh, I love a good {type}! There's something about that {brand} profile that just hits right, you know?|I've always enjoyed a solid {type}. Hoping this {brand} hits the spot.",
    [CustomerPersonality.EXPERT]: "The current market is fascinating. Too many people chasing labels instead of liquid quality, though everything out of {distillery} is usually really good.|I'm looking closely at {distillery} releases lately. Their {type} output has been... interesting.",
    [CustomerPersonality.GREEDY]: "Whiskey is a better investment than gold right now. That's why I'm here with this bottle of {brand}.|Whiskey is a better investment than gold right now. I'm looking for a {brand} bottle that will appreciate.",
    [CustomerPersonality.DESPERATE]: "I used to enjoy a glass now and then... but lately, I'm more interested in what this {brand} bottle is worth.|I used to enjoy a glass now and then... but lately, I just need a drink.",
    [CustomerPersonality.COLLECTOR]: "I've been tracking {distillery}'s output for years. I had a really great bottle from {year} that was just awesome.|I'm trying to complete a vertical series of {brand}. It's been quite the hunt.",
    [CustomerPersonality.NOVICE]: "I heard someone say 'peaty' once. Is that like... dirt? I'm still trying to figure out if I like {type}.|I heard someone say 'peaty' once. Is that like... dirt? I'm still trying to figure out what {type} to buy.",
    [CustomerPersonality.SKEPTIC]: "Everyone claims their bottles are 'hand-selected.' Usually, it's just marketing fluff, but {brand} bottles tend to be pretty legit.|Everyone seems to be going wild over {brand}'s {type}, so let's see what the fuss is about.",
    [CustomerPersonality.BARGAIN_HUNTER]: "I don't care much for the story behind {brand}. I care about the price per ounce.|I don't care much for the story behind {brand}. I care about the price per ounce."
  },
  'general_smalltalk': {
    [CustomerPersonality.EASYGOING]: "Can you believe this weather?|Can you believe this weather? Perfect for a porch pour.",
    [CustomerPersonality.EXPERT]: "The industry is changing, lots of new 'craft' distilleries popping up. But they're really hit or miss.|The industry is changing, lots of new 'craft' distilleries popping up. But they're really hit or miss.",
    [CustomerPersonality.GREEDY]: "Time is money, friend. I'm not here to talk about the weather.|Time is money, friend. I'm not here to talk about the weather.",
    [CustomerPersonality.DESPERATE]: "It's been a long week. I'm just looking to get this settled..|It's been a long week. I'm just looking to get this settled.",
    [CustomerPersonality.COLLECTOR]: "The local auction scene has been quite active lately. Some truly rare pieces surfacing, like this {brand} {productLine}.|The local auction scene has been quite active lately. Some truly rare pieces surfacing.",
    [CustomerPersonality.NOVICE]: "It's a nice shop you have here. Very... woody.|It's a nice shop you have here. Very... woody. I like the smell.",
    [CustomerPersonality.SKEPTIC]: "I've seen shops like this come and go. It's a tough business to stay honest in.|I've seen shops like this come and go. It's a tough business to stay honest in.",
    [CustomerPersonality.BARGAIN_HUNTER]: "Nice place. Must have a lot of overhead. Hope that doesn't mean your offers are low.|Nice place. Must have a lot of overhead. Hope that doesn't mean your prices are high."
  },
  'inspect_bottle': {
    [CustomerPersonality.EASYGOING]: "Sure, take a look!|Take your time! I'm in no rush. It's a great looking bottle.",
    [CustomerPersonality.EXPERT]: "Go ahead. I've already checked the fill level myself, but I understand the need for due diligence.|Checking the details? Good. I've already done my own assessment of this bottle, of course.",
    [CustomerPersonality.GREEDY]: "Make it quick. I don't have all day for you to gawk at it.|What are you doing? You should know what you're selling. Let's get to the price.",
    [CustomerPersonality.DESPERATE]: "Of course... please, check whatever you need. I just want to get this done.|Is something wrong? I hope it's still what you said it was...",
    [CustomerPersonality.COLLECTOR]: "By all means. I've kept this bottle in a temperature-controlled environment since I acquired it.|A thorough inspection is always wise. I've been doing the same from over here.",
    [CustomerPersonality.NOVICE]: "Oh, is that what you do? Cool! Tell me if you find anything interesting about it.|Wow, you're really looking at it closely! I should learn how to do that.",
    [CustomerPersonality.SKEPTIC]: "Go ahead. You won't find anything wrong with it, I've already looked.|Checking for flaws? I'm doing the same. I don't buy anything without a full look.",
    [CustomerPersonality.BARGAIN_HUNTER]: "Fine, but don't use it as an excuse to lowball me. It's solid.|Go ahead, look all you want. It won't change what I'm willing to pay."
  }
};

export const TACTIC_RESPONSES: Record<string, { success: Record<CustomerPersonality, string>; failure: Record<CustomerPersonality, string> }> = {
  'sample': {
    success: {
      [CustomerPersonality.EASYGOING]: "Oh, that's very kind of you! It's a lovely pour, really opens up the palate.",
      [CustomerPersonality.EXPERT]: "A generous offer. The nose on this is exactly what I expected from this vintage.",
      [CustomerPersonality.GREEDY]: "Free whiskey? I won't say no to that. It's... acceptable.",
      [CustomerPersonality.DESPERATE]: "Thank you, I... I really needed a moment to breathe. It's delicious.",
      [CustomerPersonality.COLLECTOR]: "An excellent choice for a sample. The complexity is truly remarkable.",
      [CustomerPersonality.NOVICE]: "Wow, is this for me? It's strong, but I like the way it smells!",
      [CustomerPersonality.SKEPTIC]: "Fine, I'll try it. But don't think a free drink is going to change my mind.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Free is my favorite price. It's good, but let's get back to the deal."
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "I'm not really thirsty right now, but thanks anyway.",
      [CustomerPersonality.EXPERT]: "I don't need a sample of anything. Let's stick to the business.",
      [CustomerPersonality.GREEDY]: "I'm not here for a handout. I'm here for a transaction.",
      [CustomerPersonality.DESPERATE]: "I really don't have time for a drink. I need to get this settled.",
      [CustomerPersonality.COLLECTOR]: "I've already tasted this bottling. Let's not waste any more time.",
      [CustomerPersonality.NOVICE]: "Oh, no thank you. I'm a bit nervous about trying something so... expensive.",
      [CustomerPersonality.SKEPTIC]: "You're just trying to cloud my judgment with alcohol. No thanks.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Unless that sample comes with a discount, I'm not interested."
    }
  },
  'admire': {
    success: {
      [CustomerPersonality.EASYGOING]: "It is a beauty, isn't it? I've always loved the label design.",
      [CustomerPersonality.EXPERT]: "You have a good eye. This particular glass is from a very limited run.",
      [CustomerPersonality.GREEDY]: "Of course it's nice. It's a premium item, and I expect a premium price.",
      [CustomerPersonality.DESPERATE]: "I'm glad you like it. It's one of the few things I have left of value.",
      [CustomerPersonality.COLLECTOR]: "Indeed. The provenance of this bottle is quite storied. I'm glad you appreciate it.",
      [CustomerPersonality.NOVICE]: "Thanks! I thought it looked pretty fancy myself.",
      [CustomerPersonality.SKEPTIC]: "It's a bottle. It's what's inside that counts, but I suppose it's in good shape.",
      [CustomerPersonality.BARGAIN_HUNTER]: "It's a nice bottle, sure. But I'm looking for a nice price to match."
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "It's just a bottle, really. Let's not get too caught up in the looks.",
      [CustomerPersonality.EXPERT]: "I'm not interested in aesthetic flattery. Let's talk about the liquid.",
      [CustomerPersonality.GREEDY]: "The bottle doesn't matter. The profit does.",
      [CustomerPersonality.DESPERATE]: "Please, don't just look at it. I really need to make this deal.",
      [CustomerPersonality.COLLECTOR]: "I'm well aware of its merits. I don't need them pointed out to me.",
      [CustomerPersonality.NOVICE]: "Oh... okay. I didn't think it was that special.",
      [CustomerPersonality.SKEPTIC]: "You're just trying to drive up the price by talking about the 'art'.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Pretty bottles don't pay the bills. Let's talk numbers."
    }
  },
  'fair_shake': {
    success: {
      [CustomerPersonality.EASYGOING]: "I appreciate that. I'm looking for a fair deal too.",
      [CustomerPersonality.EXPERT]: "Professionalism is rare these days. I respect your approach.",
      [CustomerPersonality.GREEDY]: "Fair is whatever makes me the most money, but I'll play along.",
      [CustomerPersonality.DESPERATE]: "Thank you. I really need someone to be fair with me right now.",
      [CustomerPersonality.COLLECTOR]: "A transparent negotiation is always preferred. Let's proceed.",
      [CustomerPersonality.NOVICE]: "That's good to hear. I was a bit worried about being taken advantage of.",
      [CustomerPersonality.SKEPTIC]: "We'll see. Actions speak louder than words, but it's a start.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Fair sounds good. As long as 'fair' means a great price for me."
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "That's a bit formal, isn't it? Let's just talk like people.",
      [CustomerPersonality.EXPERT]: "I've heard that line before. Let's see the numbers first.",
      [CustomerPersonality.GREEDY]: "Save the integrity speech. I'm here for the bottom line.",
      [CustomerPersonality.DESPERATE]: "I don't care about 'fair'. I just need the money.",
      [CustomerPersonality.COLLECTOR]: "I'm not here for a lecture on ethics. I'm here for a deal.",
      [CustomerPersonality.NOVICE]: "Oh... okay. I didn't think you were being unfair.",
      [CustomerPersonality.SKEPTIC]: "Everyone says they're fair right before they try to screw you over.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Fair doesn't mean anything to me. I want a bargain."
    }
  },
  'ledger': {
    success: {
      [CustomerPersonality.EASYGOING]: "Oh, you have a ledger? That's very organized. What does it say?",
      [CustomerPersonality.EXPERT]: "I've consulted similar data. Your records seem accurate.",
      [CustomerPersonality.GREEDY]: "If the data says it's worth more, then I want more. Simple as that.",
      [CustomerPersonality.DESPERATE]: "If the ledger says it's worth that much, then I have to believe you.",
      [CustomerPersonality.COLLECTOR]: "Market data is essential for a bottle of this caliber. I agree with your findings.",
      [CustomerPersonality.NOVICE]: "Wow, you have a whole book for this? You must really know your stuff.",
      [CustomerPersonality.SKEPTIC]: "Let me see those numbers. Hmm... okay, that seems legitimate.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Data is fine, but I'm looking at the reality of my wallet right now."
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "That's a lot of reading. Can't we just pick a number?",
      [CustomerPersonality.EXPERT]: "Your ledger is incomplete. It doesn't account for the recent auction spikes.",
      [CustomerPersonality.GREEDY]: "I don't care what your book says. I know what I want.",
      [CustomerPersonality.DESPERATE]: "Please, don't use a book to tell me I'm getting less. I need this.",
      [CustomerPersonality.COLLECTOR]: "Your data is flawed. It's not reflecting the true rarity of this cask.",
      [CustomerPersonality.NOVICE]: "You're making this very complicated. I just wanted to sell a bottle.",
      [CustomerPersonality.SKEPTIC]: "You probably wrote that ledger yourself this morning. I don't trust it.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Ledgers are for accountants. I'm a buyer looking for a deal."
    }
  },
  'flattery': {
    success: {
      [CustomerPersonality.EASYGOING]: "Well, thank you! I do try to keep a sharp eye out for the good stuff.",
      [CustomerPersonality.EXPERT]: "I appreciate the recognition. It's rare to find a shopkeeper who knows their stuff about {distillery}.",
      [CustomerPersonality.GREEDY]: "Finally, someone who recognizes true value. This {brand} is worth every penny.",
      [CustomerPersonality.DESPERATE]: "Oh, thank you... I've always been proud of this one.",
      [CustomerPersonality.COLLECTOR]: "Indeed. I've spent years curating my collection. I'm glad you noticed this {productLine}.",
      [CustomerPersonality.NOVICE]: "Wow, really? I just thought it looked cool! Thanks!",
      [CustomerPersonality.SKEPTIC]: "Hmm. You're not just saying that to get a better deal, are you? Fine, I'll listen.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Yeah, yeah. Flattery won't lower my price, but I appreciate the sentiment."
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "Oh, that's a bit much, don't you think? Let's just talk about the whiskey.",
      [CustomerPersonality.EXPERT]: "Don't try to butter me up. I know exactly what I have and what this {brand} is worth.",
      [CustomerPersonality.GREEDY]: "Save the sweet talk for someone who cares. I'm here for the money.",
      [CustomerPersonality.DESPERATE]: "Please, let's just get to the deal. I don't have time for this.",
      [CustomerPersonality.COLLECTOR]: "I'm not here for compliments. I'm here for a professional transaction.",
      [CustomerPersonality.NOVICE]: "Oh... that feels a bit weird. Are you okay?",
      [CustomerPersonality.SKEPTIC]: "I knew it. You're just trying to manipulate me. I'm losing my patience.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Nice try. My price is my price, no matter how much you like my 'taste'."
    }
  },
  'market_insight': {
    success: {
      [CustomerPersonality.EASYGOING]: "Is that so? I hadn't heard that about {type}. I guess I should be more careful.",
      [CustomerPersonality.EXPERT]: "You're right. The secondary market for {distillery} is shifting. I'll take that into account.",
      [CustomerPersonality.GREEDY]: "Hmm. If the market is cooling, maybe I should sell now before it drops further.",
      [CustomerPersonality.DESPERATE]: "Oh no... I didn't realize it was losing value. I need to sell quickly then.",
      [CustomerPersonality.COLLECTOR]: "Interesting. I've noticed similar trends in the recent auctions for {brand}. Fair point.",
      [CustomerPersonality.NOVICE]: "Market... trends? I don't really understand, but you seem to know what you're talking about.",
      [CustomerPersonality.SKEPTIC]: "I'll have to verify that, but it sounds plausible. Let's adjust the numbers.",
      [CustomerPersonality.BARGAIN_HUNTER]: "If it's not moving, then you should be giving me a better price!"
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "That sounds like a lot of technical talk. I'm just here for a bottle.",
      [CustomerPersonality.EXPERT]: "I think your data is outdated. I've seen this {brand} sell for much more recently.",
      [CustomerPersonality.GREEDY]: "I don't care about your 'market insights.' I know what I want.",
      [CustomerPersonality.DESPERATE]: "Please, don't tell me it's worth less. I really need this money.",
      [CustomerPersonality.COLLECTOR]: "I disagree with your assessment. This {productLine} is a blue-chip bottle, regardless of trends.",
      [CustomerPersonality.NOVICE]: "You're confusing me with all these numbers. Can we just talk about the price?",
      [CustomerPersonality.SKEPTIC]: "Nice try. You're just making things up to lower my expectations.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Market trends? Sounds like an excuse to overcharge me."
    }
  },
  'point_out_flaws': {
    success: {
      [CustomerPersonality.EASYGOING]: "Oh, I didn't even notice that scuff. You're right, it's not perfect.",
      [CustomerPersonality.EXPERT]: "Sharp eye. I missed that label tear on the {brand}. I'll adjust my price accordingly.",
      [CustomerPersonality.GREEDY]: "Fine, it's got a few scratches. It's still a great {type}, though.",
      [CustomerPersonality.DESPERATE]: "Oh dear... I didn't mean to bring a damaged bottle. I'll take less for it.",
      [CustomerPersonality.COLLECTOR]: "You're right. For a collector, that fill level is a serious issue. My apologies.",
      [CustomerPersonality.NOVICE]: "Is that bad? I didn't know that mattered. Sorry!",
      [CustomerPersonality.SKEPTIC]: "I suppose you're right about the label. It's not in mint condition.",
      [CustomerPersonality.BARGAIN_HUNTER]: "If it's flawed, then I'm definitely not paying full price!"
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "You're being a bit picky, aren't you? It's just a tiny mark.",
      [CustomerPersonality.EXPERT]: "That's standard shelf wear for a {year} bottle. You're reaching for excuses now.",
      [CustomerPersonality.GREEDY]: "Stop nitpicking! You're just trying to cheat me out of my money.",
      [CustomerPersonality.DESPERATE]: "Please, don't be so hard on it. It's all I have.",
      [CustomerPersonality.COLLECTOR]: "That's a natural patina! You clearly don't understand vintage {distillery} bottles.",
      [CustomerPersonality.NOVICE]: "You're being mean to my bottle! It's a perfectly good bottle.",
      [CustomerPersonality.SKEPTIC]: "You're just looking for any tiny flaw to lowball me. I'm not falling for it.",
      [CustomerPersonality.BARGAIN_HUNTER]: "A flaw? That's just more reason for you to give me a discount!"
    }
  },
  'the_walk_away': {
    success: {
      [CustomerPersonality.EASYGOING]: "Wait! Don't go. I'm sure we can find a price that works for both of us.",
      [CustomerPersonality.EXPERT]: "Hold on. I'm willing to be more flexible if it means we can close this deal on the {brand}.",
      [CustomerPersonality.GREEDY]: "Wait, wait! Don't be hasty. Let's look at the numbers again.",
      [CustomerPersonality.DESPERATE]: "Please! Don't leave! I'll take whatever you're offering, just don't go!",
      [CustomerPersonality.COLLECTOR]: "I'd hate to see this {productLine} go elsewhere. Let's talk seriously.",
      [CustomerPersonality.NOVICE]: "Oh no! Did I do something wrong? Please stay!",
      [CustomerPersonality.SKEPTIC]: "Fine, fine. You've made your point. I'll lower my price.",
      [CustomerPersonality.BARGAIN_HUNTER]: "Wait! I'm here to buy! Let's make a deal happen."
    },
    failure: {
      [CustomerPersonality.EASYGOING]: "Well, if you're not interested, I guess I'll just head out. Have a nice day.",
      [CustomerPersonality.EXPERT]: "If you can't appreciate the value here, I'll find someone who can. Goodbye.",
      [CustomerPersonality.GREEDY]: "Fine! Go! I'll find someone who actually has the money for this {brand}.",
      [CustomerPersonality.DESPERATE]: "Oh... okay. I guess I'll try somewhere else then...",
      [CustomerPersonality.COLLECTOR]: "I don't have time for games. If you're not serious about this {distillery}, I'm leaving.",
      [CustomerPersonality.NOVICE]: "Oh... okay. Sorry for bothering you.",
      [CustomerPersonality.SKEPTIC]: "I knew you weren't serious. You're just wasting my time. I'm out of here.",
      [CustomerPersonality.BARGAIN_HUNTER]: "If you don't want to sell, I'll find a better deal elsewhere."
    }
  }
};
