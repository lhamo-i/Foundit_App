import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { colors, radius, spacing } from '../theme/colors';

// A compact item row: picture (or icon), badge, title and location.
export default function ItemSummary({ item }) {
  return (
    <View style={styles.row}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.noImage]}>
          <Ionicons name={item.icon || 'cube-outline'} size={32} color={colors.text} />
        </View>
      )}
      <View style={styles.text}>
        <StatusBadge type={item.type} />
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  thumb: { width: 76, height: 76, borderRadius: radius.sm },
  noImage: { backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, marginLeft: spacing.md },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  location: { fontSize: 13, color: colors.textMuted, marginLeft: 2 },
});
