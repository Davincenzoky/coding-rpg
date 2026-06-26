import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { getDailyLevel, getDailyLabel, markPlayedToday } from '../data/dailyChallenge';
import { saveDailyScore } from '../services/leaderboardService';
import ResponsiveContainer from '../components/ui/ResponsiveContainer';
import HUD from '../components/HUD';
import GameBoard from '../components/GameBoard';
import CodeChallenge from '../components/CodeChallenge';
import Confetti from '../components/Confetti';
import AnimatedNumber from '../components/AnimatedNumber';
import useSound from '../hooks/useSound';
import { awardXp, loadPlayerData } from '../data/playerData';
import AchievementPopup from '../components/AchievementPopup';
import LevelUpPopup from '../components/LevelUpPopup';
import { ACHIEVEMENTS, loadAchievements, checkAndUnlockAchievements } from '../data/achievements';
import {
  createInitialState, updateGame, startWave,
  getDistance, getCellCenter, CELL_SIZE, TOWER_TYPES,
} from '../utils/gameEngine';

const WAVE_DELAY = 4000;
const COUNTDOWN_TICK = 1000;

export default function DailyChallengeScreen({ userEmail, onBack }) {
  const { playTowerFire, playEnemyHit, playEnemyDestroyed, playWrongAnswer, playVictory, playGameOver, playCountdownTick, playCountdownGo, playTowerPlace, playUpgrade } = useSound();
  const { techStack, level, levelNum } = getDailyLevel();
  const dateLabel = getDailyLabel();
  const [state, setState] = useState(() => createInitialState(level));
  const [projectiles, setProjectiles] = useState([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeTower, setChallengeTower] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [towerRanges, setTowerRanges] = useState([]);
  const [waveCountdown, setWaveCountdown] = useState(null);
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [newAchievement, setNewAchievement] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);
  const [builtTypes, setBuiltTypes] = useState(new Set());
  const [started, setStarted] = useState(false);
  const streakRef = useRef(0);
  const totalWinsRef = useRef(0);
  const barAnim = useRef(new Animated.Value(1)).current;
  const countdownScale = useRef(new Animated.Value(1.5)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const stateRef = useRef(state);
  const projIdRef = useRef(0);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  stateRef.current = state;

  function showMessage(msg, type = 'info') {
    setGameMessage(msg); setMessageType(type);
    Animated.sequence([
      Animated.timing(messageOpacity, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.delay(1800),
      Animated.timing(messageOpacity, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start(() => setGameMessage(''));
  }

  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => setStarted(true), 500);
      return () => clearTimeout(t);
    }
  }, [started]);

  useEffect(() => {
    if (state.gameOver || state.victory || !started) return;
    if (!state.waveInProgress && state.wave < state.level.waves.length && !showChallenge) {
      const nextWave = state.wave + 1;
      setWaveCountdown(nextWave);
      setCountdownNumber(5);
      barAnim.setValue(1); countdownScale.setValue(1.5);
      Animated.timing(barAnim, { toValue: 0, duration: WAVE_DELAY, useNativeDriver: false }).start();
      let tick = 5;
      const ticker = setInterval(() => {
        tick--;
        if (tick > 0) { playCountdownTick(); setCountdownNumber(tick); countdownScale.setValue(1.5); Animated.spring(countdownScale, { toValue: 1, friction: 3, useNativeDriver: false }).start(); }
        else { playCountdownGo(); setCountdownNumber('GO!'); countdownScale.setValue(2); Animated.spring(countdownScale, { toValue: 1, friction: 2, useNativeDriver: false }).start(); }
      }, COUNTDOWN_TICK);
      const t = setTimeout(() => {
        clearInterval(ticker); setWaveCountdown(null); setCountdownNumber(null);
        setState((prev) => startWave(prev));
        if (nextWave > 1) showMessage(`Wave ${nextWave} started!`, 'warning');
      }, WAVE_DELAY);
      return () => { clearTimeout(t); clearInterval(ticker); };
    }
  }, [state.waveInProgress, state.wave, state.gameOver, state.victory, showChallenge, started]);

  useEffect(() => {
    if (!state.waveInProgress || state.gameOver || state.victory) return;
    let running = true;
    function loop() {
      if (!running) return;
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      setState((prev) => { let u = updateGame(prev, dt); u = fireTowers(u); return u; });
      setProjectiles((prev) => {
        const currentEnemies = stateRef.current.enemies;
        return prev.map((p) => {
          const target = currentEnemies.find((e) => e.id === p.targetId && e.alive);
          if (!target) return { ...p, dead: true };
          const dx = target.x - p.x, dy = target.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250 * dt + 8) {
            const dmg = p.damage || 1;
            setState((s) => {
              const target = s.enemies.find(e => e.id === p.targetId);
              const willDie = target && (target.health - dmg <= 0);
              if (willDie) playEnemyDestroyed(); else playEnemyHit();
              return { ...s, score: s.score + Math.round(dmg * 5), enemies: s.enemies.map((e) => e.id === p.targetId ? { ...e, health: e.health - dmg, alive: e.health - dmg > 0 } : e) };
            });
            return { ...p, dead: true };
          }
          return { ...p, x: p.x + (dx / dist) * 250 * dt, y: p.y + (dy / dist) * 250 * dt };
        }).filter((p) => !p.dead);
      });
      frameRef.current = requestAnimationFrame(loop);
    }
    lastTimeRef.current = Date.now();
    frameRef.current = requestAnimationFrame(loop);
    return () => { running = false; if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [state.waveInProgress, state.gameOver, state.victory]);

  useEffect(() => {
    if (state.lives <= 0 && !state.gameOver) { playGameOver(); streakRef.current = 0; setState((prev) => ({ ...prev, gameOver: true })); }
  }, [state.lives]);

  useEffect(() => {
    if (state.victory) {
      playVictory();
      totalWinsRef.current += 1; streakRef.current += 1;
      markPlayedToday(userEmail);
      if (userEmail) saveDailyScore(userEmail, state.score, dateLabel);
      if (userEmail) {
        const achData = loadAchievements(userEmail);
        const allTowersSolved = state.towers.every((t) => t.solved);
        const hasUpgrade = state.towers.some((t) => t.level >= 5);
        const noHitter = state.lives === 10;
        const allTypes = ['normal', 'ice', 'sniper', 'mgun'].every((t) => builtTypes.has(t));
        const earned = { first_win: totalWinsRef.current, tower_master: allTowersSolved ? 1 : 0, no_hitter: noHitter ? 1 : 0, collector: allTypes ? 4 : builtTypes.size, upgrader: hasUpgrade ? 1 : 0, persistent: totalWinsRef.current, code_ninja: totalWinsRef.current, unstoppable: totalWinsRef.current, five_streak: streakRef.current, perfect_level: (noHitter && allTowersSolved) ? 1 : 0 };
        const { newUnlock } = checkAndUnlockAchievements(userEmail, earned, achData);
        if (newUnlock) setNewAchievement(newUnlock);
        const xpTotal = levelNum * 10 + state.towers.filter(t => t.solved).length * 5 + state.lives * 2;
        const result = awardXp(userEmail, xpTotal, techStack?.id);
        if (result.leveledUp) setLevelUpData(result);
      }
    }
  }, [state.victory]);

  function fireTowers(currentState) {
    const { towers, enemies } = currentState;
    const newTowers = towers.map((t) => {
      if (!t.solved) return t;
      const tType = TOWER_TYPES[t.type] || TOWER_TYPES.normal;
      if ((t.cooldown || 0) > 0) return { ...t, cooldown: t.cooldown - 0.016 };
      const center = getCellCenter(t.x, t.y);
      const range = t.range + (t.level - 1) * 0.3;
      const damage = t.damage + (t.level - 1) * 0.5;
      const target = enemies.find((e) => e.alive && getDistance(center.x, center.y, e.x, e.y) < range * CELL_SIZE);
      if (target) {
        playTowerFire(t.type);
        projIdRef.current++;
        setProjectiles((prev) => [...prev, { id: projIdRef.current, x: center.x, y: center.y, targetId: target.id, damage, towerType: t.type }]);
        return { ...t, cooldown: tType.cooldown };
      }
      return t;
    });
    return { ...currentState, towers: newTowers };
  }

  function handleTowerPress(spot, tower) {
    if (showChallenge) return;
    if (tower && tower.solved) {
      if (towerRanges.length) setTowerRanges([]);
      else { const tType = TOWER_TYPES[tower.type] || TOWER_TYPES.normal; showMessage(`${tType.label} Lv.${tower.level} | ${tower.solves} solves`, 'info'); setTowerRanges([{ x: spot.x, y: spot.y }]); }
      return;
    }
    const challenge = level.challenges.find((c) => tower?.challenge?.id === c.id) || level.challenges[Math.min(spot.x, level.challenges.length - 1)];
    setCurrentChallenge(challenge);
    setChallengeTower({ spot, towerIndex: level.towerSpots.indexOf(spot) });
    setShowChallenge(true);
  }

  function handleSolve(reward) {
    setState((prev) => {
      const newTowers = prev.towers.map((t, i) => {
        if (i !== challengeTower.towerIndex) return t;
        const wasSolved = t.solved;
        return { ...t, solved: true, cooldown: 0, level: wasSolved ? Math.min(t.level + 1, 5) : t.level, solves: wasSolved ? (t.solves || 0) + 1 : (t.solves || 0), damage: t.damage + 0.5, range: t.range + 0.3 };
      });
      return { ...prev, towers: newTowers, score: prev.score + reward };
    });
    setShowChallenge(false); setCurrentChallenge(null);
    const tower = challengeTower ? stateRef.current.towers[challengeTower.towerIndex] : null;
    if (tower?.solved) { playUpgrade(); showMessage(`+${reward} pts! Tower upgraded to Lv.${tower.level + 1}!`, 'success'); }
    else { const towerData = stateRef.current.towers[challengeTower.towerIndex]; if (towerData?.type) setBuiltTypes((prev) => new Set([...prev, towerData.type])); playTowerPlace(); showMessage(`+${reward} pts! Tower activated!`, 'success'); }
  }

  function handleFail() { playWrongAnswer(); setState((prev) => ({ ...prev, lives: prev.lives - 1 })); showMessage('Wrong! -1 Life', 'error'); setShowChallenge(false); setCurrentChallenge(null); }
  function handleChallengeClose() { showMessage('Tower not placed', 'info'); setShowChallenge(false); setCurrentChallenge(null); }
  function handleRetry() { setState(createInitialState(level)); setProjectiles([]); setShowChallenge(false); setCurrentChallenge(null); setGameMessage(''); setWaveCountdown(null); }
  const playerXp = userEmail ? (loadPlayerData(userEmail).xp || 0) : 0;

  if (state.gameOver) {
    return (
      <View style={styles.overlayScreen}>
        <View style={styles.resultCard}>
          <Text style={styles.dailyBadge}>Daily Challenge</Text>
          <Text style={styles.gameOverEmoji}>💀</Text>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.resultSub}>Score: {state.score}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}><AnimatedNumber value={state.score} duration={1200} style={styles.statValue} /><Text style={styles.statLabel}>Score</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>{levelNum}</Text><Text style={styles.statLabel}>Level</Text></View>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.menuBtn} onPress={onBack}><Text style={styles.menuBtnText}>Back to Menu</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (state.victory) {
    return (
      <View style={styles.overlayScreen}>
        <Confetti />
        <View style={styles.resultCard}>
          <Text style={styles.dailyBadge}>Daily Challenge</Text>
          <Text style={styles.victoryEmoji}>🏆</Text>
          <Text style={styles.victoryText}>VICTORY!</Text>
          <Text style={styles.resultSub}>Score: {state.score}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}><AnimatedNumber value={state.score} duration={1200} style={styles.statValue} /><Text style={styles.statLabel}>Score</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>{state.lives}</Text><Text style={styles.statLabel}>Lives</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>{state.towers.filter(t => t.solved).length}</Text><Text style={styles.statLabel}>Towers</Text></View>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.menuBtn} onPress={onBack}><Text style={styles.menuBtnText}>Back to Menu</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.exitBtn} onPress={onBack}><Text style={styles.exitBtnText}>← Exit</Text></TouchableOpacity>
        <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>Daily Challenge</Text><Text style={styles.tierText}>{dateLabel}</Text></View>
        <View style={styles.exitBtn} />
      </View>
      {!started ? (
        <View style={styles.loadingWrap}><Text style={styles.loadingText}>Generating challenge...</Text></View>
      ) : (
        <>
          {levelUpData && <LevelUpPopup newLevel={levelUpData.newLevel} onDone={() => setLevelUpData(null)} />}
          {newAchievement && <AchievementPopup achievement={newAchievement} onDone={() => setNewAchievement(null)} />}
          <HUD score={state.score} lives={state.lives} wave={state.wave} totalWaves={state.level.waves.length} enemyCount={state.enemies.filter(e => e.alive).length} towerCount={state.towers.filter(t => t.solved).length} xp={playerXp} />
          {gameMessage && <Animated.View style={[styles.messageBar, messageType === 'success' && styles.messageSuccess, messageType === 'error' && styles.messageError, { opacity: messageOpacity }]}><Text style={styles.messageText}>{gameMessage}</Text></Animated.View>}
          {waveCountdown && (
            <View style={styles.countdownOverlay}>
              <View style={styles.countdownBox}>
                <Animated.Text style={[styles.countdownNum, { transform: [{ scale: countdownScale }] }, countdownNumber === 'GO!' && styles.goText]}>{countdownNumber}</Animated.Text>
                <Text style={styles.countdownLabel}>{countdownNumber === 'GO!' ? 'Defend!' : `Wave ${waveCountdown}`}</Text>
                <View style={styles.countdownBarOuter}><Animated.View style={[styles.countdownBarInner, { width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /></View>
              </View>
            </View>
          )}
          {!state.waveInProgress && state.wave === 0 && !showChallenge && <View style={styles.helpBar}><Text style={styles.helpText}>👆 Tap a <Text style={styles.helpHighlight}>+</Text> spot to build!</Text></View>}
          <GameBoard level={level} enemies={state.enemies} towers={state.towers} projectiles={projectiles} onTowerPress={handleTowerPress} towerRanges={towerRanges} />
          {showChallenge && currentChallenge && <CodeChallenge challenge={currentChallenge} onSolve={handleSolve} onFail={handleFail} onClose={handleChallengeClose} />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 4 },
  exitBtn: { width: 70 },
  exitBtnText: { color: colors.textDim, fontSize: font.sizeMd, fontWeight: 'bold' },
  levelBadge: { backgroundColor: colors.bgCard, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.warning },
  levelBadgeText: { color: colors.warning, fontSize: font.sizeSm, fontWeight: 'bold' },
  tierText: { color: colors.textDim, fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 1, marginTop: 2, textAlign: 'center' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: colors.textDim, fontSize: font.sizeLg },
  overlayScreen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  resultCard: { backgroundColor: colors.bgCard, borderRadius: radius.xl, padding: spacing.xl, width: '85%', maxWidth: 380, alignItems: 'center', borderWidth: 2, borderColor: colors.warning },
  dailyBadge: { color: colors.warning, fontSize: font.sizeSm, fontWeight: 'bold', letterSpacing: 1, marginBottom: spacing.sm },
  gameOverEmoji: { fontSize: 64, marginBottom: spacing.sm },
  victoryEmoji: { fontSize: 64, marginBottom: spacing.sm },
  gameOverText: { color: colors.primary, fontSize: 40, fontWeight: 'bold' },
  victoryText: { color: colors.success, fontSize: 40, fontWeight: 'bold' },
  resultSub: { color: colors.textDim, fontSize: font.sizeLg, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: spacing.lg },
  stat: { alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: colors.textDim, fontSize: font.sizeSm, marginTop: 2 },
  btnGroup: { gap: 10, width: '100%' },
  menuBtn: { backgroundColor: colors.bgCard2, padding: 14, borderRadius: radius.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  menuBtnText: { color: colors.textDim, fontSize: font.sizeLg, fontWeight: 'bold' },
  messageBar: { backgroundColor: 'rgba(79,195,247,0.12)', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center', marginHorizontal: spacing.md, borderRadius: radius.md, marginBottom: 4 },
  messageSuccess: { backgroundColor: 'rgba(76,175,80,0.12)' },
  messageError: { backgroundColor: 'rgba(255,107,107,0.12)' },
  messageText: { color: colors.text, fontSize: font.sizeMd, fontWeight: 'bold' },
  countdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', zIndex: 50 },
  countdownBox: { backgroundColor: colors.bgCard, borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', borderWidth: 2, borderColor: colors.primary, width: '80%', maxWidth: 360 },
  countdownNum: { color: colors.primary, fontSize: 80, fontWeight: 'bold', lineHeight: 90, textShadow: `0 0 40px ${colors.primaryGlow}` },
  goText: { color: colors.success, fontSize: 48, textShadow: `0 0 40px ${colors.success}66` },
  countdownLabel: { color: colors.textDim, fontSize: font.sizeLg, marginBottom: spacing.lg, marginTop: spacing.sm },
  countdownBarOuter: { width: '100%', height: 6, backgroundColor: colors.bgDark, borderRadius: radius.sm, overflow: 'hidden' },
  countdownBarInner: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.sm },
  helpBar: { padding: spacing.sm, alignItems: 'center' },
  helpText: { color: colors.warning, fontSize: font.sizeMd, fontWeight: 'bold' },
  helpHighlight: { color: colors.primary, fontSize: 18 },
});
