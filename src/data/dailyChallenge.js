import TECH_STACKS from './levels';
import { generateLevel } from './levels';

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getDateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyTechStack() {
  const seed = getDateSeed();
  const rand = seededRandom(seed);
  const idx = Math.floor(rand() * TECH_STACKS.length);
  return TECH_STACKS[idx];
}

export function getDailyLevel() {
  const seed = getDateSeed();
  const rand = seededRandom(seed);
  const techIdx = Math.floor(rand() * TECH_STACKS.length);
  const levelNum = Math.floor(rand() * 100) + 1;
  const techStack = TECH_STACKS[techIdx];
  const level = generateLevel(techStack, levelNum);
  level.dailySeed = seed;
  return { techStack, level, levelNum };
}

export function getDailyLabel() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const ATTEMPT_KEY = 'coding_rpg_daily_attempt';

export function hasPlayedToday(email) {
  try {
    const raw = localStorage.getItem(ATTEMPT_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data.date === getDailyLabel() && data.email === email;
  } catch (e) {
    return false;
  }
}

export function markPlayedToday(email) {
  try {
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify({ date: getDailyLabel(), email }));
  } catch (e) {}
}
