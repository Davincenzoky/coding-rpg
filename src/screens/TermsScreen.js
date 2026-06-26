import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

export default function TermsScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>TERMS</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.h1}>Terms & Conditions</Text>
        <Text style={styles.updated}>Last updated: June 2026</Text>

        <Text style={styles.h2}>1. Acceptance of Terms</Text>
        <Text style={styles.p}>
          By using Code Defense, you agree to these terms. If you do not agree, do not use the app.
        </Text>

        <Text style={styles.h2}>2. Game Rules</Text>
        <Text style={styles.p}>
          Code Defense is a coding tower defense game. Players solve code challenges to build towers
          and defend against bugs. Cheating, exploiting bugs, or using automated scripts is prohibited.
        </Text>

        <Text style={styles.h2}>3. User Accounts</Text>
        <Text style={styles.p}>
          You are responsible for maintaining the confidentiality of your account credentials.
          You must not share your account with others.
        </Text>

        <Text style={styles.h2}>4. Leaderboard</Text>
        <Text style={styles.p}>
          Your scores and username will be publicly displayed on the leaderboard.
          You can change your display name in Settings at any time.
        </Text>

        <Text style={styles.h2}>5. Data Privacy</Text>
        <Text style={styles.p}>
          We store your email address and game scores to provide the leaderboard service.
          We do not share your data with third parties. Your password is handled securely by Firebase Authentication.
        </Text>

        <Text style={styles.h2}>6. Fair Play</Text>
        <Text style={styles.p}>
          Any attempt to manipulate scores, hack the game, or disrupt other players' experience
          may result in account suspension or permanent ban.
        </Text>

        <Text style={styles.h2}>7. Changes to Terms</Text>
        <Text style={styles.p}>
          We reserve the right to update these terms at any time. Continued use after changes
          constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.h2}>8. Contact</Text>
        <Text style={styles.p}>
          For questions about these terms, contact the developer.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: spacing.md, paddingTop: spacing.lg,
  },
  backBtn: { color: colors.textDim, fontSize: font.sizeMd, fontWeight: 'bold' },
  title: { color: colors.primary, fontSize: font.sizeLg, fontWeight: 'bold', letterSpacing: 1 },
  body: { padding: spacing.lg, flex: 1 },
  h1: { color: colors.text, fontSize: font.sizeXxl, fontWeight: 'bold', marginBottom: 4 },
  updated: { color: colors.textMuted, fontSize: font.sizeSm, marginBottom: spacing.lg },
  h2: { color: colors.primary, fontSize: font.sizeLg, fontWeight: 'bold', marginTop: 20, marginBottom: spacing.sm },
  p: { color: colors.textDim, fontSize: font.sizeMd, lineHeight: 22 },
});
