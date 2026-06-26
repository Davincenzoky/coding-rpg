import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import PlayerLevel from '../components/PlayerLevel';
import OnlineStatusBar from '../components/OnlineStatusBar';
import { loadPlayerData } from '../data/playerData';
import { getVersion } from '../data/version';

function buildLines() {
  return [
    { text: '> Initializing defense systems...', color: colors.success },
    { text: '> Loading code challenges...', color: colors.success },
    { text: '> WARNING: Bugs detected in the system!', color: colors.danger },
    { text: '' },
    { text: '> Defend the server from incoming bugs!', color: colors.accent },
    { text: '' },
    { text: '> Ready to deploy? (Y/n)', color: colors.warning },
  ];
}

export default function HomeScreen({ onStart, onLeaderboard, onSettings, onAchievements, userEmail, isGuest }) {
  const LINES = buildLines();
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState('');
  const playerData = userEmail ? loadPlayerData(userEmail) : null;
  const [charIdx, setCharIdx] = useState(0);
  const [showBtns, setShowBtns] = useState(false);

  useEffect(() => {
    if (visible >= LINES.length) { setShowBtns(true); return; }
    const line = LINES[visible];
    if (!line.text) {
      const t = setTimeout(() => { setVisible(v => v + 1); setCharIdx(0); setTyping(''); }, 60);
      return () => clearTimeout(t);
    }
    if (charIdx < line.text.length) {
      const t = setTimeout(() => { setTyping(line.text.slice(0, charIdx + 1)); setCharIdx(i => i + 1); }, 10);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVisible(v => v + 1); setCharIdx(0); setTyping(''); }, 150);
    return () => clearTimeout(t);
  }, [visible, charIdx]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <OnlineStatusBar />
      <ScrollView contentContainerStyle={styles.container}>
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
          <View style={styles.rowBtns}>
            <TouchableOpacity style={[styles.secondaryBtn, styles.halfBtn]} onPress={onLeaderboard}>
              <Text style={styles.secondaryBtnText}>🏆  Leaderboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryBtn, styles.halfBtn]} onPress={onAchievements}>
              <Text style={styles.secondaryBtnText}>🏅  Achievements</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onSettings}>
            <Text style={styles.secondaryBtnText}>⚙️  Settings</Text>
          </TouchableOpacity>
        </View>
      ) : <View style={{ height: 160 }} />}

      {userEmail ? <Text style={styles.userInfo}>👤 {isGuest ? 'Guest' : userEmail}</Text> : null}

      <View style={styles.badgeRow}>
        <View style={styles.badge}><Text style={styles.badgeText}>{getVersion()}</Text></View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>JavaScript  •  Python  •  HTML/CSS  •  SQL  •  React</Text>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  badgeRow: { width: '100%', alignItems: 'center', marginVertical: spacing.sm },
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
  rowBtns: { flexDirection: 'row', gap: 10 },
  halfBtn: { flex: 1 },
  secondaryBtnText: { color: colors.text, fontSize: font.sizeLg, fontWeight: 'bold' },

  userInfo: { color: colors.textMuted, fontSize: font.sizeXs, marginBottom: spacing.sm },
  footer: { padding: spacing.sm },
  footerText: { color: colors.textMuted, fontSize: font.sizeXs, letterSpacing: 0.5 },
});
