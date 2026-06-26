import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, font } from '../../theme';

export default function Header({ title, onBack, right, showLogo }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backArea}>
        {onBack ? <Text style={styles.backBtn}>← Back</Text> : <View />}
      </TouchableOpacity>
      {showLogo ? (
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
      <View style={styles.rightArea}>{right || <View />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backArea: { width: 70 },
  backBtn: { color: colors.textDim, fontSize: font.sizeMd, fontWeight: 'bold' },
  title: {
    color: colors.primary,
    fontSize: font.sizeXl,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logo: {
    width: 120,
    height: 32,
  },
  rightArea: { width: 70, alignItems: 'flex-end' },
});
