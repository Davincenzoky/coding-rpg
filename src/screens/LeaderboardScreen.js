import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getLeaderboard } from '../services/leaderboardService';
import Header from '../components/ui/Header';
import { colors, spacing, radius, font } from '../theme';

const TECH_ICONS = { js: '🟨', py: '🐍', html: '🌐', sql: '🗄️', react: '⚛️' };

function Medal({ rank }) {
  if (rank === 1) return <Text style={styles.medal}>🥇</Text>;
  if (rank === 2) return <Text style={styles.medal}>🥈</Text>;
  if (rank === 3) return <Text style={styles.medal}>🥉</Text>;
  return <Text style={styles.rankNum}>#{rank}</Text>;
}

export default function LeaderboardScreen({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getLeaderboard();
      setEntries(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="LEADERBOARD" onBack={onBack} />
      <View style={styles.headerRow}>
        <Text style={[styles.col, { width: 50, textAlign: 'center' }]}>#</Text>
        <Text style={[styles.col, { flex: 1 }]}>Player</Text>
        <Text style={[styles.col, { width: 36, textAlign: 'center' }]}>Tech</Text>
        <Text style={[styles.col, { width: 64, textAlign: 'right' }]}>Score</Text>
        <Text style={[styles.col, { width: 44, textAlign: 'center' }]}>Lvl</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No scores yet</Text>
          <Text style={styles.emptyDesc}>Complete a level to appear here</Text>
        </View>
      ) : (
        <ScrollView>
          {entries.map((e, i) => (
            <View key={e.id} style={[styles.row, i < 3 && styles.topRow]}>
              <View style={{ width: 50, alignItems: 'center' }}><Medal rank={e.rank} /></View>
              <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
                {e.username || e.email?.split('@')[0] || 'Anonymous'}
              </Text>
              <Text style={[styles.cell, { width: 36, textAlign: 'center', fontSize: 16 }]}>
                {TECH_ICONS[e.bestTech] || '❓'}
              </Text>
              <Text style={[styles.cell, { width: 64, textAlign: 'right', color: colors.warning, fontWeight: 'bold' }]}>
                {e.bestScore}
              </Text>
              <Text style={[styles.cell, { width: 44, textAlign: 'center', color: colors.textDim }]}>
                {e.bestLevel}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: {
    flexDirection: 'row', paddingHorizontal: spacing.md, paddingVertical: 10,
    backgroundColor: colors.bgCard, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  col: { color: colors.textMuted, fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  topRow: { backgroundColor: 'rgba(255,217,61,0.04)' },
  cell: { color: colors.text, fontSize: font.sizeSm },
  medal: { fontSize: 18 },
  rankNum: { color: colors.textDim, fontSize: font.sizeSm, fontWeight: 'bold' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: { color: colors.textDim, fontSize: font.sizeXl, fontWeight: 'bold' },
  emptyDesc: { color: colors.textMuted, fontSize: font.sizeSm, marginTop: 4 },
});
