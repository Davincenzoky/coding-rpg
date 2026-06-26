import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { logOut } from '../services/authService';
import { getProfile, updateUsername } from '../services/leaderboardService';
import Header from '../components/ui/Header';
import { colors, spacing, radius, font } from '../theme';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsScreen({ userEmail, onBack, onLogout, onTerms }) {
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    (async () => {
      const p = await getProfile(userEmail);
      if (p?.username) setUsername(p.username);
    })();
  }, []);

  async function handleSave() {
    if (!username.trim()) return;
    await updateUsername(userEmail, username.trim());
    setSaved('Username saved!');
    setTimeout(() => setSaved(''), 2000);
  }

  return (
    <View style={styles.container}>
      <Header title="SETTINGS" onBack={onBack} />
      <ScrollView style={styles.body}>
        <Text style={styles.section}>PROFILE</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.email}>{userEmail}</Text>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.textMuted}
            maxLength={20}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
          {saved ? <Text style={styles.saved}>✅ {saved}</Text> : null}
        </View>

        <Text style={styles.section}>INFO</Text>
        <TouchableOpacity style={styles.optionRow} onPress={onTerms}>
          <Text style={styles.optionText}>📄  Terms & Conditions</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.section}>APPEARANCE</Text>
        <TouchableOpacity style={styles.themeRow} onPress={toggleTheme}>
          <Text style={styles.themeText}>{isDark ? '☀️  Light Mode' : '🌙  Dark Mode'}</Text>
          <View style={[styles.toggleTrack, isDark && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, isDark && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        <Text style={styles.section}>ACCOUNT</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => { logOut(); onLogout(); }}>
          <Text style={styles.logoutText}>🚪  Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.md, flex: 1 },
  section: { color: colors.textMuted, fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: spacing.sm, marginTop: spacing.lg, marginLeft: 2 },
  card: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.textDim, fontSize: font.sizeXs, fontWeight: 'bold', marginBottom: 4, marginTop: spacing.sm, marginLeft: 2, letterSpacing: 0.5 },
  email: { color: colors.accent, fontSize: font.sizeMd, marginBottom: spacing.xs },
  input: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, color: colors.text, fontSize: font.sizeMd },
  saveBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.md, elevation: 4, boxShadow: `0 2px 10px ${colors.primaryGlow}` },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: font.sizeMd, letterSpacing: 0.5 },
  saved: { color: colors.success, fontSize: font.sizeSm, fontWeight: 'bold', marginTop: spacing.sm, textAlign: 'center' },
  optionRow: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  optionText: { color: colors.text, fontSize: font.sizeMd },
  arrow: { color: colors.textMuted, fontSize: 18 },
  themeRow: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  themeText: { color: colors.text, fontSize: font.sizeMd },
  toggleTrack: { width: 48, height: 26, borderRadius: 13, backgroundColor: '#555577', justifyContent: 'center', paddingHorizontal: 3 },
  toggleTrackActive: { backgroundColor: '#e94560' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  toggleThumbActive: { alignSelf: 'flex-end' },
  logoutBtn: { backgroundColor: 'rgba(255,107,107,0.08)', borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,107,107,0.2)' },
  logoutText: { color: colors.danger, fontSize: font.sizeLg, fontWeight: 'bold' },
  version: { color: colors.textMuted, fontSize: font.sizeXs, textAlign: 'center', marginTop: 30 },
});
