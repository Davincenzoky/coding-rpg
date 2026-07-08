import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithGoogle } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { isOnline } from '../services/syncService';
import { colors, spacing, radius, font } from '../theme';

export default function AuthScreen({ onLogin }) {
  const { loginAsGuest } = useAuth();
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [offline, setOffline] = useState(!isOnline());

  useEffect(() => {
    function handleOnline() { setOffline(false); }
    function handleOffline() { setOffline(true); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function handleGoogleSignIn() {
    setGoogleLoading(true); setError('');
    try {
      await signInWithGoogle();
      onLogin && onLogin();
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed');
      }
    }
    setGoogleLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topSection}>
          <Image source={require('../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
          <Text style={styles.subtitle}>Sign in to save your progress</Text>
        </View>

      <View style={styles.card}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <Text style={styles.googleBtnText}>
            {googleLoading ? 'Please wait...' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>

        {offline ? (
          <TouchableOpacity style={styles.offlineBtn} onPress={() => loginAsGuest()}>
            <Text style={styles.offlineBtnText}>📡 Continue Offline</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  topSection: { alignItems: 'center', marginBottom: spacing.xl },
  logoImg: { width: 260, height: 80, marginBottom: spacing.md },
  subtitle: { color: colors.textDim, fontSize: font.sizeMd, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.xl, padding: spacing.lg,
    width: '100%', maxWidth: 380,
    borderWidth: 1, borderColor: colors.border,
    boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
  },
  errorBox: {
    backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: radius.md, padding: 10,
    marginBottom: spacing.md, borderWidth: 1, borderColor: 'rgba(255,107,107,0.2)',
  },
  errorText: { color: colors.danger, fontSize: font.sizeSm, textAlign: 'center' },
  btnDisabled: { opacity: 0.5 },
  googleBtn: {
    backgroundColor: '#fff', padding: 16, borderRadius: radius.lg,
    alignItems: 'center', marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    elevation: 4, boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
  },
  googleBtnText: { color: '#444', fontSize: font.sizeMd, fontWeight: 'bold', letterSpacing: 0.5 },
  offlineBtn: {
    backgroundColor: 'rgba(255,193,7,0.1)', padding: 14, borderRadius: radius.lg,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,193,7,0.3)',
  },
  offlineBtnText: { color: colors.warning, fontSize: font.sizeMd, fontWeight: 'bold' },
});
