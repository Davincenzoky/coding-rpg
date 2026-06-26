import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function AnimatedEnemy({ enemy }) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
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
  }, []);

  const bounceY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const hpRatio = enemy.health / enemy.maxHealth;
  const bodyColor = hpRatio > 0.5 ? '#c62828' : hpRatio > 0.25 ? '#e65100' : '#880e4f';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          left: enemy.x - 15,
          top: enemy.y - 15,
          transform: [{ translateY: bounceY }, { scale: pulseAnim }],
        },
      ]}
    >
      <View style={[styles.body, { backgroundColor: bodyColor }]}>
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        <View style={styles.antenna} />
      </View>
      <View style={styles.healthBar}>
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
    width: 30,
    height: 34,
    alignItems: 'center',
    zIndex: 10,
  },
  body: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ef5350',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
    boxShadow: '0 2px 6px rgba(255,0,0,0.4)',
  },
  eyeLeft: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    position: 'absolute',
    top: 6,
    left: 5,
  },
  eyeRight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    position: 'absolute',
    top: 6,
    right: 5,
  },
  antenna: {
    width: 1.5,
    height: 8,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: -8,
    borderRadius: 1,
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
