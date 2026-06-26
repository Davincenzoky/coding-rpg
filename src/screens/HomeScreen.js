import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import PlayerLevel from '../components/PlayerLevel';
import { loadPlayerData } from '../data/playerData';

const LINES = [
  { text: '> Initializing defense systems...', color: colors.success },
  { text: '> Loading code challenges...', color: colors.success },
  { text: '> WARNING: Bugs detected in the system!', color: colors.danger },
  { text: '' },
  { text: '> Mission: Write code to build towers', color: colors.accent },
  { text: '> Defend the server from incoming bugs!', color: colors.accent },
  { text: '' },
  { text: '> Ready to deploy? (Y/n)', color: colors.warning },
];

export default function HomeScreen({ onStart, onLeaderboard, onSettings, onAchievements, userEmail }) {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState('');
  const playerData = userEmail ? loadPlayerData(userEmail) : null;
  const [charIdx, setCharIdx] = useState(0);
  const [showBtns, setShowBtns] = useState(false);

  useEffect(() => {
    if (visible >= LINES.length) { setShowBtns(true); return; }
    const line = LINES[visible];
    if (!line.text) {
      const t = setTimeout(() => { setVisible(v => v + 1); setCharIdx(0); setTyping(''); }, 150);
      return () => clearTimeout(t);
    }
    if (charIdx < line.text.length) {
      const t = setTimeout(() => { setTyping(line.text.slice(0, charIdx + 1)); setCharIdx(i => i + 1); }, 25);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVisible(v => v + 1); setCharIdx(0); setTyping(''); }, 400);
    return () => clearTimeout(t);
  }, [visible, charIdx]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.badge}><Text style={styles.badgeText}>v1.0</Text></View>
      </View>

      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.sub}>A Coding Tower Defense RPG</Text>
      {playerData && <PlayerLevel xp={playerData.xp || 0} size="md" />}

      <View style={styles.terminal}>
        {LINES.slice(0, visible).map((l, i) => (
          l.text ? <Text key={i} style={[styles.termLine, { color: l.color || colors.success }]}>{l.text}</Text> : null
        ))}
        {visible < LINES.length && typing ? (
          <Text style={[styles.termLine, { color: (LINES[visible]?.color || colors.success) }]}>
            {typing}<Text style={styles.cursor}>|</Text>
          </Text>
        ) : null}
      </View>

      {showBtns ? (
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.primaryBtn} onPress={onStart} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>▶  PLAY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onLeaderboard}>
            <Text style={styles.secondaryBtnText}>🏆  Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onAchievements}>
            <Text style={styles.secondaryBtnText}>🏅  Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onSettings}>
            <Text style={styles.secondaryBtnText}>⚙️  Settings</Text>
          </TouchableOpacity>
        </View>
      ) : <View style={{ height: 160 }} />}

      <View style={styles.instructions}>
        <Text style={styles.instTitle}>HOW TO PLAY</Text>
        <View style={styles.instRow}>
          <Text style={styles.instNum}>1</Text>
          <Text style={styles.instText}>Select your <Text style={styles.hl}>tech stack</Text></Text>
        </View>
        <View style={styles.instRow}>
          <Text style={styles.instNum}>2</Text>
          <Text style={styles.instText}>Tap <Text style={styles.hl}>+</Text> to place a tower</Text>
        </View>
        <View style={styles.instRow}>
          <Text style={styles.instNum}>3</Text>
          <Text style={styles.instText}>Solve the <Text style={styles.hl}>code block</Text> challenge</Text>
        </View>
        <View style={styles.instRow}>
          <Text style={styles.instNum}>4</Text>
          <Text style={styles.instText}>Don't let bugs <Text style={styles.danger}>reach the end</Text>!</Text>
        </View>
      </View>

      {userEmail ? <Text style={styles.userInfo}>👤 {userEmail}</Text> : null}

      <View style={styles.footer}>
        <Text style={styles.footerText}>JavaScript  •  Python  •  HTML/CSS  •  SQL  •  React</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.bg, padding: spacing.lg, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  badgeRow: { width: '100%', alignItems: 'center', marginBottom: spacing.sm },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 1 },
  logo: { width: '100%', maxWidth: 320, height: 100, marginBottom: spacing.xs },
  sub: { color: colors.accent, fontSize: font.sizeSm, marginBottom: spacing.lg, marginTop: 4, letterSpacing: 1 },
  terminal: {
    backgroundColor: '#08081a', padding: spacing.md, borderRadius: radius.lg,
    width: '100%', maxWidth: 420, marginBottom: spacing.lg, minHeight: 180,
    borderWidth: 1, borderColor: colors.border,
  },
  termLine: { fontFamily: font.mono, fontSize: font.sizeSm, marginBottom: 4, lineHeight: 20 },
  cursor: { color: colors.success, opacity: 0.7 },
  btnGroup: { width: '100%', maxWidth: 360, marginBottom: spacing.lg, gap: 10 },
  primaryBtn: {
    backgroundColor: colors.primary, padding: 18, borderRadius: radius.lg, alignItems: 'center',
    elevation: 8, boxShadow: `0 4px 20px ${colors.primaryGlow}`,
  },
  primaryBtnText: { color: '#fff', fontSize: font.sizeXl, fontWeight: 'bold', letterSpacing: 1.5 },
  secondaryBtn: {
    backgroundColor: colors.bgCard, padding: 14, borderRadius: radius.lg, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.text, fontSize: font.sizeLg, fontWeight: 'bold' },
  instructions: {
    backgroundColor: colors.bgCard, padding: spacing.lg, borderRadius: radius.xl,
    width: '100%', maxWidth: 420, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  instTitle: { color: colors.warning, fontSize: font.sizeSm, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: spacing.md },
  instRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  instNum: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.bg,
    color: colors.textDim, fontSize: font.sizeXs, fontWeight: 'bold', textAlign: 'center', lineHeight: 22,
    marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  instText: { color: colors.textDim, fontSize: font.sizeSm, flex: 1 },
  hl: { color: colors.success, fontWeight: 'bold' },
  danger: { color: colors.danger, fontWeight: 'bold' },
  userInfo: { color: colors.textMuted, fontSize: font.sizeXs, marginBottom: spacing.sm },
  footer: { padding: spacing.sm },
  footerText: { color: colors.textMuted, fontSize: font.sizeXs, letterSpacing: 0.5 },
});
