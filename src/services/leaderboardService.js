import { collection, query, orderBy, limit, getDocs, getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { isOnline, queueScore as offlineQueue } from './syncService';

export function sanitizeEmail(email) {
  return email.replace(/[.#$\/\[\]]/g, '_');
}

const CACHED_LB_KEY = 'coding_rpg_cached_leaderboard';

function cacheLeaderboard(data) {
  try { localStorage.setItem(CACHED_LB_KEY, JSON.stringify(data)); } catch {}
}

function getCachedLeaderboard() {
  try {
    const raw = localStorage.getItem(CACHED_LB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function getProfile(email) {
  try {
    const ref = doc(db, 'leaderboard', sanitizeEmail(email));
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

export async function updateUsername(email, username) {
  try {
    const ref = doc(db, 'leaderboard', sanitizeEmail(email));
    await setDoc(ref, { email, username }, { merge: true });
  } catch (e) {
    console.error('Error updating username:', e);
  }
}

export async function saveScore(email, score, level, techStack) {
  if (!isOnline()) {
    offlineQueue(email, score, level, techStack);
    return;
  }
  try {
    const docId = sanitizeEmail(email);
    const ref = doc(db, 'leaderboard', docId);
    const existing = await getDoc(ref);

    if (existing.exists()) {
      const data = existing.data();
      if (score > (data.bestScore || 0)) {
        await setDoc(ref, {
          email,
          bestScore: score,
          bestLevel: level,
          bestTech: techStack,
          plays: (data.plays || 0) + 1,
          lastPlayed: serverTimestamp(),
          totalScore: (data.totalScore || 0) + score,
        });
      } else {
        await setDoc(ref, {
          ...data,
          plays: (data.plays || 0) + 1,
          lastPlayed: serverTimestamp(),
          totalScore: (data.totalScore || 0) + score,
        }, { merge: true });
      }
    } else {
      await setDoc(ref, {
        email,
        username: email.split('@')[0],
        bestScore: score,
        bestLevel: level,
        bestTech: techStack,
        plays: 1,
        lastPlayed: serverTimestamp(),
        totalScore: score,
      });
    }
  } catch (e) {
    console.error('Error saving score:', e);
  }
}

export async function getLeaderboard(limitCount = 20) {
  try {
    if (!isOnline()) {
      const cached = getCachedLeaderboard();
      if (cached) return cached;
      return [];
    }
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('bestScore', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc, i) => ({
      rank: i + 1,
      id: doc.id,
      ...doc.data(),
    }));
    cacheLeaderboard(data);
    return data;
  } catch (e) {
    console.error('Error fetching leaderboard:', e);
    const cached = getCachedLeaderboard();
    return cached || [];
  }
}
