import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, spacing, radius, font } from '../theme';
import { isOnline, syncPendingScores, getPendingCount } from '../services/syncService';

export default function OnlineStatusBar() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    function handleOnline() { setOnline(true); triggerSync(); }
    function handleOffline() { setOnline(false); }
    setOnline(isOnline());
    setPending(getPendingCount());
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: (!online || pending > 0 || syncing) ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [online, pending, syncing]);

  async function triggerSync() {
    if (syncing || !isOnline()) return;
    setSyncing(true);
    const result = await syncPendingScores();
    setPending(getPendingCount());
    setSyncing(false);
  }

  useEffect(() => {
    if (online && pending > 0) triggerSync();
  }, [online, pending]);

  if (online && pending === 0 && !syncing) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }, !online && styles.offline]}>
      {!online ? (
        <Text style={styles.text}>📡 Offline — scores saved locally</Text>
      ) : syncing ? (
        <Text style={styles.text}>🔄 Syncing scores...</Text>
      ) : (
        <TouchableOpacity onPress={triggerSync} style={styles.syncBtn}>
          <Text style={styles.text}>📤 {pending} score{pending > 1 ? 's' : ''} to sync — tap to upload</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.warning,
  },
  offline: { backgroundColor: colors.danger },
  text: { color: '#000', fontSize: font.sizeSm, fontWeight: 'bold' },
  syncBtn: {},
});
