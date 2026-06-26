import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CodeChallenge({ challenge, onSolve, onFail, onClose }) {
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasError, setHasError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const shuffled = useMemo(() => shuffle(challenge.choices), [challenge.id]);

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 30, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: false }),
    ]).start();
  }

  function handleBlockPress(choice) {
    setSelected(choice);
    setHasError(false);

    if (choice === challenge.answer) {
      setTimeout(() => onSolve(challenge.reward), 300);
    } else {
      shake();
      setHasError(true);
      setTimeout(() => {
        setSelected(null);
        setHasError(false);
        onFail();
      }, 800);
    }
  }

  function handleSkip() {
    onClose();
  }

  const codeLines = challenge.code.split('\n');

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.modal, { transform: [{ translateX: shakeAnim }] }]}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CODE CHALLENGE</Text>
            </View>
            <Text style={styles.reward}>+{challenge.reward} pts</Text>
          </View>

          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.desc}>{challenge.description}</Text>

          <View style={styles.codeBox}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeLang}>JavaScript</Text>
            </View>
            {codeLines.map((line, i) => (
              <Text key={i} style={styles.codeLine}>
                {line.includes('___') ? (
                  <>
                    <Text>{line.split('___')[0]}</Text>
                    <View style={styles.blankSlot}>
                      {selected ? (
                        <Text
                          style={[
                            styles.inlineBlock,
                            selected === challenge.answer
                              ? styles.blockCorrect
                              : styles.blockWrong,
                          ]}
                        >
                          {selected}
                        </Text>
                      ) : (
                        <Text style={styles.blankText}>?</Text>
                      )}
                    </View>
                    <Text>{line.split('___')[1] || ''}</Text>
                  </>
                ) : (
                  <Text>{line}</Text>
                )}
              </Text>
            ))}
          </View>

          <Text style={styles.prompt}>Choose the right block:</Text>

          <View style={styles.blocksRow}>
            {shuffled.map((choice, i) => {
              const isSelected = selected === choice;
              const isCorrect = choice === challenge.answer;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.block,
                    isSelected && !hasError && isCorrect && styles.blockActiveGreen,
                    isSelected && hasError && isCorrect && styles.blockDim,
                    isSelected && hasError && !isCorrect && styles.blockWrong,
                  ]}
                  onPress={() => !selected && handleBlockPress(choice)}
                  activeOpacity={0.7}
                  disabled={!!selected}
                >
                  <Text
                    style={[
                      styles.blockText,
                      isSelected && styles.blockTextSelected,
                    ]}
                  >
                    {choice}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {hasError && (
            <View style={styles.errorBar}>
              <Text style={styles.errorText}>✖ Wrong block! -1 Life</Text>
            </View>
          )}

          {showHint && (
            <View style={styles.hintBar}>
              <Text style={styles.hintText}>💡 {challenge.hints[0]}</Text>
            </View>
          )}

          <View style={styles.actionRow}>
            {!showHint && (
              <TouchableOpacity style={styles.hintBtn} onPress={() => setShowHint(true)}>
                <Text style={styles.hintBtnText}>💡 Hint</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center', alignItems: 'center', zIndex: 100,
  },
  modal: {
    width: '90%', maxWidth: 420, maxHeight: '85%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 2, borderColor: colors.primary,
    elevation: 20, boxShadow: `0 8px 32px ${colors.primaryGlow}`,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  badgeText: { color: '#fff', fontSize: font.sizeXs, fontWeight: 'bold', letterSpacing: 1 },
  reward: { color: colors.warning, fontSize: font.sizeLg, fontWeight: 'bold' },
  title: { color: colors.text, fontSize: font.sizeXl, fontWeight: 'bold', marginBottom: 4 },
  desc: { color: colors.textDim, fontSize: font.sizeMd, marginBottom: 14, lineHeight: 20 },
  codeBox: {
    backgroundColor: colors.bgDark,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  codeHeader: {
    backgroundColor: '#0f0f20',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  codeLang: { color: colors.textMuted, fontSize: 11, fontFamily: font.mono },
  codeLine: {
    color: '#0f0',
    fontFamily: font.mono,
    fontSize: font.sizeMd,
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  blankSlot: {
    minWidth: 50, height: 26,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: spacing.xs,
    marginHorizontal: 2,
  },
  blankText: { color: colors.primary, fontSize: font.sizeMd, fontWeight: 'bold' },
  inlineBlock: { color: colors.text, fontSize: font.sizeMd, fontWeight: 'bold' },
  blockCorrect: { color: colors.success },
  blockWrong: { color: colors.danger },
  prompt: { color: colors.textDim, fontSize: font.sizeSm, marginBottom: spacing.sm, fontWeight: 'bold' },
  blocksRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  block: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.bgDark,
    borderWidth: 2, borderColor: colors.border,
    minWidth: 60, alignItems: 'center',
  },
  blockActiveGreen: {
    borderColor: colors.success,
    backgroundColor: 'rgba(76,175,80,0.2)',
  },
  blockWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255,107,107,0.2)',
  },
  blockDim: { opacity: 0.5 },
  blockText: {
    color: colors.text,
    fontSize: font.sizeLg,
    fontWeight: 'bold',
    fontFamily: font.mono,
  },
  blockTextSelected: { color: colors.success },
  errorBar: {
    backgroundColor: 'rgba(255,107,107,0.12)',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.3)',
  },
  errorText: { color: colors.danger, fontSize: font.sizeMd, fontWeight: 'bold' },
  hintBar: {
    backgroundColor: 'rgba(255,217,61,0.08)',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: 'rgba(255,217,61,0.3)',
  },
  hintText: { color: colors.warning, fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  hintBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,217,61,0.1)',
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,217,61,0.3)',
  },
  hintBtnText: { color: colors.warning, fontWeight: 'bold', fontSize: font.sizeMd },
  skipBtn: {
    flex: 1,
    backgroundColor: colors.bgCard2,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  skipBtnText: { color: colors.textDim, fontWeight: 'bold', fontSize: font.sizeMd },
});
