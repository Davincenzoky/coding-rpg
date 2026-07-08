import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { signUp, signIn, signInWithGoogle } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { isOnline } from '../services/syncService';
import { colors, spacing, radius, font } from '../theme';

export default function AuthScreen({ onLogin }) {
  const { loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit() {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      if (isLogin) await signIn(email, password);
      else await signUp(email, password);
      onLogin && onLogin();
      return;
    } catch (e) {
      const msg = e.message
        .replace(/^Firebase:\s*/i, '')
        .replace(/\s*\(.*\)\s*$/, '')
        .trim();
      setError(msg || 'Authentication failed');
    }
    setLoading(false);
  }

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
          <Text style={styles.subtitle}>{isLogin ? 'Welcome back' : 'Start your journey'}</Text>
        </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{isLogin ? 'Sign In' : 'Create Account'}</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchBtn} onPress={() => { setIsLogin(!isLogin); setError(''); }}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.switchLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

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
  cardTitle: { color: colors.text, fontSize: font.sizeXl, fontWeight: 'bold', marginBottom: spacing.lg },
  label: { color: colors.textDim, fontSize: font.sizeSm, fontWeight: 'bold', marginBottom: spacing.xs, marginLeft: 2, letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 14, color: colors.text, fontSize: font.sizeMd,
    marginBottom: spacing.md,
  },
  errorBox: {
    backgroundColor: 'rgba(255,107,107,0.1)', borderRadius: radius.md, padding: 10,
    marginBottom: spacing.md, borderWidth: 1, borderColor: 'rgba(255,107,107,0.2)',
  },
  errorText: { color: colors.danger, fontSize: font.sizeSm, textAlign: 'center' },
  btn: {
    backgroundColor: colors.primary, padding: 16, borderRadius: radius.lg,
    alignItems: 'center', marginBottom: spacing.md,
    elevation: 6, boxShadow: `0 4px 16px ${colors.primaryGlow}`,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: font.sizeLg, fontWeight: 'bold', letterSpacing: 0.5 },
  switchBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  switchText: { color: colors.textDim, fontSize: font.sizeSm },
  switchLink: { color: colors.accent, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textDim, fontSize: font.sizeSm, marginHorizontal: 12 },
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
