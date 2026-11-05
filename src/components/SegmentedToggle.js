import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';

// Two-option switch, e.g. Lost | Found.   options = [{ key, label }]
export default function SegmentedToggle({ options, value, onChange, style }) {
  return (
    <View style={[styles.track, style]}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.textActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 3,
  },
  segment: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  segmentActive: { backgroundColor: colors.primary },
  text: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  textActive: { color: colors.text, fontWeight: '700' },
});
