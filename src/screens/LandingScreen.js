import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

const HERO_LINES = [
  '> System: CodingRPG v2.0 loaded',
  '> Mission: Defend the server from code bugs',
  '> Status: Ready for deployment',
];

const FEATURES = [
  { icon: '🛡️', title: 'Tower Defense', desc: 'Place towers on the grid to stop incoming bugs. Each tower auto-fires at passing enemies.' },
  { icon: '💻', title: 'Code Challenges', desc: 'Fill in the blanks with the correct code syntax. Test your knowledge of JS, Python, SQL, and more.' },
  { icon: '⬆️', title: 'Upgrade System', desc: 'Solve challenges to activate and upgrade towers up to level 5 for increased damage and range.' },
  { icon: '❄️🎯⚡', title: 'Tower Types', desc: 'Basic, Ice (slows), Sniper (high damage), and Machine Gun (fast fire). Each has unique strengths.' },
  { icon: '🏆', title: 'Achievements & XP', desc: 'Earn achievements, gain XP, and level up. Compete on the leaderboard for the top score.' },
  { icon: '🌙', title: 'Dark/Light Theme', desc: 'Switch between dark and light mode. Your preference is saved between sessions.' },
];

const STACKS = ['JavaScript', 'Python', 'HTML/CSS', 'SQL', 'React'];

export default function LandingScreen({ onGetStarted }) {
  const [visibleLine, setVisibleLine] = useState(0);
  const [typing, setTyping] = useState('');
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (visibleLine >= HERO_LINES.length) return;
    const line = HERO_LINES[visibleLine];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setTyping(line.slice(0, charIdx + 1));
        setCharIdx(i => i + 1);
      }, 20);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleLine(v => v + 1);
      setCharIdx(0);
      setTyping('');
    }, 300);
    return () => clearTimeout(t);
  }, [visibleLine, charIdx]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.terminal}>
          {HERO_LINES.slice(0, visibleLine).map((l, i) => (
            <Text key={i} style={styles.termLine}>{l}</Text>
          ))}
          {visibleLine < HERO_LINES.length && typing ? (
            <Text style={styles.termLine}>
              {typing}<Text style={styles.cursor}>|</Text>
            </Text>
          ) : null}
          {visibleLine >= HERO_LINES.length && (
            <Text style={styles.termLineDone}>> Ready to deploy! <Text style={styles.blink}>▌</Text></Text>
          )}
        </View>

        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heroSub}>A Coding Tower Defense RPG</Text>
        <Text style={styles.heroDesc}>
          Defend your server from bugs by solving code challenges.
          Master 5 programming languages across 100 levels.
        </Text>

        <TouchableOpacity style={styles.ctaBtn} onPress={onGetStarted} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>▶  Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Tech Stacks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tech Stacks</Text>
        <View style={styles.stackRow}>
          {STACKS.map(s => (
            <View key={s} style={styles.stackBadge}>
              <Text style={styles.stackText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How it Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.steps}>
          {[
            { num: '1', text: 'Choose a tech stack and level' },
            { num: '2', text: 'Tap a [+] spot to place a tower' },
            { num: '3', text: 'Solve the code challenge to activate it' },
            { num: '4', text: 'Towers auto-fire at passing bugs' },
            { num: '5', text: 'Survive all waves to win!' },
          ].map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{s.num}</Text>
              </View>
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Defend?</Text>
        <Text style={styles.ctaDesc}>Start your coding journey today. No account needed to play — just sign up to save your progress.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={onGetStarted} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>▶  Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>CodingRPG &copy; 2026</Text>
        <Text style={styles.footerSub}>Built with React Native + Firebase</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 60 },
  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  terminal: {
    backgroundColor: '#08081a',
    padding: spacing.md,
    borderRadius: radius.lg,
    width: '100%',
    maxWidth: 460,
    minHeight: 90,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  termLine: { color: colors.success, fontSize: font.sizeSm, fontFamily: font.mono, marginBottom: 4, lineHeight: 20 },
  termLineDone: { color: colors.warning, fontSize: font.sizeSm, fontFamily: font.mono, marginBottom: 4, lineHeight: 20 },
  cursor: { color: colors.success, opacity: 0.7 },
  blink: { opacity: 0.5 },
  logo: { width: '100%', maxWidth: 400, height: 100, marginBottom: spacing.sm },
  heroSub: {
    color: colors.accent,
    fontSize: font.sizeLg,
    marginTop: spacing.sm,
    textAlign: 'center',
    letterSpacing: 1,
  },
  heroDesc: {
    color: colors.textDim,
    fontSize: font.sizeMd,
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 24,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl + 16,
    borderRadius: radius.lg,
    elevation: 8,
    boxShadow: `0 4px 24px ${colors.primaryGlow}`,
  },
  ctaBtnText: { color: '#fff', fontSize: font.sizeXl, fontWeight: 'bold', letterSpacing: 1 },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: font.sizeXxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  stackBadge: {
    backgroundColor: colors.bgCard,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  stackText: { color: colors.primary, fontSize: font.sizeMd, fontWeight: 'bold' },
  featureGrid: {
    gap: spacing.md,
  },
  featureCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: { fontSize: 28, marginBottom: spacing.sm },
  featureTitle: { color: colors.text, fontSize: font.sizeLg, fontWeight: 'bold', marginBottom: spacing.xs },
  featureDesc: { color: colors.textDim, fontSize: font.sizeSm, lineHeight: 20 },
  steps: { gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumText: { color: '#fff', fontSize: font.sizeMd, fontWeight: 'bold' },
  stepText: { color: colors.textDim, fontSize: font.sizeMd, flex: 1 },
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
  },
  ctaTitle: { color: colors.text, fontSize: font.sizeXxl, fontWeight: 'bold', textAlign: 'center' },
  ctaDesc: {
    color: colors.textDim,
    fontSize: font.sizeMd,
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 22,
    marginVertical: spacing.md,
  },
  footer: { alignItems: 'center', padding: spacing.lg, marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: font.sizeSm },
  footerSub: { color: colors.textMuted, fontSize: font.sizeXs, marginTop: 4 },
});
