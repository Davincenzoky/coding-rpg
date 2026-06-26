import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme';

const PROJ_COLORS = {
  normal: '#4caf50',
  ice:    '#4fc3f7',
  sniper: '#ff6b6b',
  mgun:   '#ffd93d',
};

export default function AnimatedProjectile({ projectile, scale = 1 }) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const projColor = PROJ_COLORS[projectile.towerType] || PROJ_COLORS.normal;

  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, []);

  const glowSize = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 12],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          left: projectile.x * scale - 8 * scale,
          top: projectile.y * scale - 8 * scale,
          opacity: glowOpacity,
          transform: [{ scale: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.3],
          }) }],
        },
      ]}
    >
      <View style={[styles.core, { backgroundColor: projColor }]} />
      <Animated.View
        style={[
          styles.glow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize.interpolate({
              inputRange: [6, 12],
              outputRange: [3, 6],
            }),
            backgroundColor: projColor,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  core: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
    position: 'absolute',
    zIndex: 2,
  },
  glow: {
    backgroundColor: colors.warning,
    position: 'absolute',
    opacity: 0.6,
  },
});
