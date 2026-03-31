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
  DialogueOption,
  ToolkitItem,
  Tactic
} from './types';

export const CURRENT_YEAR = 2026;

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
    minSkill: 1,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 3 
      ? "You look like someone who knows their whiskey!" 
      : "It's rare to meet someone with such an impeccable sense of timing and taste."
  },
  {
    id: 'market_insight',
    name: 'Market Insight',
    description: 'Show off your knowledge of current trends to justify your price.',
    minSkill: 1,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 3
      ? "I heard this distillery is getting popular lately."
      : "Given the recent acquisition of this distillery, the secondary market for these older labels is tightening significantly."
  },
  {
    id: 'shared_passion',
    name: 'Shared Passion',
    description: 'Connect over the craft. Massive trust boost for enthusiasts.',
    minSkill: 2,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 4
      ? "I really love the way they make this one."
      : "I can tell you really appreciate the craft. This distillery uses a very specific char on their barrels that creates that unique profile..."
  },
  {
    id: 'point_out_flaws',
    name: 'Point Out Flaws',
    description: 'Highlight minor issues to lower their price or justify yours. Hurts patience.',
    minSkill: 2,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 4
      ? "The label is a bit scuffed up, don't you think?"
      : "While the liquid is pristine, the slight oxidation on the capsule is a factor we must consider in the final valuation."
  },
  {
    id: 'long_game',
    name: 'The Long Game',
    description: 'Show you are in no rush. Maxes out patience.',
    minSkill: 3,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => skill < 5
      ? "I'm in no hurry, take your time."
      : (isPlayerBuying ? "Take your time, I'm in no rush to acquire this. Quality like this deserves careful consideration." : "Take your time, I'm in no rush to see this leave the shelf. Quality like this deserves careful consideration.")
  },
  {
    id: 'scarcity',
    name: 'Scarcity Play',
    description: 'Create urgency. Increases walk-away chance but can force a quick deal.',
    minSkill: 3,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 5
      ? (isPlayerBuying ? "I've seen a few of these around lately." : "I have another guy interested in this one.")
      : (isPlayerBuying ? "I should mention I've seen several of these specific bottlings at auction recently. It's not as rare as it once was." : "I should mention I've had several inquiries about this specific bottling this morning. It likely won't be here by closing.")
  },
  {
    id: 'guarantee',
    name: 'Personal Guarantee',
    description: 'Stake your reputation. High success rate if price is reasonable.',
    minSkill: 4,
    category: 'soft',
    playerDialogue: (skill, isPlayerBuying) => isPlayerBuying ? "I stand behind my offers. You won't find a better, more honest valuation anywhere else." : "I stand behind every bottle in this shop. You have my word on its provenance and quality."
  },
  {
    id: 'the_walk_away',
    name: 'The Walk Away',
    description: 'The ultimate power move. High risk, high reward price shift.',
    minSkill: 4,
    category: 'hard',
    playerDialogue: (skill, isPlayerBuying) => skill < 5
      ? "Maybe we just can't make a deal today."
      : "It seems we are at an impasse. I've given my best offer; perhaps this isn't the right time for this particular transaction."
  }
];

const MIDDLE_INITIALS = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.', 'H.', 'I.', 'J.', 'K.', 'L.', 'M.', 'N.', 'O.', 'P.', 'Q.', 'R.', 'S.', 'T.', 'U.', 'V.', 'W.', 'X.', 'Y.', 'Z.'];

