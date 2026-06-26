const STORAGE_KEY = 'coding_rpg_player';

function getKey(email) {
  return `${STORAGE_KEY}_${email}`;
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
  19200, 21200, 23300, 25500, 27800, 30200, 32700, 35300, 38000, 40000,
];

export function getLevel(xp) {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
  }
  return Math.min(level, LEVEL_THRESHOLDS.length);
}

export function getLevelProgress(xp) {
  const level = getLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || (currentThreshold + 1000);
  const progress = (xp - currentThreshold) / (nextThreshold - currentThreshold);
  return Math.min(Math.max(progress, 0), 1);
}

export function loadPlayerData(email) {
  try {
    const raw = localStorage.getItem(getKey(email));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { xp: 0, totalScore: 0, levelsCompleted: 0, techStacksUsed: [] };
}

export function savePlayerData(email, data) {
  try {
    localStorage.setItem(getKey(email), JSON.stringify(data));
  } catch (e) {}
}

export function markStackCompleted(email, techStackId) {
  const data = loadPlayerData(email);
  const completed = data.completedStacks || [];
  if (completed.includes(techStackId)) return data;
  completed.push(techStackId);
  data.completedStacks = completed;
  savePlayerData(email, data);
  return data;
}

export function isStackUnlocked(stack, email) {
  if (!stack.unlockRequirement) return true;
  const data = loadPlayerData(email);
  const completed = data.completedStacks || [];
  return completed.length >= 1;
}

export function awardXp(email, amount, techStackId) {
  const data = loadPlayerData(email);
  const prevLevel = getLevel(data.xp);
  data.xp += amount;
  data.totalScore += amount;
  data.levelsCompleted = (data.levelsCompleted || 0) + 1;
  if (techStackId && !data.techStacksUsed.includes(techStackId)) {
    data.techStacksUsed.push(techStackId);
  }
  savePlayerData(email, data);
  const newLevel = getLevel(data.xp);
  return { data, leveledUp: newLevel > prevLevel, newLevel };
}
