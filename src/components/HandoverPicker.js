import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectField from './SelectField';
import { HANDOVER_OPTIONS, handoverInfo } from '../data/constants';
import { colors, radius, spacing } from '../theme/colors';

// The three handover options (drop-off, public meet-up, finder keeps it)
// plus a place dropdown for the first two. Used by the Post form (Found posts)
// and by the "I found this" reply (Lost posts).
export default function HandoverPicker({ type, place, onChangeType, onChangePlace, error }) {
  const current = handoverInfo(type);
  return (
    <View>
      {HANDOVER_OPTIONS.map((h) => {
        const active = h.key === type;
        return (
          <Pressable
            key={h.key}
            onPress={() => {
              onChangeType(h.key);
              onChangePlace(null);
            }}
            style={[styles.card, active && styles.cardActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <Ionicons name={h.icon} size={24} color={colors.text} />
            <View style={styles.text}>
              <Text style={styles.label}>{h.label}</Text>
              <Text style={styles.desc}>{h.desc}</Text>
            </View>
            <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={colors.text} />
          </Pressable>
        );
      })}
      {current && current.places.length > 0 ? (
        <SelectField
          label={type === 'dropoff' ? 'Drop-off point' : 'Meet-up spot'}
          placeholder="Choose a place"
          options={current.places}
          value={place}
          onSelect={onChangePlace}
          error={error}
          style={styles.place}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardActive: { backgroundColor: colors.surface, borderColor: colors.primary },
  text: { flex: 1, marginHorizontal: spacing.md },
  label: { fontSize: 15, fontWeight: '700', color: colors.text },
  desc: { fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  place: { marginTop: spacing.sm },
});
