import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, font } from '../../theme';

export default function Button({ title, onPress, variant = 'primary', style, textStyle }) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          isPrimary && styles.textPrimary,
          isOutline && styles.textOutline,
          isGhost && styles.textGhost,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    elevation: 6,
    boxShadow: `0 4px 20px ${colors.primaryGlow}`,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: { fontSize: font.sizeLg, fontWeight: 'bold', letterSpacing: 0.5 },
  textPrimary: { color: '#fff' },
  textOutline: { color: colors.text },
  textGhost: { color: colors.textDim },
});
