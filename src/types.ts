/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DistilleryCategory {
  LEGACY = 'Legacy',
  ESTABLISHED = 'Established',
  YOUNG = 'Young',
  DEFUNCT = 'Defunct',
}

export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  UNICORN = 'Unicorn',
}

export enum WhiskeyType {
  BOURBON = 'Bourbon',
  RYE = 'Rye',
  SINGLE_MALT_SCOTCH = 'Single Malt',
  IRISH_WHISKEY = 'Irish',
  JAPANESE_WHISKY = 'Japanese',
  CANADIAN_WHISKY = 'Canadian',
}

export enum Region {
  USA = 'USA',
  CANADA = 'Canada',
  IRELAND = 'Ireland',
  JAPAN = 'Japan',
  SCOTLAND = 'Scotland',
}

export enum ReleaseType {
  CORE = 'Core',
  LIMITED = 'Limited',
  SPECIAL = 'Special',
}

export interface ProductLine {
  id: string;
  brandId: string;
  name: string;
  type: WhiskeyType;
  baseProof: number;
  baseAge: number;
  modifiers: string[];
  rarity: Rarity;
  releaseType: ReleaseType;
  startYear: number;
  endYear?: number;
  description: string;
}

export interface ParentDistillery {
  id: string;
  name: string;
  category: DistilleryCategory;
  foundedYear: number;
  closedYear?: number;
  region: Region;
  prestige: number; // 1 to 5
}

export interface Brand {
  id: string;
  parentDistilleryId: string;
  name: string;
  startYear: number;
  endYear?: number;
  bottleShape: string;
  labelColor: string;
  capColor: string;
  labelFont: string;
  capType: string;
  region: Region;
  prestige: number; // 1 to 5
}

export interface Bottle {
  id: string;
  brandId: string;
  productLineId: string;
  year: number;
  type: WhiskeyType;
  proof: number;
  age: number;
  region: Region;
  rarity: Rarity;
  rarityDiscovered: boolean;
  modifiers: string[];
  name: string;
  value: number;
  purchasePrice?: number;
  discoveredFields: string[];
}

export enum CustomerPersonality {
  GREEDY = 'Greedy',
  DESPERATE = 'Desperate',
  EXPERT = 'Expert',
  EASYGOING = 'Easygoing',
  COLLECTOR = 'Collector',
  NOVICE = 'Novice',
  SKEPTIC = 'Skeptic',
  BARGAIN_HUNTER = 'Bargain Hunter',
}

export enum NegotiationPhase {
  CONVERSATION = 'Conversation',
  DEAL = 'Deal',
}

export interface DialogueOption {
  id: string;
  label: string;
  type: 'greeting' | 'smalltalk' | 'business' | 'skill';
}

export interface Message {
  id: string;
  sender: 'player' | 'customer' | 'system';
  text: string;
  timestamp: number;
  color?: 'green' | 'red' | 'default';
}

export interface Customer {
  id: string;
  name: string;
  personality: CustomerPersonality;
  patience: number; // 0 to 100
  knowledge: number; // 0 to 100
  aggressiveness: number; // 0 to 100 (how much they push back on offers)
  trust: number; // 0 to 100 (how much they believe the player's claims)
  specificInterest: WhiskeyType | null; // Preference for a type
  baseOfferMultiplier: number;
  sociability: number; // 0 to 100 (how much they enjoy small talk)
}

export interface ShopTier {
  level: number;
  name: string;
  description: string;
  inventoryLimit: number;
  minCustomers: number;
  maxCustomers: number;
  upgradeCost: number;
  minReputationToUpgrade: number;
  baseReputation: number;
  rent: number;
  imageSeed: string;
  rarityWeights: Record<Rarity, number>;
}

export interface TransactionRecord {
  id: string;
  bottleId: string;
  brandId: string;
  brandName: string;
  year: number;
  modifiers: string[];
  rarity: Rarity;
  type: WhiskeyType;
  buyPrice?: number;
  sellPrice?: number;
  wasYearKnown: boolean;
  wasAuction?: boolean;
  timestamp: number;
}

