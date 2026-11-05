import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { colors, radius, spacing } from '../theme/colors';

const FAQ = [
  {
    q: 'How does a claim work?',
    a: 'Tap "This is mine" on a found item and answer the finder\'s question. The finder approves or rejects your claim. After approval you arrange the handover.',
  },
  {
    q: 'Why can I not see the poster\'s contact details?',
    a: 'To protect everyone\'s privacy, contact details unlock only after you submit a claim. Your own contact details are never shown unless you message first.',
  },
  {
    q: 'What happens at pickup?',
    a: 'Show your student / staff ID. The name must match your account. At a drop-off point, staff check your ID and log the pickup.',
  },
  {
    q: 'When is a post marked Resolved?',
    a: 'When the finder taps "Item handed over" and the owner taps "I received it". If one side has not confirmed after 48 hours, we send a reminder.',
  },
  {
    q: 'How do I earn points?',
    a: 'You earn 10 points each time an item you found is returned. Collect the Honest Finder and Campus Hero badges.',
  },
  {
    q: 'My claim was rejected but the item is mine.',
    a: 'Open the rejected claim and tap "Request Review". Add details and a photo, and the campus team will take a look.',
  },
];

export default function HelpScreen() {
  const [open, setOpen] = useState(0);
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Help & Support" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <Pressable
              key={f.q}
              style={styles.card}
              onPress={() => setOpen(isOpen ? -1 : i)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              <View style={styles.qRow}>
                <Text style={styles.q}>{f.q}</Text>
                <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
              </View>
              {isOpen ? <Text style={styles.a}>{f.a}</Text> : null}
            </Pressable>
          );
        })}
        <View style={styles.contact}>
          <Ionicons name="mail-outline" size={22} color={colors.text} />
          <Text style={styles.contactText}>Still stuck? Visit the Security Office at CST or email the Foundit team.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  card: { padding: spacing.lg, marginBottom: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface },
  qRow: { flexDirection: 'row', alignItems: 'center' },
  q: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text, marginRight: spacing.sm },
  a: { fontSize: 14, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
  contact: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceLight },
  contactText: { flex: 1, marginLeft: spacing.md, fontSize: 14, color: colors.text },
});
