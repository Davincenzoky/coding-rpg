import { collection, query, orderBy, limit, getDocs, getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export function sanitizeEmail(email) {
  return email.replace(/[.#$\/\[\]]/g, '_');
}

export function dailyDocId(email, dateLabel) {
  return `daily_${dateLabel}_${sanitizeEmail(email)}`;
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

export async function saveDailyScore(email, score, dateLabel) {
  try {
    const docId = dailyDocId(email, dateLabel);
    const ref = doc(db, 'dailyLeaderboard', dateLabel, 'scores', docId);
    const existing = await getDoc(ref);
    if (!existing.exists() || score > (existing.data().score || 0)) {
      await setDoc(ref, {
        email, score, username: email.split('@')[0],
        date: dateLabel, timestamp: serverTimestamp(),
      });
    }
  } catch (e) {
    console.error('Error saving daily score:', e);
  }
}

export async function getDailyLeaderboard(dateLabel, limitCount = 20) {
  try {
    const q = query(
      collection(db, 'dailyLeaderboard', dateLabel, 'scores'),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, i) => ({
      rank: i + 1, id: doc.id, ...doc.data(),
    }));
  } catch (e) {
    console.error('Error fetching daily leaderboard:', e);
    return [];
  }
}

export async function saveScore(email, score, level, techStack) {
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
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('bestScore', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, i) => ({
      rank: i + 1,
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error('Error fetching leaderboard:', e);
    return [];
  }
}
