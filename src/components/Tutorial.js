import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

const STEPS = [
  { title: '🛡️ Welcome to Code Defense!', desc: 'Your server is under attack by bugs! Write code to build defense towers.', color: colors.accent },
  { title: '📍 Place a Tower', desc: 'Towers have types: 🛡️Basic, ❄️Ice (slows), 🎯Sniper (high damage), ⚡MG (fast fire). Tap a [+] spot to build!', color: colors.warning },
  { title: '💻 Solve the Challenge', desc: 'A code challenge will pop up. Fill in the blank to activate the tower!', color: colors.success },
  { title: '⬆️ Upgrade Towers', desc: 'Tap an active tower to see its info. Solve more challenges to upgrade it (up to Lv.5)!', color: colors.success },
  { title: '🐛 Enemy Types', desc: 'Watch for 🏃Fast bugs, 🛡️Tank bugs, and 👾BOSS bugs! Each wave gets harder.', color: colors.danger },
  { title: '💪 Multiple Waves', desc: 'Higher levels have 2-4 waves. Survive them all to win!', color: colors.danger },
  { title: '🏆 Win the Level', desc: 'Complete all waves to win! Become a Code Master!', color: colors.primary },
];

export default function Tutorial({ onComplete }) {
  const [step, setStep] = useState(0);

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        <Text style={[styles.title, { color: STEPS[step].color }]}>
          {STEPS[step].title}
        </Text>
        <Text style={styles.desc}>{STEPS[step].desc}</Text>

        <View style={styles.illustration}>
          {step === 0 && <Text style={styles.emoji}>🛡️💻🐛</Text>}
          {step === 1 && <Text style={styles.emoji}>📍🛡️❄️🎯⚡</Text>}
          {step === 2 && <Text style={styles.emoji}>💻 ➜ ✅</Text>}
          {step === 3 && <Text style={styles.emoji}>⬆️ 1➜5</Text>}
          {step === 4 && <Text style={styles.emoji}>🏃🐛🛡️🐛👾</Text>}
          {step === 5 && <Text style={styles.emoji}>🌊🌊🌊🌊</Text>}
          {step === 6 && <Text style={styles.emoji}>🏆🎉</Text>}
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: STEPS[step].color }]}
          onPress={() => {
            if (step < STEPS.length - 1) setStep((s) => s + 1);
            else onComplete();
          }}
        >
          <Text style={styles.btnText}>
            {step < STEPS.length - 1 ? 'Next →' : "Let's Go! 🚀"}
          </Text>
        </TouchableOpacity>

        {step < STEPS.length - 1 && (
          <TouchableOpacity style={styles.skipBtn} onPress={onComplete}>
            <Text style={styles.skipText}>Skip tutorial</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center', alignItems: 'center', zIndex: 200,
  },
  modal: {
    width: '88%', maxWidth: 400,
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.xl - 4,
    borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center',
    elevation: 20, boxShadow: `0 8px 32px ${colors.primaryGlow}`,
  },
  dots: { flexDirection: 'row', marginBottom: 20, gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 24 },
  title: { fontSize: font.sizeTitle, fontWeight: 'bold', marginBottom: spacing.sm, textAlign: 'center' },
  desc: { color: colors.textDim, fontSize: font.sizeMd, lineHeight: 24, textAlign: 'center', marginBottom: 20 },
  illustration: { marginBottom: 20 },
  emoji: { fontSize: 40, textAlign: 'center' },
  btn: {
    paddingHorizontal: spacing.xl + 8,
    paddingVertical: spacing.sm + 6,
    borderRadius: radius.lg,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  btnText: { color: '#fff', fontSize: font.sizeLg + 1, fontWeight: 'bold' },
  skipBtn: { marginTop: spacing.sm + 2 },
  skipText: { color: colors.textMuted, fontSize: font.sizeSm },
});
