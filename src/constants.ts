import { ShopTier, Rarity, WhiskeyType, ToolkitItem } from './types';

export const SHOP_TIERS: ShopTier[] = [
  {
    level: 1,
    name: "The Pop-up Stall",
    description: "A modest market stall. It's not much, but you're starting to get noticed by the local enthusiasts.",
    inventoryLimit: 5,
    minCustomers: 2,
    maxCustomers: 5,
    upgradeCost: 0,
    minReputationToUpgrade: 60,
    baseReputation: 0,
    rent: 150,
    imageSeed: "market",
    rarityWeights: {
      [Rarity.COMMON]: 85,
      [Rarity.UNCOMMON]: 14,
      [Rarity.RARE]: 1,
      [Rarity.EPIC]: 0,
      [Rarity.LEGENDARY]: 0,
      [Rarity.UNICORN]: 0,
    }
  },
  {
    level: 2,
    name: "The Back Alley",
    description: "A small, run-down spot with barely enough room for a single window. You're moving up to a proper (if hidden) location.",
    inventoryLimit: 12,
    minCustomers: 5,
    maxCustomers: 8,
    upgradeCost: 1500,
    minReputationToUpgrade: 70,
    baseReputation: 20,
    rent: 500,
    imageSeed: "alley",
    rarityWeights: {
      [Rarity.COMMON]: 65,
      [Rarity.UNCOMMON]: 30,
      [Rarity.RARE]: 5,
      [Rarity.EPIC]: 0,
      [Rarity.LEGENDARY]: 0,
      [Rarity.UNICORN]: 0,
    }
  },
  {
    level: 3,
    name: "The Corner Store",
    description: "A proper storefront in a decent part of town. You have shelves now, and a sign that doesn't fall down in the wind.",
    inventoryLimit: 25,
    minCustomers: 8,
    maxCustomers: 12,
    upgradeCost: 5000,
    minReputationToUpgrade: 80,
    baseReputation: 30,
    rent: 1500,
    imageSeed: "store",
    rarityWeights: {
      [Rarity.COMMON]: 45,
      [Rarity.UNCOMMON]: 35,
      [Rarity.RARE]: 15,
      [Rarity.EPIC]: 4,
      [Rarity.LEGENDARY]: 1,
      [Rarity.UNICORN]: 0,
    }
  },
  {
    level: 4,
    name: "The Boutique",
    description: "A stylish shop with curated displays. High-end collectors are starting to whisper your name.",
    inventoryLimit: 50,
    minCustomers: 12,
    maxCustomers: 18,
    upgradeCost: 15000,
    minReputationToUpgrade: 85,
    baseReputation: 40,
    rent: 4000,
    imageSeed: "boutique",
    rarityWeights: {
      [Rarity.COMMON]: 25,
      [Rarity.UNCOMMON]: 35,
      [Rarity.RARE]: 25,
      [Rarity.EPIC]: 10,
      [Rarity.LEGENDARY]: 4,
      [Rarity.UNICORN]: 1,
    }
  },
  {
    level: 5,
    name: "The Emporium",
    description: "A massive high-end store. You're a major player in the spirits world now, dealing in history and liquid gold.",
    inventoryLimit: 100,
    minCustomers: 18,
    maxCustomers: 25,
    upgradeCost: 50000,
    minReputationToUpgrade: 90,
    baseReputation: 50,
    rent: 10000,
    imageSeed: "emporium",
    rarityWeights: {
      [Rarity.COMMON]: 10,
      [Rarity.UNCOMMON]: 25,
      [Rarity.RARE]: 35,
      [Rarity.EPIC]: 20,
      [Rarity.LEGENDARY]: 8,
      [Rarity.UNICORN]: 2,
    }
  },
  {
    level: 6,
    name: "The Grand Vault",
    description: "A luxury boutique set in a reconditioned old distillery. The most exclusive bottles in the world find their way here.",
    inventoryLimit: 200,
    minCustomers: 25,
    maxCustomers: 35,
    upgradeCost: 150000,
    minReputationToUpgrade: 100,
    baseReputation: 60,
    rent: 25000,
    imageSeed: "distillery",
    rarityWeights: {
      [Rarity.COMMON]: 0,
      [Rarity.UNCOMMON]: 15,
      [Rarity.RARE]: 35,
      [Rarity.EPIC]: 30,
      [Rarity.LEGENDARY]: 15,
      [Rarity.UNICORN]: 5,
    }
  }
];

export const TOOLKIT_ITEMS: ToolkitItem[] = [
  {
    id: 'archives',
    name: "Distillery Archives Subscription",
    description: "Access to historical records. +30% chance to discover the Year of any bottle.",
    cost: 800,
    bonusType: 'attribute',
    target: 'year',
    value: 30
  },
  {
    id: 'hydrometer',
    name: "Precision Hydrometer",
    description: "A professional-grade tool for measuring alcohol content. +40% chance to discover Proof.",
    cost: 500,
    bonusType: 'attribute',
    target: 'proof',
    value: 40
  },
  {
    id: 'blacklight',
    name: "UV Inspection Kit",
    description: "Helps identify authentic labels and seals. +25% chance to discover Rarity.",
    cost: 1200,
    bonusType: 'attribute',
    target: 'rarity',
    value: 25
  },
  {
    id: 'bourbon_guide',
    name: "The Bourbon Bible",
    description: "Comprehensive guide to American whiskey. +20% chance to discover all fields on Bourbons.",
    cost: 1000,
    bonusType: 'type',
    target: WhiskeyType.BOURBON,
    value: 20
  },
  {
    id: 'scotch_guide',
    name: "Malt Master's Handbook",
    description: "Deep dive into Scottish single malts. +20% chance to discover all fields on Scotch.",
    cost: 1500,
    bonusType: 'type',
    target: WhiskeyType.SINGLE_MALT_SCOTCH,
    value: 20
  },
  {
    id: 'magnifier',
    name: "Jeweler's Loupe",
    description: "See the fine details on labels. +10% flat bonus to all inspection checks.",
    cost: 2000,
    bonusType: 'flat',
    value: 10
  }
];
