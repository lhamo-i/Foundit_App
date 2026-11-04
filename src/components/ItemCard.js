import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { colors, radius, spacing, shadow } from '../theme/colors';

// One item in the Home grid.
// item = { id, title, type ('lost' | 'found'), location, imageUri (optional), icon (optional) }
// If there is no photo yet, we show an icon instead.
export default function ItemCard({ item, saved = false, onPress, onToggleSave, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.type}, ${item.location}`}
      style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed, style]}
    >
      <View style={styles.imageWrap}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name={item.icon || 'cube-outline'} size={44} color={colors.text} />
          </View>
        )}

        <Pressable
          style={styles.bookmark}
          onPress={onToggleSave}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved items' : 'Save item'}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={colors.text}
          />
        </Pressable>

        <View style={styles.badgePos}>
          <StatusBadge type={item.type} />
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoText}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.text} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', aspectRatio: 1, borderRadius: radius.sm },
  noImage: {
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePos: { position: 'absolute', left: spacing.sm, bottom: spacing.sm },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  infoText: { flex: 1, marginRight: spacing.xs },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  location: { fontSize: 12, color: colors.textMuted, marginLeft: 2, flexShrink: 1 },
});