const REGIONAL_NAMES: Record<Region, {
  prefixes: string[];
  suffixes: string[];
  firstNames: string[];
  lastNames: string[];
  places: string[];
}> = {
  [Region.USA]: {
    prefixes: ['Old', 'Colonel', 'Rebel', 'Frontier', 'Pioneer', 'Eagle', 'Copper', 'Iron', 'Wild', 'Grand', 'Southern', 'Mountain', 'Straight', 'Honest', 'Noble', 'Rustic', 'Vintage', 'Heritage', 'Liberty', 'Patriot', 'Canyon', 'Prairie', 'Valley', 'Timber'],
    suffixes: ['Reserve', 'Cask', 'Barrel', 'Springs', 'Creek', 'Ridge', 'Run', 'Branch', 'Hollow', 'Estate', 'Select', 'Batch', 'Trace', 'Hill', 'Wood', 'Blend', 'Spirits', 'Bourbon', 'Rye', 'Mash', 'Proof', 'Char', 'Oak'],
    firstNames: ['George', 'Henry', 'Jacob', 'James', 'John', 'Joseph', 'William', 'Thomas', 'J.', 'W.', 'E.', 'A.', 'C.', 'Arthur', 'Charles', 'Edward', 'Frank', 'Harry', 'Oliver', 'Samuel', 'Walter', 'Albert', 'David', 'Martin', 'Robert'],
    lastNames: ['Smith', 'Johnson', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis'],
    places: ['Kentucky', 'Tennessee', 'Bluegrass', 'Limestone', 'Licking', 'Elkhorn', 'Appalachia', 'Cumberland', 'Smoky', 'Shenandoah', 'Ozark', 'Mississippi', 'Ohio', 'Bourbon County', 'Nelson County', 'Franklin', 'Anderson', 'Marion', 'Mercer']
  },
  [Region.SCOTLAND]: {
    prefixes: ['Glen', 'Ben', 'Mac', 'Loch', 'Strath', 'Aber', 'Craig', 'Inver', 'Royal', 'Highland', 'Isle of', 'The', 'Auld', 'Dun', 'Kil', 'Bal', 'Dal', 'Kin', 'Auch', 'Brae', 'Cairn', 'Drum', 'Fetter', 'Tull'],
    suffixes: ['Wood', 'Reserve', 'Malt', 'Cask', 'Blend', 'Spirits', 'Water', 'Burn', 'Firth', 'Moor', 'Glen', 'Loch', 'Ben', 'Strath', 'Aber', 'Craig', 'Inver', 'Port', 'Dun', 'Kil', 'Bal', 'Dal', 'Kin', 'Auch'],
    firstNames: ['Angus', 'Hamish', 'Malcolm', 'Alistair', 'Callum', 'Ewan', 'Finlay', 'Gavin', 'Ian', 'Lachlan', 'Aodh', 'Baird', 'Blair', 'Brodie', 'Bruce', 'Cameron', 'Colin', 'Cormac', 'Craig', 'Crawford', 'Douglas', 'Fergus', 'Fletcher', 'Forbes', 'Fraser', 'Gordon', 'Graham', 'Grant', 'Gregor', 'Iain', 'Innes', 'Irvine', 'Keith', 'Kenneth', 'Lennox', 'Logan', 'Magnus', 'Munro', 'Murdo', 'Niall', 'Ramsay', 'Rory', 'Ross', 'Ruairidh', 'Sinclair', 'Stuart', 'Tavish', 'Wallace'],
    lastNames: ['Campbell', 'Stewart', 'MacDonald', 'Fraser', 'Graham', 'MacLeod', 'MacFarlane', 'MacKenzie', 'MacKay', 'MacLean', 'MacIntosh', 'MacGregor', 'MacMillan', 'MacPherson', 'MacAlister', 'MacDougall', 'MacNab', 'MacAulay', 'MacKinnon', 'MacLaren', 'MacRae', 'MacNeil', 'MacEwan', 'MacIver', 'MacInnes', 'Buchanan', 'Munro', 'Wallace', 'Bruce', 'Sinclair'],
    places: ['Highland', 'Lowland', 'Speyside', 'Islay', 'Campbeltown', 'Skye', 'Orkney', 'Jura', 'Arran', 'Fife', 'Lothian', 'Clyde', 'Tweed', 'Tay', 'Forth', 'Dee', 'Don', 'Spey', 'Findhorn', 'Lossie', 'Deveron', 'Ythan', 'Ugie', 'Ness', 'Beauly']
  },
  [Region.IRELAND]: {
    prefixes: ['Bally', 'Kil', 'Dun', 'Knock', 'Carrick', 'Old', 'The', 'Celtic', 'Emerald', 'Shamrock', 'Wild', 'Green', 'Saint', 'Gaelic', 'Clover', 'Leprechaun', 'Blarney', 'Tara', 'Boyne', 'Shannon', 'Liffey', 'Corrib', 'Erne', 'Foyle'],
    suffixes: ['Dew', 'Cask', 'Still', 'Reserve', 'Estate', 'Valley', 'Stream', 'Mill', 'Bridge', 'Cross', 'Point', 'Meadow', 'Isle', 'Castle', 'Grange', 'Blend', 'Spirits', 'Malt', 'Pot Still', 'Grain', 'Oak', 'Wood', 'Char'],
    firstNames: ['Patrick', 'Michael', 'Sean', 'Liam', 'Conor', 'Declan', 'Aidan', 'Brendan', 'Cian', 'Darragh', 'Eoin', 'Fionn', 'Oisin', 'Ronan', 'Cillian', 'Cathal', 'Cormac', 'Daithi', 'Dermot', 'Donal', 'Eamon', 'Enda', 'Fergal', 'Finbar', 'Garret', 'Kieran', 'Lorcan', 'Niall', 'Odhran', 'Padraig', 'Peadar', 'Rian', 'Ruairi', 'Tadhg', 'Tiernan'],
    lastNames: ['Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'O\'Brien', 'Byrne', 'Ryan', 'Connor', 'O\'Neill', 'O\'Reilly', 'Doyle', 'McCarthy', 'Gallagher', 'Doherty', 'Lynch', 'Quinn', 'McLoughlin', 'Connolly', 'Healy', 'Fitzgerald', 'Kavanagh', 'Maguire', 'O\'Donnell', 'O\'Keeffe', 'O\'Mahony', 'O\'Rourke', 'Sweeney'],
    places: ['Dublin', 'Cork', 'Galway', 'Belfast', 'Munster', 'Leinster', 'Connacht', 'Ulster', 'Kerry', 'Clare', 'Limerick', 'Tipperary', 'Waterford', 'Wexford', 'Kilkenny', 'Wicklow', 'Kildare', 'Meath', 'Louth', 'Antrim', 'Down', 'Armagh', 'Tyrone', 'Derry', 'Donegal']
  },
  [Region.CANADA]: {
    prefixes: ['Northern', 'Crown', 'Royal', 'Maple', 'Glacier', 'Bear', 'Wolf', 'Moose', 'Great', 'Black', 'True', 'North', 'Ice', 'Snow', 'Winter', 'Polar', 'Arctic', 'Tundra', 'Boreal', 'Pine', 'Cedar', 'Birch', 'Oak', 'Elm'],
    suffixes: ['Club', 'Mist', 'Peak', 'Lake', 'Valley', 'Crest', 'Ridge', 'Wood', 'Cask', 'Reserve', 'Gold', 'Blend', 'Harvest', 'Shield', 'Spirits', 'Rye', 'Malt', 'Grain', 'Oak', 'Char', 'Barrel', 'Springs'],
    firstNames: ['Jean', 'Pierre', 'Jacques', 'Michel', 'Claude', 'Gilles', 'Guy', 'Luc', 'Marc', 'Paul', 'René', 'Yves', 'Alain', 'Benoit', 'Denis', 'Éric', 'François', 'Gérard', 'Henri', 'Louis', 'Marcel', 'Normand', 'Pascal', 'Raymond', 'Serge', 'Sylvain', 'Yvon', 'Gaston', 'Maurice', 'Réjean'],
    lastNames: ['Tremblay', 'Roy', 'Gagnon', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Fortin', 'Pelletier', 'Bélanger', 'Lefebvre', 'Martel', 'Landry', 'Côté', 'Ouellet', 'Tardif', 'Poirier', 'Desjardins', 'Lapointe', 'Savard', 'Richard', 'Michaud', 'Caron', 'Hébert', 'Poulin'],
    places: ['Ontario', 'Alberta', 'Quebec', 'Nova Scotia', 'Yukon', 'Rockies', 'Toronto', 'Montreal', 'Vancouver', 'Niagara', 'Banff', 'Jasper', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Halifax', 'Victoria', 'Regina', 'Saskatoon', 'St. John\'s', 'Charlottetown', 'Fredericton', 'Whitehorse', 'Yellowknife']
  },
  [Region.JAPAN]: {
    prefixes: ['Yama', 'Kawa', 'Matsu', 'Take', 'Ume', 'Kiku', 'Sakura', 'Fuji', 'Shin', 'Hon', 'Kura', 'Tsuru', 'Kame', 'Gin', 'Kin', 'Aka', 'Ao', 'Shiro', 'Kuro', 'Midori', 'Ki', 'Murasaki', 'O', 'Ko'],
    suffixes: ['Zaki', 'Kushu', 'Tori', 'Mura', 'Gawa', 'Yama', 'Kawa', 'Cask', 'Reserve', 'Blend', 'Malt', 'Estate', 'Spirits', 'Oak', 'Wood', 'Barrel', 'Springs', 'Lake', 'Valley', 'Peak', 'Ridge', 'Crest'],
    firstNames: ['S.', 'M.', 'K.', 'T.', 'Y.', 'H.', 'Kenji', 'Taro', 'Akira', 'Hiroshi', 'Ichiro', 'Jiro', 'Saburo', 'Shiro', 'Goro', 'Rokuro', 'Shichiro', 'Hachiro', 'Kuro', 'Juro', 'Yuki', 'Haru', 'Natsu', 'Aki', 'Fuyu'],
    lastNames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto'],
    places: ['Kyoto', 'Hokkaido', 'Osaka', 'Tokyo', 'Sendai', 'Honshu', 'Kyushu', 'Shikoku', 'Okinawa', 'Sapporo', 'Fukuoka', 'Kobe', 'Nagoya', 'Yokohama', 'Hiroshima', 'Nagasaki', 'Kanazawa', 'Nara', 'Kamakura', 'Nikko', 'Hakone', 'Fuji', 'Aso', 'Biwa', 'Seto']
  }
};

const REGION_TYPE_MAP: Record<Region, WhiskeyType[]> = {
  [Region.USA]: [WhiskeyType.BOURBON, WhiskeyType.RYE],
  [Region.CANADA]: [WhiskeyType.CANADIAN_WHISKY],
  [Region.SCOTLAND]: [WhiskeyType.SINGLE_MALT_SCOTCH],
  [Region.IRELAND]: [WhiskeyType.IRISH_WHISKEY],
  [Region.JAPAN]: [WhiskeyType.JAPANESE_WHISKY],
};

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
      bottleShape: ['flask', 'round', 'square', 'tall', 'decanter', 'jug', 'bell'][Math.floor(Math.random() * 7)],
      labelColor: `hsl(${Math.random() * 360}, 30%, 40%)`,
      capColor: `hsl(${Math.random() * 360}, 20%, 20%)`,
      labelFont: ['modern', 'classic', 'vintage', 'technical', 'bold'][Math.floor(Math.random() * 5)],
      capType: ['screw', 'cork', 'wax', 'glass'][Math.floor(Math.random() * 4)],
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
      rarity: productLine.rarity,
      rarityDiscovered: false,
      modifiers: productLine.modifiers,
      name: `${year} ${brand.name} ${productLine.name}`,
      value: this.calculateValue(age, proof, productLine.rarity, year, productLine.type, distillery.prestige, brand.prestige, productLine.modifiers),
      purchasePrice: Math.floor(this.calculateValue(age, proof, productLine.rarity, year, productLine.type, distillery.prestige, brand.prestige, productLine.modifiers) * (0.6 + Math.random() * 0.2)),
      discoveredFields: []
    };
  }

  private getAgeRange(type: WhiskeyType) {
    switch (type) {
      case WhiskeyType.SINGLE_MALT_SCOTCH: return { min: 3, max: 50 };
      case WhiskeyType.IRISH_WHISKEY: return { min: 3, max: 30 };
      case WhiskeyType.JAPANESE_WHISKY: return { min: 3, max: 40 };
      case WhiskeyType.CANADIAN_WHISKY: return { min: 3, max: 25 };
      default: return { min: 2, max: 23 };
    }
  }

  private getProofRange(type: WhiskeyType) {
    switch (type) {
      case WhiskeyType.SINGLE_MALT_SCOTCH: return { min: 80, max: 130 };
      case WhiskeyType.IRISH_WHISKEY: return { min: 80, max: 120 };
      case WhiskeyType.JAPANESE_WHISKY: return { min: 80, max: 125 };
      case WhiskeyType.CANADIAN_WHISKY: return { min: 80, max: 110 };
      default: return { min: 80, max: 140 };
    }
  }

  private getPossibleModifiers(type: WhiskeyType, age: number, proof: number, region: Region): string[] {
    let mods: string[] = ['Special Release', 'Quarterly Release'];

    if (type === WhiskeyType.SINGLE_MALT_SCOTCH) {
      mods.push('Peated', 'Sherry Matured', 'Port Finish', 'Cask Strength');
      return mods;
    }

    if (type === WhiskeyType.IRISH_WHISKEY) {
      mods.push('3x Distilled', 'Pot Still', 'Small Batch');
      return mods;
    }

    if (type === WhiskeyType.JAPANESE_WHISKY) {
      mods.push('Mizunara Cask', 'Double Matured', 'Small Batch');
      return mods;
    }

    if (type === WhiskeyType.CANADIAN_WHISKY) {
      mods.push('Blended', 'Small Batch', 'Limited Edition');
      return mods;
    }

    mods = [...mods, 'Double Oaked', 'Cognac Finish', 'Sherry Finish', 'Rum Finish', 'Stout Finish', 'IPA Finish', 'Merlot Finish'];

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
    const rarityOrder = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.UNICORN];
    const getRank = (r: Rarity) => rarityOrder.indexOf(r);
    
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
    currentRank = Math.min(rarityOrder.length - 1, currentRank + Math.min(rankBump, maxRankBump));
    
    return rarityOrder[currentRank];
  }

  public calculateApparentValue(bottle: Bottle, discoveredFields: string[]): number {
    const brand = this.getBrand(bottle.brandId)!;
    const distillery = this.distilleries.find(d => d.id === brand.parentDistilleryId)!;

    // Rarity is only used if discovered
    const rarity = discoveredFields.includes('rarity') ? bottle.rarity : Rarity.COMMON;
    
    // Modifiers are only used if discovered
    const revealedModifiers = bottle.modifiers.filter((_, i) => discoveredFields.includes(`modifiers_${i}`));

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
    
    const rarityMultipliers = {
      [Rarity.COMMON]: 1,
      [Rarity.UNCOMMON]: 1.5,
      [Rarity.RARE]: 3,
      [Rarity.EPIC]: 8,
      [Rarity.LEGENDARY]: 20,
      [Rarity.UNICORN]: 50,
    };

    let value = base * rarityMultipliers[rarity];

    // Prestige Impact
    const rarityFactor = {
      [Rarity.COMMON]: 0.1,
      [Rarity.UNCOMMON]: 0.2,
      [Rarity.RARE]: 0.4,
      [Rarity.EPIC]: 0.6,
      [Rarity.LEGENDARY]: 0.8,
      [Rarity.UNICORN]: 1.0,
    }[rarity];

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
    const names = ['Arthur', 'Beatrice', 'Charles', 'Dorothy', 'Edward', 'Florence', 'George', 'Helen', 'Isaac', 'Julia', 'Kevin', 'Linda', 'Michael', 'Nora', 'Oscar', 'Patricia', 'Quincy', 'Rachel', 'Samuel', 'Theresa'];
    
    // Personality weights based on shop level and reputation
    // Early levels: More Novices, Desperate, and Bargain Hunters
    // Late levels: More Experts, Collectors, and Greedy sellers
    // High reputation: More Collectors and Experts, fewer Novices and Bargain Hunters
    const weights: Record<CustomerPersonality, number> = {
      [CustomerPersonality.NOVICE]: Math.max(5, 40 - (shopLevel * 5) - (reputation / 4)),
      [CustomerPersonality.DESPERATE]: Math.max(5, 30 - (shopLevel * 4)),
      [CustomerPersonality.BARGAIN_HUNTER]: Math.max(2, 25 - (reputation / 6)),
      [CustomerPersonality.EASYGOING]: 20,
      [CustomerPersonality.SKEPTIC]: 10 + (shopLevel * 2),
      [CustomerPersonality.GREEDY]: 5 + (shopLevel * 4),
      [CustomerPersonality.EXPERT]: 2 + (shopLevel * 6) + (reputation / 8),
      [CustomerPersonality.COLLECTOR]: 1 + (shopLevel * 5) + (reputation / 5),
    };

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

    const name = names[Math.floor(Math.random() * names.length)];
    
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
      name: names[Math.floor(Math.random() * names.length)],
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
    const responses: Record<string, Record<CustomerPersonality, string>> = {
      'friendly_greeting': {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "Hey there! Good to see a friendly face. I brought this {brand} in today." : "Hey there! Good to see a friendly face. It's a beautiful day to buy some {type}, isn't it?",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "Hello. I've brought a {year} {distillery} I think you'll find interesting. Let's see if you agree." : "Hello. I appreciate the warm welcome, but let's see if your {brand} inventory matches your hospitality.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Yeah, yeah, hi. I've got a {productLine} here that's worth a fortune. Hope you've got deep pockets today." : "Yeah, yeah, hi. I'm busy, so let's hope you've got some good prices on {type} today.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "Oh, hello! Thank you for seeing me. I... I really need to sell this {brand}." : "Oh, hello! Thank you for seeing me. I... I really need a bottle of {type} for tonight.",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "Good day. I'm thinning out my collection and thought your shop might appreciate this {productLine}." : "Good day. I've heard your shop has some interesting pieces. I'm looking for a {brand} to complete a set.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "Hi! I found this {brand} in my grandfather's attic. I'm not sure what it is, but it looks old!" : "Hi! Wow, you have so many bottles here. I'm just starting to learn about {type}.",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "Hello. I've heard a lot of talk about this place. Let's see if you give a fair price for this {brand}." : "Hello. I've heard a lot of talk about this place. Let's see if your {distillery} selection is actually any good.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "Hey. I'm looking to offload some {type}. Hope you're buying today." : "Hey. Hope you're ready to move some inventory today. I'm looking for a deal on {brand}."
      },
      'professional_greeting': {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "Good day to you too! Very formal, I like it. I'm hoping to sell this {brand}." : "Good day to you too! Very formal, I like it. Let's see what {type} you have.",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "Good day. I prefer a business-like approach. I have a {year} {distillery} to discuss." : "Good day. I prefer a business-like approach. Let's see your {type} selection.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Right. Business. That's what I'm here for. Let's talk numbers on this {brand} soon." : "Right. Business. That's what I'm here for. Show me the good stuff.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "Yes, hello. I'm ready to discuss terms for this {productLine} whenever you are." : "Yes, hello. I'm looking to buy some {type}, but I need a good price.",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "Greetings. I appreciate a professional establishment. I'm offering a piece of my {brand} collection." : "Greetings. I appreciate a professional establishment. It suggests your inventory is well-curated.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "Hello, sir. I'm here to... well, I'm here to sell this {brand}, I think." : "Hello, sir. I'm here to... well, I'm here to buy something nice, I think.",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "Good day. Let's keep this professional and straightforward. I have a {type} to sell." : "Good day. Let's keep this professional and straightforward. No games.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "Hello. Let's get right to it. I'm here to see what you can offer me for this {brand}." : "Hello. Let's get right to it. I'm here to see what kind of deal you can give me on a {type}."
      },
      'whiskey_smalltalk': {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "Oh, I love a good {type}! There's something about that {brand} profile that just hits right, you know?" : "I've always enjoyed a solid {type}. Hoping this {brand} hits the spot.",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "The current market is fascinating. Too many people chasing labels instead of liquid quality, though {distillery} usually gets it right." : "I'm looking closely at {distillery} releases lately. Their {type} output has been... interesting.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Whiskey is a better investment than gold right now. That's why I'm here with this {brand}." : "Whiskey is a better investment than gold right now. I'm looking for a {brand} that will appreciate.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "I used to enjoy a glass now and then... but lately, I'm more interested in what this {brand} is worth." : "I used to enjoy a glass now and then... but lately, I just need a drink.",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "I've been tracking {distillery}'s output for years. The nuances in their {year} runs are unparalleled." : "I'm trying to complete a vertical of {brand}. It's been quite the hunt.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "I heard someone say 'peaty' once. Is that like... dirt? I'm still trying to figure out if I like {type}." : "I heard someone say 'peaty' once. Is that like... dirt? I'm still trying to figure out what {type} to buy.",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "Everyone claims their bottles are 'hand-selected.' Usually, it's just marketing fluff from {distillery}." : "Everyone claims their bottles are 'hand-selected.' I'll be the judge of this {brand}.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "I don't care much for the story behind {brand}. I care about the price per ounce." : "I don't care much for the story behind {brand}. I care about the price per ounce."
      },
      'general_smalltalk': {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "Can you believe this weather? Perfect for a porch pour of this {brand}." : "Can you believe this weather? Perfect for a porch pour.",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "The industry is changing. These new 'craft' distilleries are hit or miss, unlike this {distillery}." : "The industry is changing. These new 'craft' distilleries are hit or miss.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Time is money, friend. I'm not here to talk about the weather, I'm here to sell this {type}." : "Time is money, friend. I'm not here to talk about the weather.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "It's been a long week. I'm just looking to get this {brand} settled." : "It's been a long week. I'm just looking to get this settled.",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "The local auction scene has been quite active lately. Some truly rare pieces surfacing, like this {productLine}." : "The local auction scene has been quite active lately. Some truly rare pieces surfacing.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "It's a nice shop you have here. Very... woody. I hope you like this {brand}." : "It's a nice shop you have here. Very... woody. I like the smell.",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "I've seen shops like this come and go. It's a tough business to stay honest in. Let's see how you handle this {type}." : "I've seen shops like this come and go. It's a tough business to stay honest in.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "Nice place. Must have a lot of overhead. Hope that doesn't mean your offers are low." : "Nice place. Must have a lot of overhead. Hope that doesn't mean your prices are high."
      },
      'inspect_bottle': {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "Sure, take a look! It's a nice {brand}, isn't it?" : "Take your time! I'm in no rush. It's a great looking bottle.",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "Go ahead. I've already checked the {year} fill level myself, but I understand the need for due diligence." : "Checking the details? Good. I've already done my own assessment of this {brand}, of course.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Make it quick. I don't have all day for you to gawk at it." : "What are you doing? You should know what you're selling. Let's get to the price.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "Of course... please, check whatever you need. I just want to get this done." : "Is something wrong? I hope it's still what you said it was...",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "By all means. I've kept this {productLine} in a temperature-controlled environment since I acquired it." : "A thorough inspection is always wise. I've been doing the same from over here.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "Oh, is that what you do? Cool! Tell me if you find anything interesting about this {brand}." : "Wow, you're really looking at it closely! I should learn how to do that.",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "Go ahead. You won't find anything wrong with it, I've already looked." : "Checking for flaws? I'm doing the same. I don't buy anything without a full look.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "Fine, but don't use it as an excuse to lowball me. It's solid." : "Go ahead, look all you want. It won't change what I'm willing to pay."
      }
    };

    const responseTemplate = responses[optionId]?.[customer.personality] || "I'm not sure what to say to that.";
    return this.interpolateDialogue(responseTemplate, customer, bottle);
  }

  public static getNextLevelXP(level: number): number {
    // Next Level XP = 100 * (Level ^ 1.5)
    return Math.floor(100 * Math.pow(level || 1, 1.5));
  }

  public getTacticResponse(customer: Customer, tacticId: string, success: boolean, bottle: Bottle): string {
    const responses: Record<string, { success: Record<CustomerPersonality, string>; failure: Record<CustomerPersonality, string> }> = {
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
          [CustomerPersonality.EXPERT]: "I don't need a sample to know what this is. Let's stick to the business.",
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

    const responseTemplate = responses[tacticId]?.[success ? 'success' : 'failure']?.[customer.personality] || "I'm not sure what to say to that.";
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
    
    // Check for walk away based on chance
    if (Math.random() * 100 < currentWalkAwayChance) {
      return { text: this.getWalkAwayText(customer, isPlayerBuying, bottle), deal: false, walkAway: true, nextWalkAwayChance: currentWalkAwayChance };
    }

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
    const texts: Record<CustomerPersonality, string> = {
      [CustomerPersonality.EASYGOING]: isPlayerBuying ? "You've got yourself a deal! I'm happy to see this {brand} go to a good home." : "That's a fair price for a {type}. I'll take it!",
      [CustomerPersonality.EXPERT]: isPlayerBuying ? "A reasonable offer for a {year} bottling. We have a deal." : "That matches my valuation of this {brand}. I'll buy it.",
      [CustomerPersonality.GREEDY]: isPlayerBuying ? "Fine, fine. Take the {productLine} before I change my mind." : "I suppose that's acceptable for this {brand}. Deal.",
      [CustomerPersonality.DESPERATE]: isPlayerBuying ? "Thank you! Yes, that works. I really appreciate it." : "I can afford that. Thank you so much.",
      [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "I'm glad it's going to a serious shop. I hope you find a good home for it." : "Excellent. This {brand} will be a fine addition to my collection.",
      [CustomerPersonality.NOVICE]: isPlayerBuying ? "Oh, okay! If you say that's what it's worth, I trust you." : "I'll take it! I hope it's as good as you say.",
      [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "Fine. I'll sell it. But I still think you're getting the better end of this." : "Alright, I'll buy it. It seems legitimate enough.",
      [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "You drive a hard bargain, but I'll take the cash." : "Finally, a price that makes sense for a {type}. Deal."
    };
    return this.interpolateDialogue(texts[customer.personality], customer, bottle);
  }

  private getWalkAwayText(customer: Customer, isPlayerBuying: boolean, bottle: Bottle): string {
    const texts: Record<CustomerPersonality, string> = {
      [CustomerPersonality.EASYGOING]: isPlayerBuying ? "I don't think we're going to find a middle ground here. I'll take my {brand} elsewhere." : "I don't think we're going to find a middle ground here. I'll be heading out.",
      [CustomerPersonality.EXPERT]: isPlayerBuying ? "Your numbers for this {brand} are completely detached from reality. I'm wasting my time." : "Your prices for this {brand} are completely detached from reality. I'm wasting my time.",
      [CustomerPersonality.GREEDY]: isPlayerBuying ? "You're trying to rob me blind! I'm taking my {type} and leaving." : "You're trying to rob me blind! I'm not paying that.",
      [CustomerPersonality.DESPERATE]: isPlayerBuying ? "I... I can't do that. I need to find someone more reasonable to sell to. Sorry." : "I... I can't do that. I need to find a cheaper bottle. Sorry.",
      [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "I'm looking for serious buyers, not games. I'll look elsewhere to sell my {distillery} bottles." : "I'm looking for serious sellers, not games. I'll look elsewhere for my {distillery} bottles.",
      [CustomerPersonality.NOVICE]: isPlayerBuying ? "This is all a bit too much for me. I think I'll just keep the bottle." : "This is all a bit too much for me. I think I'll just go without.",
      [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "I knew this was a waste of time. You're trying to steal my {brand}. I'm leaving." : "I knew this was a waste of time. You're trying to rip me off. I'm leaving.",
      [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "I can find a better buyer than this at a gas station. I'm out." : "I can find a better deal than this at a gas station. I'm out."
    };
    return this.interpolateDialogue(texts[customer.personality], customer, bottle);
  }

  private getCounterText(customer: Customer, isPlayerBuying: boolean, playerOffer: number, targetPrice: number, counter: number, bottle: Bottle): string {
    const diffPercent = Math.abs(playerOffer - targetPrice) / targetPrice;
    
    if (diffPercent > 0.4) {
      // Far apart
      const texts: Record<CustomerPersonality, string> = {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "Whoa, that's a bit lower than I was hoping for. Can you come up closer to my ask?" : "Whoa, that's a bit higher than I was hoping for. Can you come down closer to my budget?",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "That's an insulting offer for a {brand} of this caliber. You'll need to do much better." : "That's an insulting price for a {brand} of this caliber. You'll need to do much better.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Are you joking? I'm not giving this {type} away. My price is firm, but I'll drop a tiny bit." : "Are you joking? I'm not paying that much. My price is firm, but I'll go up a tiny bit.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "Please, I really need more than that. It's a special bottle..." : "Please, I really can't afford that much. Can we do better?",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "I know exactly what this {productLine} is worth. Your offer is nowhere near the market value." : "I know exactly what this {productLine} is worth. Your price is nowhere near the market value.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "Is it really only worth that much? I thought it was more... can we do better?" : "Is it really that expensive? I thought it was less... can we do better?",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "I expected as much. You're trying to lowball me. I'm not biting." : "I expected as much. You're trying to overcharge me. I'm not biting.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "You're going to have to do better than that if you want my {brand}." : "You're going to have to do better than that if you want my money."
      };
      return `${this.interpolateDialogue(texts[customer.personality], customer, bottle)} How about $${counter}?`;
    } else {
      // Getting close
      const texts: Record<CustomerPersonality, string> = {
        [CustomerPersonality.EASYGOING]: isPlayerBuying ? "We're getting there! Just a little more and we've got a deal for this {brand}." : "We're getting there! Just a little less and we've got a deal.",
        [CustomerPersonality.EXPERT]: isPlayerBuying ? "You're closer to the mark now. Still a bit off for a {year} bottling, though." : "You're closer to the mark now. Still a bit high for a {year} bottling, though.",
        [CustomerPersonality.GREEDY]: isPlayerBuying ? "Better. Still not enough. Let's meet here for the {type}." : "Better. Still too much. Let's meet here.",
        [CustomerPersonality.DESPERATE]: isPlayerBuying ? "That's almost enough... just a bit more and I can let it go." : "That's almost affordable... just a bit less and I can take it.",
        [CustomerPersonality.COLLECTOR]: isPlayerBuying ? "We are approaching a fair valuation for this {brand}. Let's refine it." : "We are approaching a fair price for this {brand}. Let's refine it.",
        [CustomerPersonality.NOVICE]: isPlayerBuying ? "Oh, that sounds closer to what I was thinking! How about this?" : "Oh, that sounds closer to what I can afford! How about this?",
        [CustomerPersonality.SKEPTIC]: isPlayerBuying ? "Hmm. That's a more realistic number. But I still need a bit more." : "Hmm. That's a more realistic number. But I still need a bit less.",
        [CustomerPersonality.BARGAIN_HUNTER]: isPlayerBuying ? "Now we're talking. Just a little more of a premium and you've got a seller." : "Now we're talking. Just a little more of a discount and you've got a buyer."
      };
      return `${this.interpolateDialogue(texts[customer.personality], customer, bottle)} $${counter} is my best offer for now.`;
    }
  }

  public getDialogueOptions(): DialogueOption[] {
    return [
      { id: 'friendly_greeting', label: 'Friendly Greeting', type: 'greeting' },
      { id: 'professional_greeting', label: 'Professional Greeting', type: 'greeting' },
      { id: 'whiskey_smalltalk', label: 'Whiskey Small Talk', type: 'smalltalk' },
      { id: 'general_smalltalk', label: 'General Small Talk', type: 'smalltalk' },
      { id: 'get_to_business', label: 'Get to Business', type: 'business' }
    ];
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
    
    const rarityBonus: Record<Rarity, number> = {
      [Rarity.COMMON]: 0,
      [Rarity.UNCOMMON]: 0.05,
      [Rarity.RARE]: 0.1,
      [Rarity.EPIC]: 0.2,
      [Rarity.LEGENDARY]: 0.3,
      [Rarity.UNICORN]: 0.5,
    };

    let highestBid = 0;
    for (let i = 0; i < bidderCount; i++) {
      let bidMultiplier = Math.random() * (ceiling - floor) + floor;
      bidMultiplier += rarityBonus[bottle.rarity] * Math.random();
      const bid = Math.floor(bottle.value * bidMultiplier);
      if (bid > highestBid) highestBid = bid;
    }
    
    return highestBid;
  }
}
