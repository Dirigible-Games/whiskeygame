/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  DistilleryCategory, 
  WhiskeyType, 
  Region, 
  Rarity, 
  ParentDistillery, 
  Brand, 
  Bottle, 
  ProductLine,
  ReleaseType,
  CustomerPersonality,
  Customer,
  NegotiationState,
  NegotiationPhase,
  Message,
  ToolkitItem,
  DialogueOption
} from './types';
import { MIDDLE_INITIALS, REGIONAL_NAMES, REGION_TYPE_MAP } from './data/names';

import { CUSTOMER_NAMES, CUSTOMER_PERSONALITY_WEIGHTS } from './data/customers';
import { DIALOGUE_RESPONSES, TACTIC_RESPONSES } from './data/dialogue';
import { DIALOGUE_OPTIONS } from './data/dialogueOptions';
import { DEAL_TEXTS, WALK_AWAY_TEXTS, COUNTER_TEXTS_FAR, COUNTER_TEXTS_CLOSE } from './data/negotiationTexts';
import { RARITY_MULTIPLIERS, RARITY_PRESTIGE_FACTORS, RARITY_ORDER, AGE_RANGES, PROOF_RANGES } from './data/bottleData';
import { BOTTLE_SHAPES, LABEL_FONTS, CAP_TYPES, MODIFIERS } from './data/brandData';
import { NEGOTIATION_TACTICS } from './data/tactics';

export const CURRENT_YEAR = 2026;

export function getAgeDisplay(bottle: { age: number, region: Region, modifiers: string[] }): string {
  if (bottle.region === Region.USA) {
    if (bottle.age <= 4 && !bottle.modifiers.includes('Bottled-in-Bond')) {
      return 'Unstated';
    }
  } else if ([Region.SCOTLAND, Region.IRELAND, Region.JAPAN].includes(bottle.region)) {
    if (bottle.age < 10) {
      return 'Unstated';
    }
  }
  return `${bottle.age} Year`;
}

export class WhiskeyEngine {
  private distilleries: ParentDistillery[] = [];
  private brands: Brand[] = [];
  private productLines: ProductLine[] = [];
  private bottleStatsCache: Record<string, Partial<Bottle>> = {};

  constructor() {
    this.generateWorld();
  }

  public regenerateWorld() {
    this.distilleries = [];
    this.brands = [];
    this.productLines = [];
    this.bottleStatsCache = {};
    this.generateWorld();
  }

  public getWorld() {
    return {
      distilleries: this.distilleries,
      brands: this.brands,
      productLines: this.productLines
    };
  }

  public setWorld(distilleries: ParentDistillery[], brands: Brand[], productLines: ProductLine[]) {
    this.distilleries = distilleries;
    this.brands = brands;
    this.productLines = productLines || [];
    this.bottleStatsCache = {};
  }

  private generateDistilleryName(region: Region): string {
    const components = REGIONAL_NAMES[region];
    const rand = Math.random();
    
    if (rand < 0.4) {
      return `${components.places[Math.floor(Math.random() * components.places.length)]} Distillery`;
    } else if (rand < 0.8) {
      return `${components.lastNames[Math.floor(Math.random() * components.lastNames.length)]} Distillery`;
    } else {
      const prefix = components.prefixes[Math.floor(Math.random() * components.prefixes.length)];
      const suffix = components.suffixes[Math.floor(Math.random() * components.suffixes.length)];
      if (region === Region.SCOTLAND && (prefix === 'Glen' || prefix === 'Mac' || prefix === 'Strath' || prefix === 'Aber' || prefix === 'Inver')) {
        return `${prefix}${suffix.toLowerCase()} Distillery`;
      }
      return `${prefix} ${suffix} Distillery`;
    }
  }

  private generateBrandName(region: Region): string {
    const components = REGIONAL_NAMES[region];
    const rand = Math.random();

    // Pattern 1: First Name + [Middle Initial] + Last Name (e.g. "John Q. Public", "J. Public", "John Public")
    if (rand < 0.3) {
      const firstName = components.firstNames[Math.floor(Math.random() * components.firstNames.length)];
      const lastName = components.lastNames[Math.floor(Math.random() * components.lastNames.length)];
      
      if ((region === Region.USA || region === Region.CANADA) && Math.random() < 0.3) {
        const middleInitial = MIDDLE_INITIALS[Math.floor(Math.random() * MIDDLE_INITIALS.length)];
        return `${firstName} ${middleInitial} ${lastName}`;
      }
      return `${firstName} ${lastName}`;
    }
    
    // Pattern 2: Place + Suffix (e.g. "Kentucky Springs", "Speyside Reserve")
    if (rand < 0.55) {
      const place = components.places[Math.floor(Math.random() * components.places.length)];
      const suffix = components.suffixes[Math.floor(Math.random() * components.suffixes.length)];
      return `${place} ${suffix}`;
    }
    
    // Pattern 3: Prefix + Place (e.g. "Old Bardstown", "Glen Rothes")
    if (rand < 0.75) {
      const prefix = components.prefixes[Math.floor(Math.random() * components.prefixes.length)];
      const place = components.places[Math.floor(Math.random() * components.places.length)];
      // Avoid double spaces if prefix is meant to be joined (like Glen/Mac in Scotland)
      if (region === Region.SCOTLAND && (prefix === 'Glen' || prefix === 'Mac' || prefix === 'Strath' || prefix === 'Aber' || prefix === 'Inver')) {
        return `${prefix}${place.toLowerCase()}`;
      }
      return `${prefix} ${place}`;
    }
    
    // Pattern 4: Prefix + Suffix (e.g. "Eagle Cask", "Royal Reserve")
    const prefix = components.prefixes[Math.floor(Math.random() * components.prefixes.length)];
    const suffix = components.suffixes[Math.floor(Math.random() * components.suffixes.length)];
    if (region === Region.SCOTLAND && (prefix === 'Glen' || prefix === 'Mac' || prefix === 'Strath' || prefix === 'Aber' || prefix === 'Inver')) {
      return `${prefix}${suffix.toLowerCase()}`;
    }
    return `${prefix} ${suffix}`;
  }

