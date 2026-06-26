import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export default function Card({ children, style, borderColor }) {
  return (
    <View
      style={[
        styles.card,
        borderColor ? { borderColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
