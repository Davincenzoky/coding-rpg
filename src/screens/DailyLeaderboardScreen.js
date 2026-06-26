import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { getDailyLeaderboard } from '../services/leaderboardService';
import { getDailyLabel } from '../data/dailyChallenge';

export default function DailyLeaderboardScreen({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const dateLabel = getDailyLabel();

  useEffect(() => {
    async function fetch() {
      const data = await getDailyLeaderboard(dateLabel);
      setScores(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Daily Leaderboard</Text>
        <View style={styles.backBtn} />
      </View>
      <Text style={styles.dateLabel}>{dateLabel}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : scores.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scores yet today</Text>
          <Text style={styles.emptySub}>Be the first!</Text>
        </View>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            return (
              <View style={[styles.row, index < 3 && styles.rowTop]}>
                <Text style={styles.rank}>{medal}</Text>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.username || item.email?.split('@')[0] || 'Anonymous'}</Text>
                </View>
                <Text style={styles.score}>{item.score}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backBtn: { width: 70 },
  backBtnText: { color: colors.textDim, fontSize: font.sizeMd, fontWeight: 'bold' },
  heading: { color: colors.text, fontSize: font.sizeTitle, fontWeight: 'bold', textAlign: 'center' },
  dateLabel: { color: colors.warning, fontSize: font.sizeSm, fontWeight: 'bold', textAlign: 'center', letterSpacing: 1, marginBottom: spacing.md },
  list: { padding: spacing.md, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  rowTop: { borderColor: colors.warning, borderWidth: 2 },
  rank: { fontSize: 22, width: 40, textAlign: 'center' },
  info: { flex: 1, marginLeft: spacing.sm },
  name: { color: colors.text, fontSize: font.sizeMd, fontWeight: 'bold' },
  score: { color: colors.warning, fontSize: font.sizeLg, fontWeight: 'bold' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textDim, fontSize: font.sizeLg },
  emptySub: { color: colors.textMuted, fontSize: font.sizeSm, marginTop: spacing.xs },
});
