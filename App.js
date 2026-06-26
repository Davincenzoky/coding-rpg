import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from './src/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import TechStackScreen from './src/screens/TechStackScreen';
import AuthScreen from './src/screens/AuthScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TermsScreen from './src/screens/TermsScreen';
import GameScreen from './src/screens/GameScreen';
import { generateLevel } from './src/data/levels';

function AppContent() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState(null);
  const [techStack, setTechStack] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    if (!loading) {
      setScreen(user ? 'home' : 'auth');
    }
  }, [user, loading]);

  function handlePlay() { setScreen('techSelect'); }

  function handleTechSelect(stack) {
    setTechStack(stack);
    setCurrentLevel(1);
    setScreen('game');
  }

  function handleBack() {
    if (screen === 'game') setScreen('techSelect');
    else if (screen === 'leaderboard' || screen === 'techSelect' || screen === 'settings' || screen === 'terms')
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

  if (screen === 'auth') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <AuthScreen />
      </View>
    );
  }

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <HomeScreen
          onStart={handlePlay}
          onLeaderboard={() => setScreen('leaderboard')}
          onSettings={() => setScreen('settings')}
          userEmail={user?.email}
        />
      </View>
    );
  }

  if (screen === 'leaderboard') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LeaderboardScreen onBack={handleBack} />
      </View>
    );
  }

  if (screen === 'settings') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <SettingsScreen
          userEmail={user?.email}
          onBack={handleBack}
          onLogout={handleLogout}
          onTerms={() => setScreen('terms')}
        />
      </View>
    );
  }

  if (screen === 'terms') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <TermsScreen onBack={handleBack} />
      </View>
    );
  }

  if (screen === 'techSelect') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <TechStackScreen onSelect={handleTechSelect} onBack={handleBack} />
      </View>
    );
  }

  if (screen === 'game' && levelData) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