export interface ToolkitItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  bonusType: 'flat' | 'type' | 'attribute';
  target?: WhiskeyType | string; // e.g., 'rarity', 'age', 'year', 'proof'
  value: number; // Percentage bonus (e.g., 20 for +20%)
}

export interface Tactic {
  id: string;
  name: string;
  description: string;
  minSkill: number;
  category: 'soft' | 'hard';
  playerDialogue: (skillLevel: number, isPlayerBuying: boolean) => string;
}

export interface SkillInfo {
  level: number;
  xp: number;
}

export interface DistilleryCodexEntry {
  id: string;
  minKnownYear?: number;
  maxKnownYear?: number;
  foundedYearKnown: boolean;
  statusKnown: boolean;
  categoryKnown: boolean;
  regionKnown: boolean;
}

export interface BrandKnowledge {
  minKnownYear?: number;
  maxKnownYear?: number;
}

export interface ProductLineKnowledge {
  minKnownYear?: number;
  maxKnownYear?: number;
  baseProofKnown: boolean;
  baseAgeKnown: boolean;
  modifiersKnown: string[];
}

export interface CodexState {
  discoveredDistilleries: Record<string, DistilleryCodexEntry>;
  discoveredBrands: Record<string, BrandKnowledge>; // Map of brand IDs to known info
  discoveredProductLines: Record<string, ProductLineKnowledge>; // Map of product line IDs to known info
}

export interface AuctionBidEvent {
  time: number; // ms from start
  amount: number;
}

export interface AuctionState {
  currentBottleIndex: number;
  bidders: number;
  finalBid: number;
  currentBid: number;
  startTime: number;
  duration: number;
  isFinished: boolean;
  isComplete?: boolean;
  bidEvents: AuctionBidEvent[];
}

export interface DailyStats {
  profit: number;
  bottlesPurchased: number;
  bottlesSold: number;
  bestDealProfit: number;
}

export interface GameState {
  shopName: string;
  money: number;
  day: number;
  inventory: Bottle[];
  reputation: number;
  negativeReputationDays: number;
  isShopOpen: boolean;
  shopLevel: number;
  rentOwed: number;
  lastRentPaidDay: number;
  isGameOver?: boolean;
  gameOverReason?: 'bankruptcy' | 'reputation';
  customersServedToday: number;
  dailyCustomerLimit: number;
  isAuctionDay: boolean;
  auctionBottleIds: string[];
  skills: Record<string, SkillInfo>; // Level + XP
  toolkit: string[]; // IDs of owned toolkit items
  knownCustomerNames: string[];
  transactionHistory: TransactionRecord[];
  distilleries: ParentDistillery[];
  brands: Brand[];
  productLines: ProductLine[];
  codex: CodexState;
  auctionState?: AuctionState;
  dailyStats: DailyStats;
  tutorialProgress?: {
    welcomeSeen?: boolean;
    shopOverviewSeen?: boolean;
    firstCustomerSeen?: boolean;
    firstDealSeen?: boolean;
  };
}

export interface SaveSlot {
  id: number;
  gameState: GameState | null;
  lastSaved: number | null;
}

export interface Settings {
  musicVolume: number;
  soundVolume: number;
}

export interface NegotiationState {
  customer: Customer;
  bottle: Bottle;
  currentOffer: number;
  customerPrice: number;
  targetPrice: number;
  minPrice: number;
  maxPrice: number;
  turn: number;
  walkAwayChance: number; // 0 to 100% chance they walk away next turn
  isPlayerBuying: boolean;
  phase: NegotiationPhase;
  messages: Message[];
  revealedFields?: string[]; // Fields that the player has discovered
  usedDialogueIds: string[]; // Track which dialogue options have been used
  usedTacticIds: string[]; // Track which tactics have been used
  isFinished?: boolean;
  hasInspected?: boolean;
}
