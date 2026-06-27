import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { ENEMY_TYPES } from '../utils/gameEngine';

export default function AnimatedEnemy({ enemy, scale = 1 }) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const eType = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.normal;
  const isBoss = enemy.type === 'boss';

  useEffect(() => {
    const duration = isBoss ? 600 : 300;
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
      ])
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: isBoss ? 800 : 400,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: isBoss ? 800 : 400,
          useNativeDriver: false,
        }),
      ])
    );
    bounce.start();
    pulse.start();
    return () => {
      bounce.stop();
      pulse.stop();
    };
  }, [enemy.type]);

  const bounceY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isBoss ? -8 : -4],
  });

  const hpRatio = enemy.health / enemy.maxHealth;
  const bodyColor = eType.bodyColor;
  const size = Math.round(eType.size * 24);
  const wrapperSize = size + 10;
  const halfSize = wrapperSize / 2;

  function getGlowColor() {
    if (isBoss) return 'rgba(255,109,0,0.6)';
    return 'rgba(255,0,0,0.4)';
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          left: enemy.x * scale - halfSize * scale,
          top: enemy.y * scale - halfSize * scale,
          width: wrapperSize,
          height: wrapperSize + 4,
          transform: [{ translateY: bounceY }, { scale: pulseAnim * scale }],
        },
      ]}
    >
      <View style={[
        styles.body,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bodyColor,
          borderColor: isBoss ? '#ff9100' : '#ef5350',
          borderWidth: isBoss ? 3 : 1.5,
          boxShadow: `0 2px 8px ${getGlowColor()}`,
        },
      ]}>
        <View style={[styles.eye, { top: size * 0.25, left: size * 0.2, width: isBoss ? 6 : 4, height: isBoss ? 6 : 4, borderRadius: isBoss ? 3 : 2, backgroundColor: isBoss ? '#ff0' : colors.text }]} />
        <View style={[styles.eye, { top: size * 0.25, right: size * 0.2, width: isBoss ? 6 : 4, height: isBoss ? 6 : 4, borderRadius: isBoss ? 3 : 2, backgroundColor: isBoss ? '#ff0' : colors.text }]} />
        <View style={[styles.antenna, { width: isBoss ? 2.5 : 1.5, height: isBoss ? 12 : 8, top: isBoss ? -(size * 0.35) : -(size * 0.25), backgroundColor: isBoss ? '#ff9100' : colors.primary, borderRadius: isBoss ? 2 : 1 }]} />
      </View>
      <View style={[styles.healthBar, { width: size }]}>
        <View
          style={[
            styles.healthFill,
            {
              width: `${hpRatio * 100}%`,
              backgroundColor:
                hpRatio > 0.5 ? '#4caf50' : hpRatio > 0.25 ? '#ffd93d' : '#ff6b6b',
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 6,
  },
  eye: {
    position: 'absolute',
  },
  antenna: {
    position: 'absolute',
  },
  healthBar: {
    width: 22,
    height: 3,
    backgroundColor: colors.bgDark,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 1,
  },
  healthFill: { height: '100%', borderRadius: 2 },
});
