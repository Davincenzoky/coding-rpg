import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function AnimatedTower({ solved, onPress }) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!solved) return;
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    );
    spin.start();
    pulse.start();
    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [solved]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        !solved && styles.unsolved,
        solved && { transform: [{ scale: pulseAnim }] },
      ]}
      onTouchEnd={onPress}
    >
      {solved ? (
        <>
          <View style={styles.base}>
            <View style={styles.baseInner} />
          </View>
          <Animated.View style={[styles.dish, { transform: [{ rotate }] }]}>
            <View style={styles.dishArm} />
            <View style={styles.dishHead} />
          </Animated.View>
          <View style={styles.light} />
        </>
      ) : (
        <>
          <View style={styles.dashedBorder} />
          <View style={styles.plusH} />
          <View style={styles.plusV} />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unsolved: {
    opacity: 0.7,
  },
  base: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1b5e20',
    borderWidth: 3,
    borderColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    boxShadow: '0 0 10px rgba(76,175,80,0.4)',
  },
  baseInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2e7d32',
  },
  dish: {
    position: 'absolute',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishArm: {
    width: 2,
    height: 22,
    backgroundColor: '#66bb6a',
    position: 'absolute',
    top: -2,
    borderRadius: 1,
  },
  dishHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#81c784',
    position: 'absolute',
    top: -6,
    elevation: 2,
    boxShadow: '0 0 4px rgba(76,175,80,0.5)',
  },
  light: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.success,
    position: 'absolute',
    top: -4,
    opacity: 0.8,
  },
  dashedBorder: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  plusH: {
    width: 20,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: 'absolute',
  },
  plusV: {
    width: 3,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: 'absolute',
  },
});
