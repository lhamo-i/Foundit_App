import React from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import StatusBadge from '../components/StatusBadge';
import StageTracker from '../components/StageTracker';
import ClaimStatusPill from '../components/ClaimStatusPill';
import ContactCard from '../components/ContactCard';
import ItemRow from '../components/ItemRow';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate, timeAgo } from '../utils/format';
import { openClaim } from '../utils/navHelpers';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function ItemDetailsScreen({ route, navigation }) {
  const { itemId } = route.params;
  const { user, getUserById } = useAuth();
  const { items, claims, getMatches, isSaved, toggleSave, openChat, closePost } = useData();

  const item = items.find((i) => i.id === itemId);
  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Item" />
        <EmptyState title="Item not found" message="It may have been removed." />
      </SafeAreaView>
    );
  }

  const poster = getUserById(item.ownerId);
  const isOwner = item.ownerId === user.id;
  const isFound = item.type === 'found';
  const resolved = item.stage === 'resolved';
  const itemClaims = claims.filter((c) => c.itemId === item.id).sort((a, b) => b.createdAt - a.createdAt);
  const myClaim = itemClaims.find((c) => c.claimerId === user.id);
  const matches = isOwner ? getMatches(item) : [];
  const canClaim = !isOwner && !myClaim && (item.stage === 'posted' || item.stage === 'claim_requested');

  const messagePoster = () => {
    const chatId = openChat({ itemId: item.id, otherUserId: item.ownerId, claimId: myClaim ? myClaim.id : null });
    navigation.navigate('ChatRoom', { chatId });
  };

  const confirmClose = () => {
    Alert.alert(
      'Close this post?',
      'Use this if you already got your item back or no longer need the post. Pending claims will be closed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Close post', style: 'destructive', onPress: () => closePost(item.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader
        title="Item Details"
        right={
          <Pressable
            onPress={() => toggleSave(item.id)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={isSaved(item.id) ? 'Remove from saved items' : 'Save item'}
          >
            <Ionicons name={isSaved(item.id) ? 'bookmark' : 'bookmark-outline'} size={24} color={colors.text} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name={item.icon || 'cube-outline'} size={80} color={colors.text} />
          </View>
        )}

        <View style={styles.badgeRow}>
          <StatusBadge type={item.type} />
        </View>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={16} color={colors.textMuted} />
          <Text style={styles.meta}>{item.location}</Text>
          <Ionicons name="calendar-outline" size={16} color={colors.textMuted} style={styles.metaGap} />
          <Text style={styles.meta}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.posterRow}>
          <Avatar user={poster} size={32} />
          <Text style={styles.posterText}>
            {isOwner ? 'Posted by you' : `Posted by ${poster.name}`} · {timeAgo(item.createdAt)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.body}>{item.description || 'No description added.'}</Text>

        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.body}>{item.category}</Text>

        {resolved ? (
          <View style={styles.resolvedBox}>
            <Ionicons name="checkmark-circle" size={22} color={colors.foundText} />
            <Text style={styles.resolvedText}>This post is resolved.</Text>
          </View>
        ) : null}

        {/* ---------- OWNER VIEW ---------- */}
        {isOwner ? (
          <View>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.card}>
              <StageTracker stage={item.stage} />
            </View>

            {!resolved ? (
              <View>
                <Text style={styles.sectionTitle}>Possible matches</Text>
                {matches.length === 0 ? (
                  <Text style={styles.muted}>No matches yet. We will alert you when something similar is posted.</Text>
                ) : (
                  matches.map((m) => (
                    <ItemRow
                      key={m.item.id}
                      item={m.item}
                      onPress={() => navigation.push('ItemDetails', { itemId: m.item.id })}
                    >
                      <View style={styles.matchRow}>
                        <Ionicons name="sparkles-outline" size={16} color={colors.text} />
                        <Text style={styles.matchText}>
                          Match score {m.score}/5 · {m.reasons.join(' · ')}
                        </Text>
                      </View>
                    </ItemRow>
                  ))
                )}
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>{isFound ? 'Claims received' : 'Replies received'}</Text>
            {itemClaims.length === 0 ? (
              <Text style={styles.muted}>Nobody has responded yet.</Text>
            ) : (
              itemClaims.map((c) => {
                const who = getUserById(c.claimerId);
                return (
                  <Pressable
                    key={c.id}
                    style={styles.claimRow}
                    onPress={() => openClaim(navigation, c, user.id)}
                    accessibilityRole="button"
                  >
                    <Avatar user={who} size={40} />
                    <View style={styles.claimText}>
                      <Text style={styles.claimName}>{who.name}</Text>
                      <Text style={styles.claimSub}>
                        #{c.code} · {timeAgo(c.createdAt)}
                      </Text>
                    </View>
                    <ClaimStatusPill status={c.status} />
                  </Pressable>
                );
              })
            )}

            {!resolved && item.stage !== 'claim_approved' && item.stage !== 'handed_over' ? (
              <CustomButton title="Close post" variant="outline" icon="close-circle-outline" onPress={confirmClose} style={styles.btn} />
            ) : null}
          </View>
        ) : (
          /* ---------- VISITOR VIEW ---------- */
          <View>
            <Text style={styles.sectionTitle}>Contact</Text>
            <ContactCard item={item} posterName={poster.name} revealed={!!myClaim} />

            {myClaim ? (
              <View style={styles.myClaim}>
                <Text style={styles.myClaimLabel}>Your claim</Text>
                <ClaimStatusPill status={myClaim.status} />
              </View>
            ) : null}

            {!resolved && !canClaim && !myClaim ? (
              <Text style={styles.muted}>A claim has already been approved for this item.</Text>
            ) : null}

            {canClaim ? (
              <CustomButton
                title={isFound ? 'This Is Mine' : 'I Found This'}
                icon="shield-checkmark-outline"
                variant="dark"
                onPress={() => navigation.navigate('ClaimVerification', { itemId: item.id })}
                style={styles.btn}
              />
            ) : null}
            {myClaim ? (
              <CustomButton
                title="View My Claim"
                icon="document-text-outline"
                variant="dark"
                onPress={() => openClaim(navigation, myClaim, user.id)}
                style={styles.btn}
              />
            ) : null}
            {!resolved ? (
              <CustomButton
                title="Contact Uploader"
                icon="chatbubble-ellipses-outline"
                variant="outline"
                onPress={messagePoster}
                style={styles.btn}
              />
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  image: { width: '100%', height: 240, borderRadius: radius.lg },
  noImage: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  badgeRow: { marginTop: spacing.lg },
  title: { ...typography.title, fontSize: 28, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  meta: { fontSize: 14, color: colors.textMuted, marginLeft: 4 },
  metaGap: { marginLeft: spacing.lg },
  posterRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  posterText: { marginLeft: spacing.sm, fontSize: 13, color: colors.textMuted },
  sectionTitle: { ...typography.heading, marginTop: spacing.xl, marginBottom: spacing.sm },
  body: { ...typography.body, lineHeight: 22 },
  muted: { fontSize: 14, color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg },
  resolvedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.foundBg,
  },
  resolvedText: { marginLeft: spacing.sm, fontSize: 15, fontWeight: '700', color: colors.foundText },
  matchRow: { flexDirection: 'row', alignItems: 'center' },
  matchText: { flex: 1, marginLeft: spacing.sm, fontSize: 13, color: colors.text },
  claimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  claimText: { flex: 1, marginLeft: spacing.md },
  claimName: { fontSize: 15, fontWeight: '700', color: colors.text },
  claimSub: { fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  myClaim: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  myClaimLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  btn: { marginTop: spacing.md },
});
