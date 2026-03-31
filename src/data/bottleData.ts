import { Rarity, Region, DistilleryCategory, WhiskeyType } from '../types';

export const RARITY_MULTIPLIERS: Record<Rarity, number> = {
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 1.5,
  [Rarity.RARE]: 3,
  [Rarity.EPIC]: 8,
  [Rarity.LEGENDARY]: 20,
  [Rarity.UNICORN]: 50,
};

export const RARITY_PRESTIGE_FACTORS: Record<Rarity, number> = {
  [Rarity.COMMON]: 0.1,
  [Rarity.UNCOMMON]: 0.2,
  [Rarity.RARE]: 0.4,
  [Rarity.EPIC]: 0.6,
  [Rarity.LEGENDARY]: 0.8,
  [Rarity.UNICORN]: 1.0,
};

export const RARITY_ORDER = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.UNICORN];

export const AGE_RANGES: Record<WhiskeyType, { min: number, max: number }> = {
  [WhiskeyType.SINGLE_MALT_SCOTCH]: { min: 3, max: 50 },
  [WhiskeyType.IRISH_WHISKEY]: { min: 3, max: 30 },
  [WhiskeyType.JAPANESE_WHISKY]: { min: 3, max: 40 },
  [WhiskeyType.CANADIAN_WHISKY]: { min: 3, max: 25 },
  [WhiskeyType.BOURBON]: { min: 2, max: 23 },
  [WhiskeyType.RYE]: { min: 2, max: 23 },
};

export const PROOF_RANGES: Record<WhiskeyType, { min: number, max: number }> = {
  [WhiskeyType.SINGLE_MALT_SCOTCH]: { min: 80, max: 130 },
  [WhiskeyType.IRISH_WHISKEY]: { min: 80, max: 120 },
  [WhiskeyType.JAPANESE_WHISKY]: { min: 80, max: 125 },
  [WhiskeyType.CANADIAN_WHISKY]: { min: 80, max: 110 },
  [WhiskeyType.BOURBON]: { min: 80, max: 140 },
  [WhiskeyType.RYE]: { min: 80, max: 140 },
};
