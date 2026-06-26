import { useRef, useCallback } from 'react';

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type = 'square', volume = 0.12) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration, volume = 0.06) {
  const ctx = getCtx();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

export default function useSound() {
  const playTowerFire = useCallback((towerType = 'normal') => {
    const freqs = { normal: 800, ice: 600, sniper: 200, mgun: 1200 };
    const freq = freqs[towerType] || 800;
    playTone(freq, 0.08, 'square', 0.08);
  }, []);

  const playEnemyHit = useCallback(() => {
    playTone(300, 0.06, 'sawtooth', 0.06);
  }, []);

  const playEnemyDestroyed = useCallback(() => {
    playTone(200, 0.15, 'square', 0.08);
    setTimeout(() => playTone(400, 0.1, 'square', 0.06), 60);
  }, []);

  const playWrongAnswer = useCallback(() => {
    playTone(150, 0.2, 'sawtooth', 0.12);
    setTimeout(() => playTone(120, 0.3, 'sawtooth', 0.1), 150);
  }, []);

  const playVictory = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'square', 0.08), i * 120);
    });
  }, []);

  const playGameOver = useCallback(() => {
    [400, 350, 300, 200].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sawtooth', 0.1), i * 200);
    });
  }, []);

  const playCountdownTick = useCallback(() => {
    playTone(1000, 0.05, 'square', 0.06);
  }, []);

  const playCountdownGo = useCallback(() => {
    playTone(1200, 0.2, 'square', 0.1);
  }, []);

  const playTowerPlace = useCallback(() => {
    playTone(500, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(700, 0.1, 'sine', 0.08), 80);
  }, []);

  const playUpgrade = useCallback(() => {
    [600, 800, 1000].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.12, 'sine', 0.08), i * 80);
    });
  }, []);

  return { playTowerFire, playEnemyHit, playEnemyDestroyed, playWrongAnswer, playVictory, playGameOver, playCountdownTick, playCountdownGo, playTowerPlace, playUpgrade };
}
