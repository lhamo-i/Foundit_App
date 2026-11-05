import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { colors, radius, spacing, shadow } from '../theme/colors';

// A wide list row for an item: thumbnail, title, place, and anything extra underneath.
//   right    = optional element shown instead of the chevron
//   children = optional content under the main row (buttons, stage text...)
export default function ItemRow({ item, onPress, right, children, showBadge = true, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.type}, ${item.location}`}
      style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed, style]}
    >
      <View style={styles.main}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.noThumb]}>
            <Ionicons name={item.icon || 'cube-outline'} size={26} color={colors.text} />
          </View>
        )}
        <View style={styles.text}>
          {showBadge ? <StatusBadge type={item.type} /> : null}
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
        {right || <Ionicons name="chevron-forward" size={18} color={colors.text} />}
      </View>
      {children ? <View style={styles.extra}>{children}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.85 },
  main: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: radius.sm },
  noThumb: { backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, marginLeft: spacing.md, marginRight: spacing.sm },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  location: { fontSize: 13, color: colors.textMuted, marginLeft: 2, flexShrink: 1 },
  extra: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
});
