import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatTime } from '../utils/format';
import { colors, radius, spacing } from '../theme/colors';

export default function ChatRoomScreen({ route, navigation }) {
  const { chatId } = route.params;
  const { user, getUserById } = useAuth();
  const { chats, items, sendMessage } = useData();
  const [text, setText] = useState('');
  const listRef = useRef(null);

  const chat = chats.find((c) => c.id === chatId);
  const messageCount = chat ? chat.messages.length : 0;

  // Keep the newest message in view
  useEffect(() => {
    const t = setTimeout(() => listRef.current && listRef.current.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messageCount]);

  if (!chat) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Chat" />
        <EmptyState title="Conversation not found" />
      </SafeAreaView>
    );
  }

  const other = getUserById(chat.participantIds.find((id) => id !== user.id));
  const item = items.find((i) => i.id === chat.itemId);

  const send = () => {
    if (!text.trim()) return;
    sendMessage(chat.id, text);
    setText('');
  };

  const renderMessage = ({ item: m }) => {
    const mine = m.senderId === user.id;
    return (
      <View style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={styles.bubbleText}>{m.text}</Text>
          <Text style={styles.bubbleTime}>{formatTime(m.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Pressable
          style={styles.headerInfo}
          onPress={() => item && navigation.navigate('ItemDetails', { itemId: item.id })}
          accessibilityRole="button"
          accessibilityLabel={`${other.name}, about ${item ? item.title : 'an item'}`}
        >
          <Avatar user={other} size={38} />
          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={1}>{other.name}</Text>
            {item ? <Text style={styles.about} numberOfLines={1}>About: {item.title}</Text> : null}
          </View>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={listRef}
          data={chat.messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.safety}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.text} />
              <Text style={styles.safetyText}>
                Stay safe: do not share your phone number here. Use a drop-off point for valuables.
              </Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Say hello to start the conversation.</Text>}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={colors.placeholder}
            multiline
            maxLength={500}
            accessibilityLabel="Message"
          />
          <Pressable
            style={[styles.send, !text.trim() && styles.sendOff]}
            onPress={send}
            disabled={!text.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={20} color={colors.text} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: spacing.xs },
  headerText: { marginLeft: spacing.sm, flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  about: { fontSize: 12.5, color: colors.textMuted },
  messages: { padding: spacing.lg, flexGrow: 1 },
  safety: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
  },
  safetyText: { flex: 1, marginLeft: spacing.sm, fontSize: 12, color: colors.textMuted },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '78%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: colors.text },
  bubbleTime: { fontSize: 11, color: colors.textMuted, alignSelf: 'flex-end', marginTop: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    fontSize: 15,
    color: colors.text,
  },
  send: {
    width: 44,
    height: 44,
    marginLeft: spacing.sm,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOff: { opacity: 0.45 },
});
