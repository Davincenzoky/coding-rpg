import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from './src/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import ResponsiveContainer from './src/components/ui/ResponsiveContainer';
import HomeScreen from './src/screens/HomeScreen';
import TechStackScreen from './src/screens/TechStackScreen';
import AuthScreen from './src/screens/AuthScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TermsScreen from './src/screens/TermsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import LandingScreen from './src/screens/LandingScreen';
import GameScreen from './src/screens/GameScreen';
import { generateLevel } from './src/data/levels';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: 'var(--color-bg)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'var(--color-primary)', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>⚠️ Error</Text>
          <Text style={{ color: 'var(--color-text)', fontSize: 13, textAlign: 'center', marginBottom: 4 }}>{this.state.error.message}</Text>
          <Text style={{ color: 'var(--color-textDim)', fontSize: 11, textAlign: 'center' }}>{this.state.error.stack?.split('\n').slice(0, 4).join('\n')}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const [screen, setScreen] = useState(null);
  const [techStack, setTechStack] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    if (loading) return;
    if (user && screen === 'auth') { setScreen('home'); return; }
    if (!user && screen === 'home') { setScreen('auth'); return; }
    if (!screen) { setScreen('landing'); }
  }, [user, loading, screen]);

  function handlePlay() { setScreen('techSelect'); }

  function handleTechSelect(stack) {
    setTechStack(stack);
    setCurrentLevel(1);
    setScreen('game');
  }

  function handleBack() {
    if (screen === 'game') setScreen('techSelect');
    else if (screen === 'auth') setScreen('landing');
    else if (screen === 'leaderboard' || screen === 'techSelect' || screen === 'settings' || screen === 'terms' || screen === 'achievements')
      setScreen('home');
    else setScreen('home');
  }

  function handleNextLevel() {
    const next = currentLevel + 1;
    if (techStack && next <= techStack.levels) {
      setCurrentLevel(next);
    } else {
      setScreen('techSelect');
    }
  }

  function handleLogout() {
    setScreen('auth');
  }

  const levelData = techStack ? generateLevel(techStack, currentLevel) : null;

  if (loading || !screen) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 100 }} />
      </View>
    );
  }

  if (screen === 'landing') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LandingScreen onGetStarted={() => setScreen(user ? 'home' : 'auth')} />
      </View>
    );
  }

  if (screen === 'auth') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <AuthScreen onLogin={() => setScreen('home')} />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <HomeScreen
            onStart={handlePlay}
            onLeaderboard={() => setScreen('leaderboard')}
            onSettings={() => setScreen('settings')}
            onAchievements={() => setScreen('achievements')}
            userEmail={user?.email}
          />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <LeaderboardScreen onBack={handleBack} />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'settings') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <SettingsScreen
            userEmail={user?.email}
            onBack={handleBack}
            onLogout={handleLogout}
            onTerms={() => setScreen('terms')}
          />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'terms') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <TermsScreen onBack={handleBack} />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'achievements') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <AchievementsScreen userEmail={user?.email} onBack={handleBack} />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'techSelect') {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ResponsiveContainer>
          <TechStackScreen onSelect={handleTechSelect} onBack={handleBack} userEmail={user?.email} />
        </ResponsiveContainer>
      </View>
    );
  }

  if (screen === 'game' && levelData) {
    return (
      <View style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <GameScreen
          key={`${techStack.id}-${currentLevel}`}
          techStack={techStack}
          level={levelData}
          levelNum={currentLevel}
          maxLevel={techStack.levels}
          userEmail={user?.email}
          onBack={handleBack}
          onNextLevel={currentLevel < techStack.levels ? handleNextLevel : null}
        />
      </View>
    );
  }

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
