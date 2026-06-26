import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { getLevel, getLevelProgress } from '../data/playerData';

export default function PlayerLevel({ xp = 0, size = 'md' }) {
  const level = getLevel(xp);
  const progress = getLevelProgress(xp);
  const barWidth = `${Math.round(progress * 100)}%`;

  return (
    <View style={[styles.container, size === 'sm' && styles.containerSm]}>
      <View style={[styles.badge, size === 'sm' && styles.badgeSm]}>
        <Text style={[styles.levelText, size === 'sm' && styles.levelTextSm]}>
          Lv.{level}
        </Text>
      </View>
      {size !== 'sm' && (
        <View style={styles.barWrap}>
          <View style={styles.barOuter}>
            <View style={[styles.barInner, { width: barWidth }]} />
          </View>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  containerSm: { gap: 4 },
  badge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeSm: { paddingHorizontal: 6, paddingVertical: 1 },
  levelText: { color: '#000', fontSize: font.sizeSm, fontWeight: 'bold' },
  levelTextSm: { fontSize: 10 },
  barWrap: { flex: 1 },
  barOuter: {
    height: 6,
    backgroundColor: colors.bgDark,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  barInner: {
    height: '100%',
    backgroundColor: colors.warning,
    borderRadius: radius.sm,
  },
  xpText: { color: colors.textMuted, fontSize: font.sizeXs, marginTop: 2 },
});
