import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { contactMethodInfo } from '../data/constants';
import { colors, radius, spacing } from '../theme/colors';

// Shows how to reach the poster, but ONLY after a claim has been submitted (contact privacy).
export default function ContactCard({ item, posterName, revealed }) {
  if (!revealed) {
    return (
      <View style={[styles.card, styles.locked]}>
        <Ionicons name="lock-closed-outline" size={22} color={colors.textMuted} />
        <View style={styles.text}>
          <Text style={styles.title}>Contact details are hidden</Text>
          <Text style={styles.sub}>
            Submit a claim to unlock how to reach {posterName || 'the poster'}.
          </Text>
        </View>
      </View>
    );
  }

  const method = contactMethodInfo(item.contactMethod);
  const isChat = item.contactMethod === 'chat' || !item.contactValue;
  return (
    <View style={styles.card}>
      <Ionicons name={method.icon} size={22} color={colors.text} />
      <View style={styles.text}>
        <Text style={styles.title}>{posterName ? `${posterName}'s contact` : 'Poster contact'}</Text>
        <Text style={styles.sub}>
          {isChat
            ? 'Prefers in-app chat. Use the Message button.'
            : `${method.label}: ${item.contactValue}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  locked: { backgroundColor: colors.surfaceLight, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed' },
  text: { flex: 1, marginLeft: spacing.md },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
});
