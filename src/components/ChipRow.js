import React from 'react';
import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

// A sideways-scrolling row of small pills (categories, locations).
// Each option is a string, or { value, label, icon? }.
export default function ChipRow({ options, selected, onSelect, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, style]}
    >
      {options.map((o) => {
        const value = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const active = value === selected;
        return (
          <Pressable
            key={String(value)}
            onPress={() => onSelect(value)}
            style={[styles.chip, active && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 2 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 13, fontWeight: '600', color: colors.text },
  textActive: { fontWeight: '700' },
});
