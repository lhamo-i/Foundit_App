import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/colors';

// One line in the Profile menu: icon, label, optional value, chevron.
export default function MenuRow({ icon, label, value, onPress, danger = false, last = false }) {
  const tint = danger ? colors.danger : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={tint} />
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {!danger ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : <View />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: spacing.lg },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { opacity: 0.7 },
  label: { flex: 1, marginLeft: spacing.md, fontSize: 16, fontWeight: '500' },
  value: { fontSize: 14, color: colors.textMuted, marginRight: spacing.sm },
});
