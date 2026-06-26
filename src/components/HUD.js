import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import PlayerLevel from './PlayerLevel';

export default function HUD({ score, lives, wave, totalWaves, enemyCount, towerCount, xp = 0 }) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const prevLivesRef = useRef(lives);

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 30, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 30, useNativeDriver: false }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 20, useNativeDriver: false }),
      ]).start();
    }
    prevLivesRef.current = lives;
  }, [lives]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
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
        <PlayerLevel xp={xp} size="sm" />
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>ENEMIES</Text>
        <Text style={styles.value}>{enemyCount}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>LIVES</Text>
        <Text style={[styles.value, styles.livesText]}>{'❤️'.repeat(Math.max(0, lives))}</Text>
      </View>
    </Animated.View>
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
