import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TECH_STACKS from '../data/levels';
import Header from '../components/ui/Header';
import { colors, spacing, radius, font } from '../theme';

export default function TechStackScreen({ onSelect, onBack }) {
  return (
    <View style={styles.container}>
      <Header title="CHOOSE TECH" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sub}>100 levels — beginner to expert</Text>

        {TECH_STACKS.map((stack) => (
          <TouchableOpacity
            key={stack.id}
            style={[styles.card, { borderColor: stack.color }]}
            onPress={() => onSelect(stack)}
            activeOpacity={0.85}
          >
            <View style={styles.cardTop}>
              <Text style={styles.icon}>{stack.icon}</Text>
              <View style={styles.cardInfo}>
                <Text style={[styles.name, { color: stack.color }]}>{stack.name}</Text>
                <Text style={styles.detail}>{stack.levels} Levels</Text>
              </View>
              <View style={[styles.playBadge, { backgroundColor: stack.color }]}>
                <Text style={styles.playText}>PLAY</Text>
              </View>
            </View>
            <View style={styles.tiers}>
              {['BGN', 'INT', 'ADV', 'EXP'].map((t, i) => (
                <View key={i} style={[styles.tierDot, { borderColor: stack.color }]}>
                  <Text style={[styles.tierText, { color: stack.color }]}>{t}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.md, paddingBottom: 40 },
  sub: { color: colors.textDim, fontSize: font.sizeSm, textAlign: 'center', marginBottom: spacing.md, letterSpacing: 0.5 },
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.xl, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1.5,
    elevation: 4, boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 34, marginRight: spacing.md },
  cardInfo: { flex: 1 },
  name: { fontSize: font.sizeXl, fontWeight: 'bold' },
  detail: { color: colors.textDim, fontSize: font.sizeSm, marginTop: 2 },
  playBadge: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: radius.md },
  playText: { color: '#fff', fontWeight: 'bold', fontSize: font.sizeSm, letterSpacing: 1 },
  tiers: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  tierDot: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tierText: { fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 0.5 },
});
