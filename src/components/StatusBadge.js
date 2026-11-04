import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

// Small "Lost" (red) or "Found" (green) label. type is 'lost' or 'found'.
// It uses an icon AND text, so it doesn't rely on colour alone.
export default function StatusBadge({ type }) {
  const isLost = type === 'lost';

  return (
    <View style={[styles.badge, { backgroundColor: isLost ? colors.lostBg : colors.foundBg }]}>
      <Ionicons
        name={isLost ? 'alert-circle' : 'checkmark-circle'}
        size={14}
        color={isLost ? colors.lostText : colors.foundText}
      />
      <Text style={[styles.text, { color: isLost ? colors.lostText : colors.foundText }]}>
        {isLost ? 'Lost' : 'Found'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  text: { fontSize: 12, fontWeight: '700', marginLeft: 4 },
});
