import { saveScore } from './leaderboardService';

const QUEUE_KEY = 'coding_rpg_sync_queue';

function getQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveQueue(queue) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch {}
}

export function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

export function queueScore(email, score, level, techStack) {
  const queue = getQueue();
  queue.push({ email, score, level, techStack, ts: Date.now() });
  saveQueue(queue);
}

export async function syncPendingScores() {
  if (!isOnline()) return { synced: 0, remaining: 0 };
  const queue = getQueue();
  if (queue.length === 0) return { synced: 0, remaining: 0 };
  let synced = 0;
  const failed = [];
  for (const item of queue) {
    try {
      await saveScore(item.email, item.score, item.level, item.techStack);
      synced++;
    } catch {
      failed.push(item);
    }
  }
  saveQueue(failed);
  return { synced, remaining: failed.length };
}

export function getPendingCount() {
  return getQueue().length;
}
