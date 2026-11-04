import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import FilterTabs from '../components/FilterTabs';
import ClaimStatusBadge from '../components/ClaimStatusBadge';
import EmptyState from '../components/EmptyState';
import { getSampleItem } from '../data/sampleItems';
import { useClaims } from '../context/ClaimsContext';
import { openClaim } from '../utils/claimNavigation';
import { colors, radius, spacing, shadow } from '../theme/colors';

// One screen, two modes:
//   mode 'incoming' = claims other people made on YOUR Found posts (you review them)
//   mode 'mine'     = claims YOU made on other people's items
// Optional itemId limits "incoming" to claims on one post.
export default function ClaimManagementScreen({ navigation, route }) {
  const { claims } = useClaims();
  const params = route.params || {};
  const mode = params.mode === 'mine' ? 'mine' : 'incoming';
  const itemId = params.itemId;
  const [filter, setFilter] = useState('All');

  let list = claims.filter((claim) => {
    const item = getSampleItem(claim.itemId);
    if (mode === 'mine') return claim.claimantIsMe;
    return item && item.isMine && (!itemId || claim.itemId === itemId);
  });

  list = list.filter((claim) => {
    if (filter === 'Pending') return claim.status === 'pending' || claim.status === 'disputed';
    if (filter === 'Resolved') return claim.status === 'approved' || claim.status === 'rejected';
    return true;
  });

  const handlePress = (claim) => {
    if (mode === 'mine') openClaim(navigation, claim);
    else navigation.navigate('ClaimReview', { claimId: claim.id });
  };

  const renderItem = ({ item: claim }) => {
    const post = getSampleItem(claim.itemId);
    return (
      <Pressable
        onPress={() => handlePress(claim)}
        style={({ pressed }) => [styles.row, shadow.card, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        <View style={styles.thumb}>
          <Ionicons name={post ? post.icon : 'cube-outline'} size={28} color={colors.text} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {post ? post.title : 'Unknown item'}
          </Text>
          <Text style={styles.rowSub} numberOfLines={1}>
            #{claim.id}  •  {mode === 'incoming' ? claim.claimantName : claim.submittedLabel}
          </Text>
          <View style={styles.badgeGap}>
            <ClaimStatusBadge status={claim.status} />
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === 'mine' ? 'My Claims' : 'Incoming Claims'}
        onBack={() => navigation.goBack()}
      />
      <FilterTabs
        options={['All', 'Pending', 'Resolved']}
        selected={filter}
        onSelect={setFilter}
        style={styles.tabs}
      />
      <FlatList
        data={list}
        keyExtractor={(claim) => claim.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No claims here"
            message={
              mode === 'mine'
                ? 'Claims you submit will appear here.'
                : 'When someone claims your Found item, it will appear here.'
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabs: { paddingHorizontal: spacing.lg, marginVertical: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.85 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, marginHorizontal: spacing.md },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  rowSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badgeGap: { marginTop: spacing.xs },
});
