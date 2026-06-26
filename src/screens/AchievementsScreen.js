import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ResponsiveContainer from '../components/ui/ResponsiveContainer';
import { colors, spacing, radius, font } from '../theme';
import { ACHIEVEMENTS, loadAchievements } from '../data/achievements';

export default function AchievementsScreen({ userEmail, onBack }) {
  const [achievements, setAchievements] = useState({});

  useEffect(() => {
    if (userEmail) setAchievements(loadAchievements(userEmail));
  }, [userEmail]);

  const unlockedCount = Object.keys(achievements).length;

  return (
    <ResponsiveContainer>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Achievements</Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={styles.progress}>
        {unlockedCount} / {ACHIEVEMENTS.length} unlocked
      </Text>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = !!achievements[ach.id];
          return (
            <View
              key={ach.id}
              style={[styles.card, unlocked && styles.cardUnlocked]}
            >
              <Text style={[styles.cardIcon, !unlocked && styles.cardIconLocked]}>
                {unlocked ? ach.icon : '🔒'}
              </Text>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, unlocked && styles.cardTitleUnlocked]}>
                  {ach.title}
                </Text>
                <Text style={styles.cardDesc}>{ach.desc}</Text>
              </View>
              {unlocked && (
                <Text style={styles.check}>✅</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backBtn: { width: 70 },
  backBtnText: { color: colors.textDim, fontSize: font.sizeMd, fontWeight: 'bold' },
  heading: {
    color: colors.text, fontSize: font.sizeTitle, fontWeight: 'bold',
    textAlign: 'center',
  },
  progress: {
    color: colors.textDim, fontSize: font.sizeMd, textAlign: 'center',
    marginBottom: spacing.md,
  },
  list: { flex: 1 },
  listContent: { padding: spacing.md, gap: spacing.sm, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  cardUnlocked: {
    borderColor: colors.warning, borderWidth: 2,
    backgroundColor: 'rgba(255,217,61,0.04)',
  },
  cardIcon: { fontSize: 32, marginRight: spacing.md, width: 40, textAlign: 'center' },
  cardIconLocked: { opacity: 0.3 },
  cardBody: { flex: 1 },
  cardTitle: { color: colors.textDim, fontSize: font.sizeMd, fontWeight: 'bold' },
  cardTitleUnlocked: { color: colors.text },
  cardDesc: { color: colors.textMuted, fontSize: font.sizeSm, marginTop: 2 },
  check: { fontSize: 18 },
});
