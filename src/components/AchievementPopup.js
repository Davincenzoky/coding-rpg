import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

export default function AchievementPopup({ achievement, onDone }) {
  const slideIn = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideIn, { toValue: 0, friction: 7, useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();

    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideIn, { toValue: -120, duration: 300, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start(() => onDone && onDone());
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideIn }], opacity },
      ]}
    >
      <Text style={styles.icon}>{achievement.icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>Achievement Unlocked!</Text>
        <Text style={styles.name}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.desc}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.warning,
    zIndex: 100,
    elevation: 12,
    boxShadow: `0 4px 20px ${colors.warning}44`,
  },
  icon: { fontSize: 36, marginRight: spacing.md },
  textWrap: { flex: 1 },
  title: { color: colors.warning, fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 1 },
  name: { color: colors.text, fontSize: font.sizeLg, fontWeight: 'bold' },
  desc: { color: colors.textDim, fontSize: font.sizeSm, marginTop: 2 },
});
