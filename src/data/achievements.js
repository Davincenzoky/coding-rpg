export const ACHIEVEMENTS = [
  { id: 'first_win',     title: 'First Victory',   desc: 'Complete your first level',         icon: '🏆',   threshold: 1 },
  { id: 'tower_master',  title: 'Tower Master',    desc: 'Activate all towers in one level',   icon: '🛡️',  threshold: 1 },
  { id: 'no_hitter',     title: 'No-Hitter',       desc: 'Win a level without losing a life',  icon: '💎',   threshold: 1 },
  { id: 'collector',     title: 'Collector',       desc: 'Build one of each tower type',       icon: '🎯',   threshold: 4 },
  { id: 'upgrader',      title: 'Upgrader',        desc: 'Upgrade a tower to max level',       icon: '⬆️',  threshold: 1 },
  { id: 'persistent',    title: 'Persistent',      desc: 'Complete 10 levels',                 icon: '🔥',   threshold: 10 },
  { id: 'code_ninja',    title: 'Code Ninja',      desc: 'Complete 50 levels',                 icon: '🥷',   threshold: 50 },
  { id: 'unstoppable',   title: 'Unstoppable',      desc: 'Complete 100 levels',                icon: '👑',   threshold: 100 },
  { id: 'five_streak',   title: 'On Fire!',        desc: 'Win 5 levels in a row',              icon: '🔥',   threshold: 5 },
  { id: 'perfect_level', title: 'Perfect Score',   desc: 'Win with all lives and all towers',  icon: '⭐',   threshold: 1 },
];

const STORAGE_KEY = 'coding_rpg_achievements';

function getStorageKey(email) {
  return `${STORAGE_KEY}_${email}`;
}

export function loadAchievements(email) {
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

export function saveAchievements(email, data) {
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(data));
  } catch (e) {}
}

export function checkAndUnlockAchievements(email, earned, currentData) {
  const data = currentData || loadAchievements(email);
  let newUnlock = null;
  for (const ach of ACHIEVEMENTS) {
    if (data[ach.id]) continue;
    const earnedVal = earned[ach.id];
    if (earnedVal != null && earnedVal >= ach.threshold) {
      data[ach.id] = Date.now();
      newUnlock = ach;
    }
  }
  saveAchievements(email, data);
  return { data, newUnlock };
}
