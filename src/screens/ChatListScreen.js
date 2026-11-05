import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { timeAgo } from '../utils/format';
import { colors, radius, spacing, typography, shadow } from '../theme/colors';

export default function ChatListScreen({ navigation }) {
  const { user, getUserById } = useAuth();
  const { chats, items } = useData();

  const rows = chats
    .filter((c) => c.participantIds.includes(user.id))
    .map((c) => {
      const last = c.messages[c.messages.length - 1];
      return {
        chat: c,
        last,
        other: getUserById(c.participantIds.find((id) => id !== user.id)),
        item: items.find((i) => i.id === c.itemId),
        sortKey: last ? last.createdAt : 0,
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.chat.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.title}>Chat</Text>}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No conversations yet"
            message='Open an item and tap "Contact Uploader" to start one.'
          />
        }
        renderItem={({ item: r }) => (
          <Pressable
            style={({ pressed }) => [styles.row, shadow.card, pressed && styles.pressed]}
            onPress={() => navigation.navigate('ChatRoom', { chatId: r.chat.id })}
            accessibilityRole="button"
            accessibilityLabel={`Chat with ${r.other.name}`}
          >
            <Avatar user={r.other} size={50} />
            <View style={styles.text}>
              <Text style={styles.name} numberOfLines={1}>{r.other.name}</Text>
              {r.item ? <Text style={styles.about} numberOfLines={1}>About: {r.item.title}</Text> : null}
              <Text style={styles.preview} numberOfLines={1}>
                {r.last ? `${r.last.senderId === user.id ? 'You: ' : ''}${r.last.text}` : 'No messages yet'}
              </Text>
            </View>
            {r.last ? <Text style={styles.time}>{timeAgo(r.last.createdAt)}</Text> : null}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  title: { ...typography.title, marginTop: spacing.sm, marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.85 },
  text: { flex: 1, marginHorizontal: spacing.md },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  about: { fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  preview: { fontSize: 14, color: colors.text, marginTop: 2 },
  time: { fontSize: 12, color: colors.textMuted },
});
