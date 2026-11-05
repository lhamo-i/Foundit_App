import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

const LOOK = {
  pending: { bg: colors.pendingBg, fg: colors.pendingText, icon: 'time-outline', label: 'Pending' },
  approved: { bg: colors.foundBg, fg: colors.foundText, icon: 'checkmark-circle', label: 'Approved' },
  rejected: { bg: colors.lostBg, fg: colors.lostText, icon: 'close-circle', label: 'Rejected' },
};

// "Pending", "Approved" or "Rejected" label (icon + text, so it doesn't rely on colour alone).
export default function ClaimStatusPill({ status }) {
  const look = LOOK[status] || LOOK.pending;
  return (
    <View style={[styles.pill, { backgroundColor: look.bg }]}>
      <Ionicons name={look.icon} size={13} color={look.fg} />
      <Text style={[styles.text, { color: look.fg }]}>{look.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  text: { fontSize: 12, fontWeight: '700', marginLeft: 4 },
});