  private generateWorld() {
    const regions = [Region.USA, Region.USA, Region.USA, Region.SCOTLAND, Region.IRELAND, Region.CANADA, Region.JAPAN];
    
    for (let i = 0; i < 20; i++) {
      const region = regions[i % regions.length];
      const distillery = this.generateDistillery(region);
      this.distilleries.push(distillery);
      
      let brandCount = 1;
      let useDistilleryName = false;

      if (region === Region.USA) {
        if (distillery.category === DistilleryCategory.LEGACY || distillery.category === DistilleryCategory.DEFUNCT) {
          brandCount = Math.floor(Math.random() * 5) + 2; // 2-6
        } else if (distillery.category === DistilleryCategory.ESTABLISHED) {
          brandCount = Math.floor(Math.random() * 3) + 1; // 1-3
        } else {
          // YOUNG
          brandCount = 1;
          useDistilleryName = true;
        }
      } else if (region === Region.SCOTLAND || region === Region.IRELAND) {
        if (distillery.category === DistilleryCategory.LEGACY) {
          brandCount = Math.floor(Math.random() * 3) + 1; // 1-3
        } else if (distillery.category === DistilleryCategory.ESTABLISHED || distillery.category === DistilleryCategory.DEFUNCT) {
          brandCount = Math.floor(Math.random() * 2) + 1; // 1-2
        } else {
          // YOUNG
          brandCount = 1;
          useDistilleryName = true;
        }
      } else if (region === Region.JAPAN) {
        if (distillery.category === DistilleryCategory.LEGACY) {
          brandCount = Math.floor(Math.random() * 2) + 1; // 1-2
        } else if (distillery.category === DistilleryCategory.ESTABLISHED) {
          brandCount = Math.floor(Math.random() * 4) + 1; // 1-4
        } else {
          // YOUNG or DEFUNCT
          brandCount = 1;
          useDistilleryName = true;
        }
      } else {
        // Canada or others
        brandCount = Math.floor(Math.random() * 2) + 1;
      }

      let hasActiveBrand = false;
      
      for (let j = 0; j < brandCount; j++) {
        const isLastBrand = j === brandCount - 1;
        const forceActive = !distillery.closedYear && isLastBrand && !hasActiveBrand;
        
        let brandName: string | undefined;
        if (useDistilleryName && j === 0) {
          brandName = distillery.name.replace(" Distillery", "");
        }

        const brand = this.generateBrand(distillery, forceActive, brandName);
        if (!brand.endYear) {
          hasActiveBrand = true;
        }
        
        this.brands.push(brand);
        this.generateProductLinesForBrand(brand, distillery);
      }
    }
  }

  private createProductLine(
    brand: Brand, 
    name: string, 
    type: WhiskeyType, 
    proof: number, 
    age: number, 
    modifiers: string[], 
    rarity: Rarity, 
    releaseType: ReleaseType,
    startYearOffset: number = 0,
    endYearOffset?: number
  ): ProductLine {
    return {
      id: Math.random().toString(36).substr(2, 9),
      brandId: brand.id,
      name,
      type,
      baseProof: proof,
      baseAge: age,
      modifiers,
      rarity,
      releaseType,
      startYear: Math.min(CURRENT_YEAR, brand.startYear + startYearOffset),
      endYear: endYearOffset ? Math.min(CURRENT_YEAR, brand.startYear + endYearOffset) : brand.endYear,
      description: `${name} from ${brand.name}`
    };
  }

