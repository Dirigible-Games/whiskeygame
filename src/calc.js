let totalXP = 0;
for (let i = 0; i < 100; i++) {
  let level = i || 1;
  totalXP += Math.floor(100 * Math.pow(level, 1.5));
}
console.log("Total XP:", totalXP);
