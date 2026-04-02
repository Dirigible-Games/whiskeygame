import { WhiskeyEngine } from './src/engine';

const engine = new WhiskeyEngine();
const total = 100000;

for (let shopLevel = 1; shopLevel <= 5; shopLevel++) {
  let counts = { 30: 0, 40: 0, 50: 0 };
  for (let i = 0; i < total; i++) {
    const bottle = engine.generateRandomBottle(undefined, shopLevel);
    const yearsOld = 2026 - bottle.year;
    
    if (yearsOld > 30) counts[30]++;
    if (yearsOld > 40) counts[40]++;
    if (yearsOld > 50) counts[50]++;
  }
  console.log(`--- Shop Tier ${shopLevel} ---`);
  console.log(`>30 years old: ${((counts[30] / total) * 100).toFixed(2)}%`);
  console.log(`>40 years old: ${((counts[40] / total) * 100).toFixed(2)}%`);
  console.log(`>50 years old: ${((counts[50] / total) * 100).toFixed(2)}%`);
}