  private generateProductLinesForBrand(brand: Brand, distillery: ParentDistillery) {
    const region = brand.region;
    const category = distillery.category;
    const possibleTypes = REGION_TYPE_MAP[region];
    const type = possibleTypes[0];

    if (region === Region.SCOTLAND || region === Region.IRELAND || region === Region.JAPAN) {
      // Irish, scotch, and Japanese really only just do one product, just at distinct different age statements
      const ageStatements = [10, 12, 15, 18, 21, 25, 30];
      const count = category === DistilleryCategory.LEGACY ? 5 : category === DistilleryCategory.ESTABLISHED ? 3 : 1;
      
      for (let i = 0; i < count; i++) {
        const age = ageStatements[i];
        this.productLines.push(this.createProductLine(
          brand, 
          `${age} Year`, 
          type, 
          80 + (i * 1.2), 
          age, 
          [], 
          i < 2 ? Rarity.COMMON : i < 4 ? Rarity.UNCOMMON : Rarity.RARE, 
          ReleaseType.CORE
        ));
      }
      
      if (Math.random() < 0.4) {
        const age = ageStatements[Math.floor(Math.random() * count)];
        this.productLines.push(this.createProductLine(
          brand, 
          `${age} Year Cask Strength`, 
          type, 
          114 + Math.floor(Math.random() * 10), 
          age, 
          ['Cask Strength'], 
          Rarity.RARE, 
          ReleaseType.LIMITED,
          Math.floor(Math.random() * 20)
        ));
      }
    } else if (region === Region.CANADA) {
      // Canadian ones typically have their standard offering, and a premium offering of the same thing.
      this.productLines.push(this.createProductLine(brand, "Standard", type, 80, 3, [], Rarity.COMMON, ReleaseType.CORE));
      this.productLines.push(this.createProductLine(brand, "Premium Reserve", type, 90, 8, ['Small Batch'], Rarity.UNCOMMON, ReleaseType.CORE, 5));
    } else if (region === Region.USA) {
      if (category === DistilleryCategory.LEGACY) {
        // 3-4 core products, 4-8 modified versions, a few special releases
        const coreNames = ['Standard', 'Small Batch', 'Single Barrel', 'Reserve'];
        const coreCount = 3 + Math.floor(Math.random() * 2);
        for (let i = 0; i < coreCount; i++) {
          const name = coreNames[i % coreNames.length];
          const age = 4 + (i * 2);
          const proof = 90 + (i * 5);
          const mods = i === 1 ? ['Small Batch'] : i === 2 ? ['SiB'] : [];
          this.productLines.push(this.createProductLine(brand, name, type, proof, age, mods, i < 2 ? Rarity.COMMON : Rarity.UNCOMMON, ReleaseType.CORE));
        }

        const modCount = 4 + Math.floor(Math.random() * 5);
        const finishes = ['Sherry Finish', 'Port Finish', 'Cognac Finish', 'Rum Finish', 'Double Oaked'];
        for (let i = 0; i < modCount; i++) {
          const finish = finishes[Math.floor(Math.random() * finishes.length)];
          const startOffset = Math.floor(Math.random() * 50);
          const duration = 5 + Math.floor(Math.random() * 15);
          this.productLines.push(this.createProductLine(
            brand, 
            finish, 
            type, 
            90 + Math.floor(Math.random() * 20), 
            6 + Math.floor(Math.random() * 6), 
            [finish], 
            Rarity.RARE, 
            ReleaseType.LIMITED, 
            startOffset, 
            startOffset + duration
          ));
        }

        const specialCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < specialCount; i++) {
          this.productLines.push(this.createProductLine(
            brand, 
            "Special Release", 
            type, 
            120 + Math.floor(Math.random() * 15), 
            12 + Math.floor(Math.random() * 10), 
            ['Special Release', 'Cask Strength'], 
            Rarity.EPIC, 
            ReleaseType.SPECIAL, 
            Math.floor(Math.random() * 60),
            undefined
          ));
        }
      } else if (category === DistilleryCategory.ESTABLISHED) {
        const coreCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < coreCount; i++) {
          const age = 4 + (i * 2);
          this.productLines.push(this.createProductLine(brand, i === 0 ? "Select" : "Reserve", type, 90 + (i * 4), age, [], i === 0 ? Rarity.COMMON : Rarity.UNCOMMON, ReleaseType.CORE));
        }
        if (Math.random() < 0.6) {
          this.productLines.push(this.createProductLine(brand, "Barrel Proof", type, 115 + Math.floor(Math.random() * 10), 6, ['Cask Strength'], Rarity.RARE, ReleaseType.LIMITED, 10));
        }
      } else {
        // Young craft: 1-2 core releases, maybe 1 modified version
        this.productLines.push(this.createProductLine(brand, "Craft Batch", type, 92, 2, [], Rarity.COMMON, ReleaseType.CORE));
        if (Math.random() < 0.5) {
          this.productLines.push(this.createProductLine(brand, "Single Cask", type, 118, 3, ['SiB', 'Cask Strength'], Rarity.UNCOMMON, ReleaseType.CORE, 2));
        }
      }
    }
  }

  private generateDistillery(region: Region): ParentDistillery {
    // Bias towards active distilleries
    const rand = Math.random();
    let category: DistilleryCategory;
    if (rand < 0.1) category = DistilleryCategory.DEFUNCT;
    else if (rand < 0.3) category = DistilleryCategory.YOUNG;
    else if (rand < 0.7) category = DistilleryCategory.ESTABLISHED;
    else category = DistilleryCategory.LEGACY;

    const foundedYear = category === DistilleryCategory.YOUNG 
      ? Math.floor(Math.random() * (CURRENT_YEAR - 2010)) + 2010
      : Math.floor(Math.random() * (CURRENT_YEAR - 1850)) + 1850;
    
    let closedYear: number | undefined;

    if (category === DistilleryCategory.DEFUNCT) {
      closedYear = Math.floor(Math.random() * (CURRENT_YEAR - foundedYear)) + foundedYear;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: this.generateDistilleryName(region),
      category,
      foundedYear,
      closedYear,
      region,
      prestige: Math.floor(Math.random() * 5) + 1,
    };
  }

  private generateBrand(distillery: ParentDistillery, forceActive: boolean = false, name?: string): Brand {
    const startYear = Math.floor(Math.random() * ((distillery.closedYear || CURRENT_YEAR) - distillery.foundedYear)) + distillery.foundedYear;
    // Most brands are still active if the distillery is active
    const endYear = distillery.closedYear 
      ? Math.floor(Math.random() * (distillery.closedYear - startYear)) + startYear 
      : ((!forceActive && Math.random() > 0.9) ? startYear + Math.floor(Math.random() * (CURRENT_YEAR - startYear)) : undefined);

    const brandName = name || this.generateBrandName(distillery.region);

    return {
      id: Math.random().toString(36).substr(2, 9),
      parentDistilleryId: distillery.id,
      name: brandName,
      startYear,
      endYear,
      bottleShape: BOTTLE_SHAPES[Math.floor(Math.random() * BOTTLE_SHAPES.length)],
      labelColor: `hsl(${Math.random() * 360}, 30%, 40%)`,
      capColor: `hsl(${Math.random() * 360}, 20%, 20%)`,
      labelFont: LABEL_FONTS[Math.floor(Math.random() * LABEL_FONTS.length)],
      capType: CAP_TYPES[Math.floor(Math.random() * CAP_TYPES.length)],
      region: distillery.region,
      prestige: Math.floor(Math.random() * 5) + 1,
    };
  }

  public getBrand(brandId: string): Brand | undefined {
    return this.brands.find(b => b.id === brandId);
  }

  public generateRandomBottle(rarityWeights?: Record<Rarity, number>, shopLevel: number = 1): Bottle {
    const productLine = this.productLines[Math.floor(Math.random() * this.productLines.length)];
    const brand = this.brands.find(b => b.id === productLine.brandId)!;
    const distillery = this.distilleries.find(d => d.id === brand.parentDistilleryId)!;
    const type = productLine.type;
    
    let proof = productLine.baseProof;
    let age = productLine.baseAge;
    const modifiers = [...productLine.modifiers];

    // Add some variance for certain types
    if (modifiers.includes('SiB') || modifiers.includes('Cask Strength') || modifiers.includes('Special Release')) {
      proof += (Math.random() * 6) - 3;
      proof = Math.round(proof * 10) / 10;
    }

    // Max vintage year is CURRENT_YEAR - age. Also bounded by productLine.endYear if it exists.
    const maxVintageYear = Math.min(productLine.endYear || CURRENT_YEAR, CURRENT_YEAR - age);
    
    // Min vintage year: Usually tied to startYear, BUT if it's sourced (startYear > maxVintageYear), 
    // we just go back a bit further from maxVintageYear.
    let minVintageYear = Math.max(productLine.startYear, CURRENT_YEAR - (shopLevel * 15) - age);
    if (minVintageYear > maxVintageYear) {
      // Sourced whiskey! The vintage is older than the product line's start year.
      minVintageYear = maxVintageYear - Math.floor(Math.random() * 5); // Distilled 0-5 years before the absolute latest possible date
    }

    // Bias towards more recent years
    const yearRand = 1 - Math.pow(Math.random(), 4);
    const year = Math.floor(yearRand * (maxVintageYear - minVintageYear + 1)) + minVintageYear;

    const rarity = this.calculateRarity(age, year, distillery.category, distillery.region, modifiers, distillery.prestige, brand.prestige, rarityWeights, shopLevel);

    const ageDisplay = getAgeDisplay({ age, region: brand.region, modifiers });
    const name = `${year} ${brand.name} ${productLine.name} ${ageDisplay !== 'Unstated' ? ageDisplay + ' ' : ''}${type}`;

    return {
      id: Math.random().toString(36).substr(2, 9),
      brandId: brand.id,
      productLineId: productLine.id,
      year,
      type: productLine.type,
      proof,
      age,
      region: brand.region,
      rarity: rarity,
      rarityDiscovered: false,
      modifiers: productLine.modifiers,
      name: `${year} ${brand.name} ${productLine.name}`,
      value: this.calculateValue(age, proof, rarity, year, productLine.type, distillery.prestige, brand.prestige, productLine.modifiers),
      purchasePrice: Math.floor(this.calculateValue(age, proof, rarity, year, productLine.type, distillery.prestige, brand.prestige, productLine.modifiers) * (0.6 + Math.random() * 0.2)),
      discoveredFields: []
    };
  }

  private getAgeRange(type: WhiskeyType) {
    return AGE_RANGES[type] || { min: 2, max: 23 };
  }

  private getProofRange(type: WhiskeyType) {
    return PROOF_RANGES[type] || { min: 80, max: 140 };
  }

  private getPossibleModifiers(type: WhiskeyType, age: number, proof: number, region: Region): string[] {
    let mods: string[] = ['Special Release', 'Quarterly Release'];

    if (type === WhiskeyType.SINGLE_MALT_SCOTCH) {
      mods.push(...MODIFIERS.SCOTCH);
      return mods;
    }

    if (type === WhiskeyType.IRISH_WHISKEY) {
      mods.push(...MODIFIERS.IRISH);
      return mods;
    }

    if (type === WhiskeyType.JAPANESE_WHISKY) {
      mods.push(...MODIFIERS.JAPANESE);
      return mods;
    }

    if (type === WhiskeyType.CANADIAN_WHISKY) {
      mods.push(...MODIFIERS.CANADIAN);
      return mods;
    }

    mods = [...mods, ...MODIFIERS.GENERAL_FINISHES];

    if (age >= 4) mods.push('SiB');
    if (proof > 110) mods.push('Full Proof');
    if (proof > 117) mods.push('Barrel Proof');
    
    if (type === WhiskeyType.BOURBON || type === WhiskeyType.RYE) {
      if (age >= 4 && proof === 100 && region === Region.USA) mods.push('Bottled-in-Bond');
    }

    return mods;
  }

  private weightedRarity(weights: Record<Rarity, number>): Rarity {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    
    for (const [rarity, weight] of Object.entries(weights)) {
      if (random < weight) return rarity as Rarity;
      random -= weight;
    }
    
    return Rarity.COMMON;
  }

  private randomRarity(): Rarity {
    const rand = Math.random();
    if (rand < 0.60) return Rarity.COMMON;
    if (rand < 0.85) return Rarity.UNCOMMON;
    if (rand < 0.95) return Rarity.RARE;
    if (rand < 0.98) return Rarity.EPIC;
    if (rand < 0.995) return Rarity.LEGENDARY;
    return Rarity.UNICORN;
  }

  private calculateRarity(
    age: number, 
    year: number, 
    category: DistilleryCategory, 
    region: Region, 
    modifiers: string[], 
    distilleryPrestige: number,
    brandPrestige: number,
    weights?: Record<Rarity, number>,
    shopLevel: number = 1
  ): Rarity {
    // Base roll
    let rarity = weights ? this.weightedRarity(weights) : this.randomRarity();
    const getRank = (r: Rarity) => RARITY_ORDER.indexOf(r);
    
    let bonusScore = 0;

    // Age Bonus
    if (region === Region.USA || region === Region.CANADA) {
      if (age >= 21) bonusScore += 4;
      else if (age >= 18) bonusScore += 3;
      else if (age >= 15) bonusScore += 2;
      else if (age >= 12) bonusScore += 1;
    } else {
      if (age >= 25) bonusScore += 4;
      else if (age >= 21) bonusScore += 3;
      else if (age >= 18) bonusScore += 2;
      else if (age >= 15) bonusScore += 1;
    }

    // Vintage Bonus
    const yearsOld = CURRENT_YEAR - year;
    if (yearsOld >= 60) bonusScore += 4;
    else if (yearsOld >= 45) bonusScore += 3;
    else if (yearsOld >= 30) bonusScore += 2;
    else if (yearsOld >= 20) bonusScore += 1;

    // Prestige Bonus
    if (distilleryPrestige >= 5) bonusScore += 1;
    if (brandPrestige >= 5) bonusScore += 1;
    else if (brandPrestige >= 4) bonusScore += 0.5;

    // Distillery status
    if (category === DistilleryCategory.DEFUNCT) {
      bonusScore += 2;
    } 

    // Modifier Bonus
    if (modifiers.includes('Special Release')) {
      bonusScore += 2;
    }
    if (modifiers.includes('Quarterly Release')) {
      bonusScore += 1.5;
    }
    if (modifiers.includes('SiB')) {
      bonusScore += 0.5;
    }
    if (modifiers.some(m => m.includes('Proof') || m.includes('Cask Strength'))) {
      bonusScore += 0.5;
    }

    // Calculate rank bump (probabilistic)
    // Every 3 points of bonusScore is a guaranteed rank bump
    // The remainder is a chance for another bump
    let rankBump = Math.floor(bonusScore / 3);
    const remainder = (bonusScore % 3) / 3;
    if (Math.random() < remainder) {
      rankBump += 1;
    }

    // Apply rank bump to base roll
    let currentRank = getRank(rarity);
    // Cap rank bump based on shop level to prevent extreme outliers in early game
    const maxRankBump = shopLevel <= 1 ? 1 : shopLevel <= 3 ? 2 : 5;
    currentRank = Math.min(RARITY_ORDER.length - 1, currentRank + Math.min(rankBump, maxRankBump));
    
    return RARITY_ORDER[currentRank];
  }

  public calculateApparentValue(bottle: Bottle, discoveredFields: string[]): number {
    const brand = this.getBrand(bottle.brandId)!;
    const distillery = this.distilleries.find(d => d.id === brand.parentDistilleryId)!;

    // Rarity is only used if discovered
    const rarity = discoveredFields.includes('rarity') ? bottle.rarity : Rarity.COMMON;
    
    // Modifiers are only used if discovered
    const revealedModifiers = bottle.modifiers.filter((m, i) => 
      discoveredFields.includes(`modifiers_${i}`) || 
      discoveredFields.includes('modifiers') || 
      discoveredFields.includes(m)
    );

    // Year, Age, Proof are also in discoveredFields
    const year = discoveredFields.includes('year') ? bottle.year : CURRENT_YEAR;
    const age = discoveredFields.includes('age') ? bottle.age : 0;
    const proof = discoveredFields.includes('proof') ? bottle.proof : 80;

    return this.calculateValue(
      age,
      proof,
      rarity,
      year,
      bottle.type,
      distillery.prestige,
      brand.prestige,
      revealedModifiers
    );
  }

  private calculateValue(
    age: number, 
    proof: number, 
    rarity: Rarity, 
    year: number, 
    type: WhiskeyType,
    distilleryPrestige: number,
    brandPrestige: number,
    modifiers: string[]
  ): number {
    let base = 40; // Lower base
    
    if (type === WhiskeyType.SINGLE_MALT_SCOTCH) {
      base += age * 15;
    } else {
      base += age * 8;
    }

    base += (proof - 80) * 1.5;
    
    let value = base * RARITY_MULTIPLIERS[rarity];

    // Prestige Impact
    const rarityFactor = RARITY_PRESTIGE_FACTORS[rarity];

    // Distillery prestige (1-5) adds up to 40% value at Unicorn rarity
    const distilleryEffect = (distilleryPrestige - 1) * 0.1 * rarityFactor;
    // Brand prestige (1-5) adds up to 80% value at Unicorn rarity
    const brandEffect = (brandPrestige - 1) * 0.2 * rarityFactor;
    
    let prestigeMultiplier = 1 + distilleryEffect + brandEffect;

    // Quarterly Release prestige boost
    if (modifiers.includes('Quarterly Release')) {
      prestigeMultiplier *= 1.5;
    }
    if (modifiers.includes('Special Release')) {
      prestigeMultiplier *= 2.0;
    }
    
    value = value * prestigeMultiplier;

    // Vintage multiplier (Dusty value)
    const yearsOld = CURRENT_YEAR - year;
    if (yearsOld > 15) {
      value *= (1 + (yearsOld - 15) * 0.03);
    }

    return Math.floor(value);
  }

  private randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }

  public generateCustomer(shopLevel: number = 1, reputation: number = 0): Customer {
    const weights = CUSTOMER_PERSONALITY_WEIGHTS(shopLevel, reputation);

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let personality = CustomerPersonality.EASYGOING;

    for (const [p, w] of Object.entries(weights)) {
      if (random < w) {
        personality = p as CustomerPersonality;
        break;
      }
      random -= w;
    }

    const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    
    let patience = 50;
    let knowledge = 50;
    let aggressiveness = 50;
    let baseOfferMultiplier = 1.0;

    switch (personality) {
      case CustomerPersonality.GREEDY:
        patience = 30;
        knowledge = 40;
        aggressiveness = 80;
        baseOfferMultiplier = 1.3; // Wants more money
        break;
      case CustomerPersonality.DESPERATE:
        patience = 80;
        knowledge = 20;
        aggressiveness = 20;
        baseOfferMultiplier = 0.7; // Will take less
        break;
      case CustomerPersonality.EXPERT:
        patience = 40;
        knowledge = 95;
        aggressiveness = 60;
        baseOfferMultiplier = 1.0; // Knows the value
        break;
      case CustomerPersonality.EASYGOING:
        patience = 70;
        knowledge = 50;
        aggressiveness = 30;
        baseOfferMultiplier = 1.0;
        break;
      case CustomerPersonality.COLLECTOR:
        patience = 90;
        knowledge = 85;
        aggressiveness = 40;
        baseOfferMultiplier = 1.1; // Willing to pay for rarity
        break;
      case CustomerPersonality.NOVICE:
        patience = 60;
        knowledge = 15;
        aggressiveness = 25;
        baseOfferMultiplier = 0.9;
        break;
      case CustomerPersonality.SKEPTIC:
        patience = 25;
        knowledge = 60;
        aggressiveness = 90;
        baseOfferMultiplier = 1.2;
        break;
      case CustomerPersonality.BARGAIN_HUNTER:
        patience = 50;
        knowledge = 70;
        aggressiveness = 75;
        baseOfferMultiplier = 0.8; // Always wants a deal
        break;
    }

    let trust = 50; // Default trust
    switch (personality) {
      case CustomerPersonality.NOVICE:
        trust = 70; // More trusting
        break;
      case CustomerPersonality.SKEPTIC:
        trust = 20; // Very skeptical
        break;
      case CustomerPersonality.EXPERT:
        trust = 40; // Harder to fool
        break;
      case CustomerPersonality.EASYGOING:
        trust = 65;
        break;
      case CustomerPersonality.BARGAIN_HUNTER:
        trust = 30;
        break;
    }

    // Random interest (30% chance, higher for collectors)
    const interestChance = personality === CustomerPersonality.COLLECTOR ? 0.6 : 0.3;
    const specificInterest = Math.random() < interestChance ? this.randomEnum(WhiskeyType) : null;

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
      personality,
      patience: Math.max(0, Math.min(100, patience + (Math.random() * 20 - 10))),
      knowledge: Math.max(0, Math.min(100, knowledge + (Math.random() * 20 - 10))),
      aggressiveness: Math.max(0, Math.min(100, aggressiveness + (Math.random() * 20 - 10))),
      trust: Math.max(0, Math.min(100, trust + (Math.random() * 20 - 10))),
      specificInterest,
      baseOfferMultiplier,
      sociability: Math.floor(Math.random() * 101), // 0 to 100
    };
  }

  public startNegotiation(
    customer: Customer, 
    bottle: Bottle, 
    isPlayerBuying: boolean,
    isKnown: boolean
  ): NegotiationState {
    const baseValue = bottle.value;
    let customerPrice: number;

    if (isPlayerBuying) {
      // Customer is selling to player - Perceived value depends on knowledge
      let perceivedValue = 50; // Absolute base
      
      // Knowledge level 0-100
      // High knowledge (80+) knows full value
      // Low knowledge ( < 30) treats it as a common bottle of that brand
      if (customer.knowledge > 80) {
        perceivedValue = baseValue;
      } else if (customer.knowledge < 30) {
        // Low knowledge: Ignore rarity multipliers and age/proof premiums
        perceivedValue = 100; // Just a "decent" bottle price
        if (bottle.rarity === Rarity.UNICORN || bottle.rarity === Rarity.LEGENDARY) {
          perceivedValue = 250; // Still feels "special" but way underpriced
        }
      } else {
        // Mid knowledge: Partial value
        const knowledgeFactor = (customer.knowledge - 30) / 50; // 0 to 1
        perceivedValue = 100 + (baseValue - 100) * knowledgeFactor;
      }

      // Interest bonus (if they are selling, they might want to get rid of it, or if they know it's good they might hold out)
      // But usually interest bonus is for when they are BUYING.
      
      customerPrice = perceivedValue * customer.baseOfferMultiplier * (1 + (Math.random() * 0.2 - 0.1));
    } else {
      // Player is selling to customer
      let perceivedValue = baseValue;
      
      // If customer has specific interest, they might pay more
      if (customer.specificInterest === bottle.type) {
        perceivedValue *= 1.25;
      }

      // If customer has low knowledge, they might not appreciate rarity
      if (customer.knowledge < 50) {
        const rarityPenalty = {
          [Rarity.COMMON]: 1,
          [Rarity.UNCOMMON]: 0.9,
          [Rarity.RARE]: 0.7,
          [Rarity.EPIC]: 0.5,
          [Rarity.LEGENDARY]: 0.3,
          [Rarity.UNICORN]: 0.1,
        };
        perceivedValue *= rarityPenalty[bottle.rarity];
      }

      customerPrice = perceivedValue * (1 / customer.baseOfferMultiplier) * (1 + (Math.random() * 0.2 - 0.1));
    }

    const initialMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'system',
      text: isKnown ? `*${customer.name} enters your shop.*` : `*A new customer enters your shop.*`,
      timestamp: Date.now()
    };

    // Initial walk away chance based on personality
    let walkAwayChance = 0;
    switch (customer.personality) {
      case CustomerPersonality.GREEDY: walkAwayChance = 15; break;
      case CustomerPersonality.EXPERT: walkAwayChance = 10; break;
      case CustomerPersonality.DESPERATE: walkAwayChance = 5; break;
      case CustomerPersonality.EASYGOING: walkAwayChance = 0; break;
    }

    // Determine initially revealed fields
    let revealedFields: string[] = ['name', 'type', 'proof', 'region']; // Basic label info always known
    if (!isPlayerBuying) {
      // Player knows what they've discovered about their own bottle
      revealedFields = bottle.discoveredFields || ['name', 'type', 'proof', 'region'];
    } else {
      // Customer is selling - what do they know?
      if (customer.knowledge > 80) {
        revealedFields = ['name', 'year', 'type', 'proof', 'age', 'region', 'rarity', 'modifiers'];
      } else if (customer.knowledge > 50) {
        revealedFields = ['name', 'type', 'region', 'age', 'proof'];
      }
      // Basic fields are already in the array
    }

    const apparentValue = isPlayerBuying ? bottle.value : this.calculateApparentValue(bottle, revealedFields);

    return {
      customer,
      bottle,
      currentOffer: isPlayerBuying ? Math.floor(customerPrice) : (bottle.purchasePrice || Math.floor(apparentValue)),
      customerPrice: isPlayerBuying ? Math.floor(customerPrice) : 0,
      targetPrice: Math.floor(customerPrice),
      minPrice: isPlayerBuying ? Math.floor(customerPrice / 7.5) : 1,
      maxPrice: isPlayerBuying ? Math.floor(customerPrice * 7.5) : 1000000,
      turn: 0,
      walkAwayChance,
      isPlayerBuying,
      phase: NegotiationPhase.CONVERSATION,
      messages: [initialMessage],
      revealedFields,
      usedDialogueIds: [],
      usedTacticIds: [],
      hasInspected: false
    };
  }

  public calculateInspectResult(bottle: Bottle, mastery: number, ownedToolkit: ToolkitItem[]): string[] {
    // Base fields always revealed (label reading)
    const revealed = ['name', 'type', 'proof', 'region'];
    
    // Fields that need skill checks (expert knowledge)
    const skillFields = ['year', 'age', 'rarity'];
    
    // Base chance is 25%
    // Mastery (0-20) adds up to 50% bonus (2.5% per level)
    const masteryBonus = mastery * 2.5;
    
    // Toolkit bonuses
    const flatBonus = ownedToolkit
      .filter(item => item.bonusType === 'flat')
      .reduce((sum, item) => sum + item.value, 0);
    
    const typeBonus = ownedToolkit
      .filter(item => item.bonusType === 'type' && item.target === bottle.type)
      .reduce((sum, item) => sum + item.value, 0);

    const getAttributeBonus = (attr: string) => {
      return ownedToolkit
        .filter(item => item.bonusType === 'attribute' && item.target === attr)
        .reduce((sum, item) => sum + item.value, 0);
    };

    const newlyRevealed = skillFields.filter(field => {
      const attrBonus = getAttributeBonus(field);
      const totalChance = Math.min(100, 25 + masteryBonus + flatBonus + typeBonus + attrBonus);
      return Math.random() * 100 < totalChance;
    });

    // Handle modifiers independently
    const modifierResults = [];
    if (bottle.modifiers) {
      bottle.modifiers.forEach((_, i) => {
        const totalChance = Math.min(100, 25 + masteryBonus + flatBonus + typeBonus);
        if (Math.random() * 100 < totalChance) {
          modifierResults.push(`modifiers_${i}`);
        }
      });
    }
    
    return Array.from(new Set([...revealed, ...newlyRevealed, ...modifierResults]));
  }

  public interpolateDialogue(text: string, customer: Customer, bottle: Bottle): string {
    const brand = this.getBrand(bottle.brandId);
    const distillery = this.getDistillery(brand?.parentDistilleryId || '');
    const productLine = this.productLines.find(pl => pl.id === bottle.productLineId);

    return text
      .replace(/{customerName}/g, customer.name)
      .replace(/{brand}/g, brand?.name || 'this brand')
      .replace(/{distillery}/g, distillery?.name || 'the distillery')
      .replace(/{region}/g, distillery?.region || 'this region')
      .replace(/{productLine}/g, productLine?.name || 'this bottle')
      .replace(/{year}/g, bottle.year.toString())
      .replace(/{age}/g, bottle.age.toString())
      .replace(/{proof}/g, bottle.proof.toString())
      .replace(/{type}/g, bottle.type);
  }

  public processActiveListening(text: string, bottle: Bottle, currentRevealed: string[]): { text: string, newlyRevealed: string[] } {
    let processedText = text;
    const newlyRevealed: string[] = [];
    const alreadyRevealed = new Set(currentRevealed);

    const highlight = (str: string) => `<span class="text-amber-400 font-bold">${str}</span>`;

    const replaceIfFound = (search: string, fieldKey: string) => {
      if (!search || search === '0') return;
      
      if (!alreadyRevealed.has(fieldKey)) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedSearch}\\b`, 'g');
        
        if (regex.test(processedText)) {
          processedText = processedText.replace(regex, highlight(search));
          newlyRevealed.push(fieldKey);
          alreadyRevealed.add(fieldKey);
        }
      }
    };

    replaceIfFound(bottle.year.toString(), 'year');
    if (bottle.age > 0) replaceIfFound(bottle.age.toString(), 'age');
    replaceIfFound(bottle.proof.toString(), 'proof');
    
    bottle.modifiers.forEach(mod => {
      replaceIfFound(mod, mod);
    });

    return { text: processedText, newlyRevealed };
  }

  public getDialogueResponse(customer: Customer, optionId: string, isPlayerBuying: boolean, bottle: Bottle): string {
    const responseTemplate = DIALOGUE_RESPONSES[optionId]?.[customer.personality] || "I'm not sure what to say to that.";
    const [buyingText, sellingText] = responseTemplate.split('|');
    const textToUse = isPlayerBuying ? buyingText : (sellingText || buyingText);
    return this.interpolateDialogue(textToUse, customer, bottle);
  }

  public static getNextLevelXP(level: number): number {
    // Next Level XP = 150 * (Level ^ 1.7)
    return Math.floor(150 * Math.pow(level || 1, 1.7));
  }

  public getTacticResponse(customer: Customer, tacticId: string, success: boolean, bottle: Bottle): string {
    const responseTemplate = TACTIC_RESPONSES[tacticId]?.[success ? 'success' : 'failure']?.[customer.personality] || "I'm not sure what to say to that.";
    return this.interpolateDialogue(responseTemplate, customer, bottle);
  }

  public applyTactic(
    state: NegotiationState,
    tacticId: string,
    skillLevel: number
  ): { state: NegotiationState; response: string; color: 'green' | 'red' | 'default'; xpGain: number; loreDrop?: 'foundedYear' | 'status' | 'category' | 'brand' | 'region' } {
    const tactic = NEGOTIATION_TACTICS.find(t => t.id === tacticId);
    if (!tactic) return { state, response: "I'm not sure what to do.", color: 'red', xpGain: 0 };

    let patienceChange = 0;
    let aggressivenessChange = 0;
    let trustChange = 0;
    let priceMultiplier = 1.0;
    let success = true;
    let xpGain = 15; // Base XP for using a tactic
    let loreDrop: 'foundedYear' | 'status' | 'category' | 'brand' | 'region' | undefined;

    const { customer, isPlayerBuying } = state;

    // Lore drop chance for small talk and asking about bottle
    if ((tacticId === 'small_talk' || tacticId === 'ask_bottle') && customer.knowledge > 40) {
      // 30% chance to drop lore if they are knowledgeable
      if (Math.random() < 0.3) {
        const possibleLores: ('foundedYear' | 'status' | 'category' | 'brand' | 'region')[] = ['foundedYear', 'status', 'category', 'brand', 'region'];
        loreDrop = possibleLores[Math.floor(Math.random() * possibleLores.length)];
      }
    }

    // Personality modifiers
    const isSkeptic = customer.personality === CustomerPersonality.SKEPTIC;
    const isCollector = customer.personality === CustomerPersonality.COLLECTOR;
    const isBargainHunter = customer.personality === CustomerPersonality.BARGAIN_HUNTER;

    switch (tacticId) {
      case 'sample':
        success = true;
        patienceChange = 20 + skillLevel * 2;
        trustChange = 10 + skillLevel * 3;
        break;
      case 'admire':
        success = !isSkeptic || Math.random() * 100 < 40 + skillLevel * 10;
        if (success) {
          trustChange = 15 + skillLevel * 2;
          patienceChange = 5;
        } else {
          patienceChange = -10;
          trustChange = -5;
        }
        break;
      case 'fair_shake':
        success = true;
        aggressivenessChange = -(15 + skillLevel * 2);
        trustChange = 5 + skillLevel;
        break;
      case 'ledger':
        success = !isBargainHunter || Math.random() * 100 < 60 + skillLevel * 5;
        if (success) {
          aggressivenessChange = -(10 + skillLevel * 2);
          priceMultiplier = isPlayerBuying ? 0.95 - (skillLevel * 0.01) : 1.05 + (skillLevel * 0.01);
        } else {
          aggressivenessChange = 5;
          patienceChange = -10;
        }
        break;
      case 'flattery':
        if (customer.personality === CustomerPersonality.EXPERT || customer.personality === CustomerPersonality.SKEPTIC) {
          success = Math.random() * 100 < 30 + skillLevel * 10;
          if (!success) {
            patienceChange = -20;
            trustChange = -15;
          } else {
            trustChange = 10 + skillLevel * 2;
            patienceChange = 10;
          }
        } else {
          success = true;
          patienceChange = 20 + skillLevel * 2;
          trustChange = 15 + skillLevel * 3;
        }
        break;
      case 'market_insight':
        success = Math.random() * 100 < 40 + skillLevel * 10;
        if (success) {
          const knowledgeBonus = customer.knowledge > 70 ? 1.5 : 1.0;
          trustChange = (15 + skillLevel * 2) * knowledgeBonus;
          priceMultiplier = isPlayerBuying ? 0.92 - (skillLevel * 0.01) : 1.08 + (skillLevel * 0.01);
        } else {
          patienceChange = -15;
          aggressivenessChange = 5;
        }
        break;
      case 'shared_passion':
        success = isCollector || Math.random() * 100 < 50 + skillLevel * 8;
        if (success) {
          trustChange = 25 + skillLevel * 5;
          patienceChange = 15 + skillLevel * 2;
        } else {
          patienceChange = -15;
          trustChange = -10;
        }
        break;
      case 'point_out_flaws':
        success = true; 
        patienceChange = -20;
        aggressivenessChange = -15;
        const flawBonus = isCollector ? 1.5 : 1.0;
        priceMultiplier = isPlayerBuying ? 0.88 - (skillLevel * 0.01 * flawBonus) : 1.12 + (skillLevel * 0.01 * flawBonus);
        break;
      case 'long_game':
        success = true;
        patienceChange = 100;
        trustChange = 5 + skillLevel;
        break;
      case 'scarcity':
        success = Math.random() * 100 < 40 + skillLevel * 12;
        if (success) {
          aggressivenessChange = 10;
          priceMultiplier = isPlayerBuying ? 0.85 - (skillLevel * 0.02) : 1.15 + (skillLevel * 0.02);
        } else {
          patienceChange = -30;
          aggressivenessChange = 20;
        }
        break;
      case 'guarantee':
        success = Math.random() * 100 < 50 + skillLevel * 10;
        if (success) {
          trustChange = 40 + skillLevel * 5;
          patienceChange = 10;
        } else {
          trustChange = -30;
          patienceChange = -20;
        }
        break;
      case 'the_walk_away':
        success = Math.random() * 100 < 30 + skillLevel * 15;
        if (success) {
          priceMultiplier = isPlayerBuying ? 0.80 - (skillLevel * 0.02) : 1.20 + (skillLevel * 0.02);
          patienceChange = -10;
        } else {
          patienceChange = -100;
        }
        break;
    }

    const newCustomer = {
      ...customer,
      patience: Math.max(0, Math.min(100, customer.patience + patienceChange)),
      aggressiveness: Math.max(0, Math.min(100, customer.aggressiveness + aggressivenessChange)),
      trust: Math.max(0, Math.min(100, customer.trust + trustChange)),
    };

    const newTargetPrice = Math.floor(state.targetPrice * priceMultiplier);
    const response = this.getTacticResponse(customer, tacticId, success, state.bottle);

    const newState: NegotiationState = {
      ...state,
      customer: newCustomer,
      targetPrice: newTargetPrice,
      usedTacticIds: [...state.usedTacticIds, tacticId],
    };

    return { state: newState, response, color: success ? 'green' : 'red', xpGain, loreDrop };
  }

  public getCounterOfferResponse(
    customer: Customer,
    isPlayerBuying: boolean,
    playerOffer: number,
    targetPrice: number,
    currentCustomerOffer: number,
    tolerance: number,
    turn: number,
    currentWalkAwayChance: number,
    reputation: number = 0,
    bottle: Bottle
  ): { text: string; counter?: number; deal: boolean; walkAway: boolean; nextWalkAwayChance: number } {
    const diff = Math.abs(playerOffer - targetPrice);
    
    // Trust Bonus: High reputation makes customers more tolerant of aggressive offers
    // Up to 50% extra tolerance at 100% reputation
    const trustBonus = 1 + (reputation / 200);
    const adjustedTolerance = tolerance * trustBonus;
    
    const isClose = diff < adjustedTolerance;
    const insultThreshold = (0.4 - (customer.aggressiveness / 500)) / trustBonus; // 0.2 to 0.4, lowered by trust
    const isInsulting = isPlayerBuying ? (playerOffer < targetPrice * insultThreshold) : (playerOffer > targetPrice * (1 / insultThreshold));
    
    // Deal conditions
    if (isPlayerBuying) {
      if (playerOffer >= targetPrice || isClose) {
        return { text: this.getDealText(customer, true, bottle), deal: true, walkAway: false, nextWalkAwayChance: currentWalkAwayChance };
      }
    } else {
      if (playerOffer <= targetPrice || isClose) {
        return { text: this.getDealText(customer, false, bottle), deal: true, walkAway: false, nextWalkAwayChance: currentWalkAwayChance };
      }
    }

    // Check for walk away based on chance
    if (Math.random() * 100 < currentWalkAwayChance) {
      return { text: this.getWalkAwayText(customer, isPlayerBuying, bottle), deal: false, walkAway: true, nextWalkAwayChance: currentWalkAwayChance };
    }

    // Increase walk away chance for next turn
    // High reputation slows down walk away chance growth
    const growth = (5 + (customer.aggressiveness / 10)) / trustBonus; 
    const nextWalkAwayChance = Math.min(100, currentWalkAwayChance + growth);

    // Walk away conditions (hard limits)
    if (customer.patience < 5 || (turn > 2 && isInsulting)) {
      return { text: this.getWalkAwayText(customer, isPlayerBuying, bottle), deal: false, walkAway: true, nextWalkAwayChance };
    }

    // Counter offer - Aggressiveness affects how much they budge
    const flexibility = 0.6 - (customer.aggressiveness / 200); 
    const counter = isPlayerBuying 
      ? Math.floor(targetPrice - (targetPrice - playerOffer) * flexibility)
      : Math.floor(currentCustomerOffer + (targetPrice - currentCustomerOffer) * flexibility);
      
    return { 
      text: this.getCounterText(customer, isPlayerBuying, playerOffer, targetPrice, counter, bottle), 
      counter, 
      deal: false, 
      walkAway: false,
      nextWalkAwayChance
    };
  }

  private getDealText(customer: Customer, isPlayerBuying: boolean, bottle: Bottle): string {
    const text = isPlayerBuying ? DEAL_TEXTS[customer.personality].buying : DEAL_TEXTS[customer.personality].selling;
    return this.interpolateDialogue(text, customer, bottle);
  }

  private getWalkAwayText(customer: Customer, isPlayerBuying: boolean, bottle: Bottle): string {
    const text = isPlayerBuying ? WALK_AWAY_TEXTS[customer.personality].buying : WALK_AWAY_TEXTS[customer.personality].selling;
    return this.interpolateDialogue(text, customer, bottle);
  }

  private getCounterText(customer: Customer, isPlayerBuying: boolean, playerOffer: number, targetPrice: number, counter: number, bottle: Bottle): string {
    const diffPercent = Math.abs(playerOffer - targetPrice) / targetPrice;
    
    if (diffPercent > 0.4) {
      // Far apart
      const text = isPlayerBuying ? COUNTER_TEXTS_FAR[customer.personality].buying : COUNTER_TEXTS_FAR[customer.personality].selling;
      return `${this.interpolateDialogue(text, customer, bottle)} How about $${counter}?`;
    } else {
      // Getting close
      const text = isPlayerBuying ? COUNTER_TEXTS_CLOSE[customer.personality].buying : COUNTER_TEXTS_CLOSE[customer.personality].selling;
      return `${this.interpolateDialogue(text, customer, bottle)} $${counter} is my best offer for now.`;
    }
  }

  public getDialogueOptions(): DialogueOption[] {
    return DIALOGUE_OPTIONS;
  }

  public getDistillery(id: string) {
    return this.distilleries.find(d => d.id === id);
  }

  public getAllDistilleries() { return this.distilleries; }
  public getAllBrands() { return this.brands; }

  public getAuctionBidders(shopLevel: number): number {
    const min = 2 + Math.floor((shopLevel - 1) / 2);
    const max = 4 + (shopLevel - 1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getAuctionFinalBid(bottle: Bottle, shopLevel: number, bidderCount: number): number {
    const floor = 0.3 + (shopLevel - 1) * (0.65 - 0.3) / 5;
    const ceiling = 1.1 + (shopLevel - 1) * (1.5 - 1.1) / 5;
    
    // Using a slightly modified version of prestige factors for auction frenzy
    const rarityBonus = RARITY_PRESTIGE_FACTORS[bottle.rarity] * 0.5;

    let highestBid = 0;
    for (let i = 0; i < bidderCount; i++) {
      let bidMultiplier = Math.random() * (ceiling - floor) + floor;
      bidMultiplier += rarityBonus * Math.random();
      const bid = Math.floor(bottle.value * bidMultiplier);
      if (bid > highestBid) highestBid = bid;
    }
    
    return highestBid;
  }
}
