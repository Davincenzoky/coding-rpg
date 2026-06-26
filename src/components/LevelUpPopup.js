import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

export default function LevelUpPopup({ newLevel, onDone }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();

    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scale, { toValue: 0, duration: 200, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: false }),
      ]).start(() => onDone && onDone());
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ scale }] }]}
    >
      <Text style={styles.emoji}>⬆️</Text>
      <Text style={styles.title}>LEVEL UP!</Text>
      <Text style={styles.level}>Lv. {newLevel}</Text>
      <Text style={styles.reward}>+1 max life</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  emoji: { fontSize: 64, marginBottom: spacing.sm },
  title: {
    color: colors.warning,
    fontSize: 36,
    fontWeight: 'bold',
    textShadow: `0 0 30px ${colors.warning}88`,
  },
  level: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  reward: {
    color: colors.success,
    fontSize: font.sizeLg,
    marginTop: spacing.xs,
  },
});
