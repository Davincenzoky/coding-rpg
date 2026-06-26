import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 };

export default function ResponsiveContainer({ children, style }) {
  const { width } = useWindowDimensions();

  let maxWidth, horizontalPadding;
  if (width < BREAKPOINTS.sm) {
    maxWidth = '100%';
    horizontalPadding = 12;
  } else if (width < BREAKPOINTS.md) {
    maxWidth = BREAKPOINTS.sm - 32;
    horizontalPadding = 24;
  } else if (width < BREAKPOINTS.lg) {
    maxWidth = BREAKPOINTS.md - 32;
    horizontalPadding = 32;
  } else if (width < BREAKPOINTS.xl) {
    maxWidth = BREAKPOINTS.lg - 64;
    horizontalPadding = 48;
  } else {
    maxWidth = BREAKPOINTS.lg - 64;
    horizontalPadding = 48;
  }

  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { maxWidth, paddingHorizontal: horizontalPadding }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
});
