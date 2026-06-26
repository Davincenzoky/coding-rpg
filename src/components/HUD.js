import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

export default function HUD({ score, lives, wave, totalWaves }) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>WAVE</Text>
        <Text style={styles.value}>{wave}/{totalWaves}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>LIVES</Text>
        <Text style={[styles.value, styles.livesText]}>{'❤️'.repeat(Math.max(0, lives))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.md, marginBottom: spacing.sm,
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    paddingVertical: 10, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  item: { flex: 1, alignItems: 'center' },
  label: { color: colors.textMuted, fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 1.5 },
  value: { color: colors.text, fontSize: font.sizeLg, fontWeight: 'bold', marginTop: 2 },
  livesText: { fontSize: font.sizeMd, letterSpacing: -2 },
  divider: { width: 1, height: 28, backgroundColor: colors.border, marginHorizontal: spacing.sm },
});
