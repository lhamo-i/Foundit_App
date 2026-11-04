import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

// Small label showing the state of a claim.
// status is one of: 'pending', 'approved', 'rejected', 'disputed'.
const LOOKS = {
  pending: { label: 'Pending', bg: '#EFE7D2', fg: colors.text, icon: 'time-outline' },
  approved: { label: 'Approved', bg: colors.foundBg, fg: colors.foundText, icon: 'checkmark-circle' },
  rejected: { label: 'Rejected', bg: colors.lostBg, fg: colors.lostText, icon: 'close-circle' },
  disputed: { label: 'Under review', bg: colors.surface, fg: colors.text, icon: 'eye-outline' },
};

export default function ClaimStatusBadge({ status }) {
  const look = LOOKS[status] || LOOKS.pending;
  return (
    <View style={[styles.badge, { backgroundColor: look.bg }]}>
      <Ionicons name={look.icon} size={14} color={look.fg} />
      <Text style={[styles.text, { color: look.fg }]}>{look.label}</Text>
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
