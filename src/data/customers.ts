import { CustomerPersonality } from '../types';

export const CUSTOMER_NAMES = [
  'Arthur', 'Beatrice', 'Charles', 'Dorothy', 'Edward', 'Florence', 'George', 'Helen', 'Isaac', 'Julia', 
  'Kevin', 'Linda', 'Michael', 'Nora', 'Oscar', 'Patricia', 'Quincy', 'Rachel', 'Samuel', 'Theresa'
];

export const CUSTOMER_PERSONALITY_WEIGHTS = (shopLevel: number, reputation: number): Record<CustomerPersonality, number> => ({
  [CustomerPersonality.NOVICE]: Math.max(5, 40 - (shopLevel * 5) - (reputation / 4)),
  [CustomerPersonality.DESPERATE]: Math.max(5, 30 - (shopLevel * 4)),
  [CustomerPersonality.BARGAIN_HUNTER]: Math.max(2, 25 - (reputation / 6)),
  [CustomerPersonality.EASYGOING]: 20,
  [CustomerPersonality.SKEPTIC]: 10 + (shopLevel * 2),
  [CustomerPersonality.GREEDY]: 5 + (shopLevel * 4),
  [CustomerPersonality.EXPERT]: 2 + (shopLevel * 6) + (reputation / 8),
  [CustomerPersonality.COLLECTOR]: 1 + (shopLevel * 5) + (reputation / 5),
});
