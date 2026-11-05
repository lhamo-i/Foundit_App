import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STAGES } from '../data/constants';
import { colors, spacing } from '../theme/colors';

// The 5-step progress bar from the proposal:
// Posted > Claim requested > Claim approved > Handed over > Resolved
export default function StageTracker({ stage }) {
  const current = Math.max(0, STAGES.findIndex((s) => s.key === stage));
  const last = STAGES.length - 1;

  return (
    <View style={styles.row} accessibilityLabel={`Status: ${STAGES[current].label}`}>
      {STAGES.map((s, i) => {
        const done = i <= current;
        return (
          <View key={s.key} style={styles.step}>
            <View style={styles.lineRow}>
              <View style={[styles.line, i === 0 && styles.hidden, i > 0 && i <= current && styles.lineDone]} />
              <View style={[styles.dot, done && styles.dotDone, i === current && styles.dotCurrent]}>
                {done ? <Ionicons name="checkmark" size={12} color={colors.background} /> : null}
              </View>
              <View style={[styles.line, i === last && styles.hidden, i < current && styles.lineDone]} />
            </View>
            <Text style={[styles.label, i === current && styles.labelCurrent]} numberOfLines={2}>
              {s.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  step: { flex: 1, alignItems: 'center' },
  lineRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  line: { flex: 1, height: 3, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.text },
  hidden: { backgroundColor: 'transparent' },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.text, borderColor: colors.text },
  dotCurrent: { borderColor: colors.primary, borderWidth: 3 },
  label: { marginTop: spacing.xs, fontSize: 10.5, textAlign: 'center', color: colors.textMuted },
  labelCurrent: { color: colors.text, fontWeight: '700' },
});
