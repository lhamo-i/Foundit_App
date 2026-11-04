import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

// A row of pill buttons, e.g. All / Lost / Found.
//   options  = list of labels, e.g. ['All', 'Lost', 'Found']
//   selected = the label that is currently chosen
//   onSelect = function called with the label the user taps
export default function FilterTabs({ options, selected, onSelect, style }) {
  return (
    <View style={[styles.row, style]}>
      {options.map((option) => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  pill: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 15, fontWeight: '600', color: colors.text },
  textActive: { fontWeight: '700' },
});
