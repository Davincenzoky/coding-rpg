import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, useWindowDimensions } from 'react-native';

const COLORS = ['#e94560', '#4fc3f7', '#4caf50', '#ffd93d', '#ff6b6b', '#aa66ff'];
const PARTICLE_COUNT = 40;

function Particle({ delay, color, startX, endX, duration }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);

  const x = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [startX, endX, startX - 20 + Math.random() * 40],
  });

  const y = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 1, 0],
  });

  const size = 4 + Math.random() * 6;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          opacity,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ rotate }],
        },
      ]}
    />
  );
}

export default function Confetti() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <Particle
          key={i}
          delay={i * 30}
          color={COLORS[i % COLORS.length]}
          startX={width / 2 + (Math.random() - 0.5) * 200}
          endX={width / 2 + (Math.random() - 0.5) * 300}
          duration={1500 + Math.random() * 1000}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  particle: {
    position: 'absolute',
  },
});
