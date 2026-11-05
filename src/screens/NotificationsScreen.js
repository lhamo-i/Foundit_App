import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { timeAgo } from '../utils/format';
import { openClaim } from '../utils/navHelpers';
import { colors, radius, spacing } from '../theme/colors';

// Icon + tint for each kind of notification
const LOOK = {
  match: { icon: 'sparkles', bg: colors.surfaceLight, fg: colors.text },
  claim: { icon: 'shield-checkmark', bg: colors.surfaceLight, fg: colors.text },
  claim_status: { icon: 'time', bg: colors.pendingBg, fg: colors.pendingText },
  claim_result: { icon: 'checkmark-done', bg: colors.foundBg, fg: colors.foundText },
  proof: { icon: 'image', bg: colors.pendingBg, fg: colors.pendingText },
  message: { icon: 'chatbubble', bg: colors.surfaceLight, fg: colors.text },
  handover: { icon: 'swap-horizontal', bg: colors.surfaceLight, fg: colors.text },
  reminder: { icon: 'alarm', bg: colors.pendingBg, fg: colors.pendingText },
  resolved: { icon: 'trophy', bg: colors.foundBg, fg: colors.foundText },
};

export default function NotificationsScreen({ navigation }) {
  const { user } = useAuth();
  const { myNotifications, claims, markRead, markAllRead, unreadCount } = useData();
  const list = [...myNotifications].sort((a, b) => b.createdAt - a.createdAt);

  // Open the screen the notification is about
  const open = (n) => {
    markRead(n.id);
    if (n.chatId) {
      navigation.navigate('ChatRoom', { chatId: n.chatId });
    } else if (n.claimId) {
      const claim = claims.find((c) => c.id === n.claimId);
      if (claim) openClaim(navigation, claim, user.id);
    } else if (n.itemId) {
      navigation.navigate('ItemDetails', { itemId: n.itemId });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Notifications"
        right={
          unreadCount > 0 ? (
            <Pressable onPress={markAllRead} hitSlop={8} accessibilityRole="button" accessibilityLabel="Mark all as read">
              <Ionicons name="checkmark-done" size={24} color={colors.text} />
            </Pressable>
          ) : null
        }
      />
      <FlatList
        data={list}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="All caught up" message="New alerts about your posts and claims show up here." />
        }
        renderItem={({ item: n }) => {
          const look = LOOK[n.type] || LOOK.claim;
          return (
            <Pressable
              onPress={() => open(n)}
              style={({ pressed }) => [styles.row, !n.read && styles.rowUnread, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${n.title}. ${n.body}. ${n.read ? 'Read' : 'Unread'}`}
            >
              <View style={[styles.icon, { backgroundColor: look.bg }]}>
                <Ionicons name={look.icon} size={22} color={look.fg} />
              </View>
              <View style={styles.text}>
                <Text style={[styles.title, !n.read && styles.titleUnread]}>{n.title}</Text>
                <Text style={styles.body} numberOfLines={2}>{n.body}</Text>
                <Text style={styles.time}>{timeAgo(n.createdAt)}</Text>
              </View>
              {!n.read ? <View style={styles.dot} /> : null}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  rowUnread: { backgroundColor: colors.surface, borderColor: colors.surface },
  pressed: { opacity: 0.85 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, marginHorizontal: spacing.md },
  title: { fontSize: 15, color: colors.text, fontWeight: '600' },
  titleUnread: { fontWeight: '800' },
  body: { fontSize: 13.5, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger },
});
