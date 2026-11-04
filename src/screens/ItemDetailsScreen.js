import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import StatusBadge from '../components/StatusBadge';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { getSampleItem } from '../data/sampleItems';
import { formatDisplayDate } from '../utils/dates';
import { useSaved } from '../context/SavedContext';
import { useClaims } from '../context/ClaimsContext';
import { openClaim } from '../utils/claimNavigation';
import { colors, radius, spacing, typography } from '../theme/colors';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ItemDetailsScreen({ navigation, route }) {
  const { isSaved, toggleSave } = useSaved();
  const { getMyClaimForItem, getClaimsForItem } = useClaims();
  const itemId = route.params ? route.params.itemId : null;
  const item = getSampleItem(itemId);

  if (!item) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Item Details" onBack={() => navigation.goBack()} />
        <EmptyState icon="alert-circle-outline" title="Item not found" message="It may have been removed." />
      </View>
    );
  }

  const saved = isSaved(item.id);
  const isFound = item.type === 'found';

  const myClaim = getMyClaimForItem(item.id);
  const claimsOnMyPost = item.isMine ? getClaimsForItem(item.id) : [];

  // The big button changes depending on who you are and what the post is.
  let buttonTitle;
  let buttonIcon;
  let handleMainAction;

  if (isFound && item.isMine) {
    buttonTitle = `View Claims (${claimsOnMyPost.length})`;
    buttonIcon = 'mail-unread-outline';
    handleMainAction = () =>
      navigation.navigate('ClaimManagement', { mode: 'incoming', itemId: item.id });
  } else if (isFound && myClaim) {
    buttonTitle = 'View My Claim';
    buttonIcon = 'document-text-outline';
    handleMainAction = () => openClaim(navigation, myClaim);
  } else if (isFound) {
    buttonTitle = 'Claim This Item';
    buttonIcon = 'shield-checkmark-outline';
    handleMainAction = () => navigation.navigate('Claim', { itemId: item.id });
  } else {
    buttonTitle = 'I Found This';
    buttonIcon = 'hand-left-outline';
    // PART C / STAGE 5: starts a private in-app chat with the owner.
    handleMainAction = () =>
      Alert.alert('Coming next', 'Private chat with the owner is built in the next part of Stage 2.');
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Item Details"
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => toggleSave(item.id)}
            hitSlop={10}
            style={styles.bookmark}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved items' : 'Save item'}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.text} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Photo area: an icon until real photos arrive in Stage 3 */}
        <View style={styles.photo}>
          <Ionicons name={item.icon} size={90} color={colors.text} />
        </View>

        <View style={styles.badgeRow}>
          <StatusBadge type={item.type} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color={colors.textMuted} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow icon="pricetag-outline" label="Category" value={item.category} />
          <InfoRow
            icon="calendar-outline"
            label={isFound ? 'Date found' : 'Date lost'}
            value={formatDisplayDate(item.date)}
          />
          <InfoRow icon="person-outline" label="Posted by" value={item.postedBy} />
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>

        {isFound && item.isMine ? (
          <View style={styles.notice}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.text} />
            <Text style={styles.noticeText}>
              This is your post. Review claims from other students here. You make the final
              decision.
            </Text>
          </View>
        ) : isFound ? (
          <View style={styles.notice}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.text} />
            <Text style={styles.noticeText}>
              To claim this item you will answer private questions set by the finder. Correct
              answers alone do not guarantee ownership.
            </Text>
          </View>
        ) : (
          <View style={styles.notice}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.text} />
            <Text style={styles.noticeText}>
              If you found this item, you can message the owner privately inside Foundit. No phone
              number or email is shared.
            </Text>
          </View>
        )}

        <CustomButton
          title={buttonTitle}
          icon={buttonIcon}
          variant="dark"
          onPress={handleMainAction}
          style={styles.action}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  bookmark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    height: 240,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: { marginTop: spacing.lg },
  title: { ...typography.title, fontSize: 28, marginTop: spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  locationText: { marginLeft: spacing.xs, fontSize: 16, color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs + 2 },
  infoLabel: { marginLeft: spacing.sm, fontSize: 14, color: colors.textMuted, width: 90 },
  infoValue: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  sectionTitle: { ...typography.heading, marginTop: spacing.xl, marginBottom: spacing.xs },
  description: { ...typography.body, lineHeight: 22 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  noticeText: { flex: 1, marginLeft: spacing.sm, fontSize: 13, color: colors.text, lineHeight: 19 },
  action: { marginTop: spacing.xl },
});
