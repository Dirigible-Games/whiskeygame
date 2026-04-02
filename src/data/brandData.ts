import { Region, DistilleryCategory, WhiskeyType } from '../types';

export const BOTTLE_SHAPES = ['flask', 'round', 'square', 'tall', 'decanter', 'jug', 'bell'];
export const LABEL_FONTS = ['modern', 'classic', 'vintage', 'technical', 'bold'];
export const CAP_TYPES = ['screw', 'cork', 'wax', 'glass'];

export const MODIFIERS = {
  USA: ['Wheated', 'Bottled-in-Bond', 'Single Barrel', 'Small Batch', 'Cask Strength'],
  SCOTCH: ['Peated', 'Sherry Matured', 'Port Finish', 'Cask Strength'],
  IRISH: ['3x Distilled', 'Pot Still', 'Small Batch'],
  JAPANESE: ['Mizunara Cask', 'Double Matured', 'Small Batch'],
  CANADIAN: ['Blended', 'Small Batch', 'Limited Edition'],
  GENERAL_FINISHES: ['Double Oaked', 'Cognac Finish', 'Sherry Finish', 'Rum Finish', 'Stout Finish', 'IPA Finish', 'Merlot Finish']
};
