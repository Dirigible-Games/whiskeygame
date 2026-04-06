import { Bottle, WhiskeyType, Region, Rarity } from '../types';

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  flavorText: string;
  minDuration: number;
  maxDuration: number;
  calculateMultiplier: (bottle: Bottle) => number;
}

export const MARKET_TRENDS: MarketTrend[] = [
  {
    id: 'bourbon_boom',
    name: 'Bourbon Boom',
    description: 'A sudden surge in popularity for Bourbon has driven up prices across the board.',
    flavorText: 'Bourbon bottles are currently high-demand items. Expect to pay more and sell for more!',
    minDuration: 4,
    maxDuration: 7,
    calculateMultiplier: (bottle) => bottle.type === WhiskeyType.BOURBON ? 1.3 : 1.0,
  },
  {
    id: 'rye_revival',
    name: 'Rye Revival',
    description: 'Mixologists are rediscovering Rye whiskey, increasing demand for spicy spirits.',
    flavorText: 'Rye whiskey is the talk of the town. Spicy profiles are fetching a premium right now.',
    minDuration: 3,
    maxDuration: 6,
    calculateMultiplier: (bottle) => bottle.type === WhiskeyType.RYE ? 1.4 : 1.0,
  },
  {
    id: 'scotch_shortage',
    name: 'Scotch Shortage',
    description: 'Supply chain issues in Scotland have made Scotch whisky harder to find.',
    flavorText: 'Single Malt Scotch is becoming increasingly scarce. Prices are climbing as supply drops.',
    minDuration: 5,
    maxDuration: 8,
    calculateMultiplier: (bottle) => bottle.type === WhiskeyType.SINGLE_MALT_SCOTCH ? 1.5 : 1.0,
  },
  {
    id: 'japanese_craze',
    name: 'Japanese Craze',
    description: 'Collectors are going crazy for Japanese whisky, sending prices to the moon.',
    flavorText: 'The world has its eyes on Japan. Japanese whiskies are the hottest commodities on the market.',
    minDuration: 4,
    maxDuration: 7,
    calculateMultiplier: (bottle) => bottle.type === WhiskeyType.JAPANESE_WHISKY ? 1.6 : 1.0,
  },
  {
    id: 'cask_strength_craze',
    name: 'Cask Strength Craze',
    description: 'High-proof whiskeys are all the rage right now. The higher the proof, the higher the price.',
    flavorText: 'Enthusiasts are hunting for high-proof "cask strength" bottles. The stronger, the better!',
    minDuration: 3,
    maxDuration: 6,
    calculateMultiplier: (bottle) => bottle.proof >= 110 ? 1.3 : 1.0,
  },
  {
    id: 'age_statement_appreciation',
    name: 'Age Statement Appreciation',
    description: 'Older whiskeys are seeing a spike in value as consumers seek out mature spirits.',
    flavorText: 'Maturity is in style. Bottles with high age statements are seeing significant value growth.',
    minDuration: 4,
    maxDuration: 7,
    calculateMultiplier: (bottle) => bottle.age >= 12 ? 1.4 : 1.0,
  },
  {
    id: 'kentucky_pride',
    name: 'Kentucky Pride',
    description: 'A new documentary about Kentucky distilleries has sparked intense interest in the region.',
    flavorText: 'American-made spirits, particularly from Kentucky, are seeing a patriotic surge in interest.',
    minDuration: 3,
    maxDuration: 5,
    calculateMultiplier: (bottle) => bottle.region === Region.USA ? 1.25 : 1.0,
  },
  {
    id: 'unicorn_hunt',
    name: 'Unicorn Hunt',
    description: 'Wealthy collectors are aggressively hunting for the rarest bottles on the market.',
    flavorText: 'The "Unicorns" are being hunted. Legendary and rare bottles are commanding astronomical prices.',
    minDuration: 2,
    maxDuration: 4,
    calculateMultiplier: (bottle) => (bottle.rarity === Rarity.LEGENDARY || bottle.rarity === Rarity.UNICORN) ? 1.5 : 1.0,
  },
  {
    id: 'bottom_shelf_bargains',
    name: 'Budget Bourbon Trend',
    description: 'A popular influencer just reviewed a bunch of cheap whiskeys, causing a run on common bottles.',
    flavorText: 'Common, everyday bottles are suddenly trendy. Don\'t underestimate the "bottom shelf" right now.',
    minDuration: 3,
    maxDuration: 5,
    calculateMultiplier: (bottle) => bottle.rarity === Rarity.COMMON ? 1.3 : 1.0,
  },
  {
    id: 'single_barrel_surge',
    name: 'Single Barrel Surge',
    description: 'Consumers are seeking unique expressions, driving up the price of Single Barrel releases.',
    flavorText: 'Single Barrel expressions are hot. Collectors want those unique, one-of-a-kind profiles.',
    minDuration: 4,
    maxDuration: 6,
    calculateMultiplier: (bottle) => bottle.modifiers.includes('Single Barrel') ? 1.35 : 1.0,
  },
  {
    id: 'wheater_weather',
    name: 'Wheater Weather',
    description: 'Wheated bourbons are the flavor of the month, seeing a solid bump in value.',
    flavorText: 'Smooth, wheated bourbons are in high demand. If it\'s a "wheater," it\'s worth more today.',
    minDuration: 4,
    maxDuration: 7,
    calculateMultiplier: (bottle) => bottle.modifiers.includes('Wheated') ? 1.4 : 1.0,
  },
  {
    id: 'peat_monster_panic',
    name: 'Peat Monster Panic',
    description: 'A sudden obsession with heavily peated Scotch has driven up prices for smoky drams.',
    flavorText: 'The smoke is rising! Peated whiskies are seeing a massive surge in popularity.',
    minDuration: 3,
    maxDuration: 6,
    calculateMultiplier: (bottle) => bottle.modifiers.includes('Peated') ? 1.4 : 1.0,
  },
  {
    id: 'sherry_bomb_surge',
    name: 'Sherry Bomb Surge',
    description: 'Sherry cask finished whiskeys are flying off the shelves.',
    flavorText: 'Fruity, sherry-finished bottles are the current market darlings. Stock up if you can!',
    minDuration: 4,
    maxDuration: 6,
    calculateMultiplier: (bottle) => bottle.modifiers.includes('Sherry Cask Finish') ? 1.35 : 1.0,
  },
  {
    id: 'market_slump',
    name: 'Market Slump',
    description: 'The whiskey bubble has temporarily popped. Buyers are hesitant and prices are down across the board.',
    flavorText: 'The market is cooling off. It\'s a buyer\'s market, but selling might be difficult right now.',
    minDuration: 3,
    maxDuration: 5,
    calculateMultiplier: (bottle) => 0.85,
  },
  {
    id: 'holiday_rush',
    name: 'Holiday Rush',
    description: 'It\'s gifting season! People are buying everything, driving prices up slightly across the board.',
    flavorText: 'The holiday rush is here! Demand is up for everything as people look for the perfect gift.',
    minDuration: 3,
    maxDuration: 5,
    calculateMultiplier: (bottle) => 1.15,
  }
];
