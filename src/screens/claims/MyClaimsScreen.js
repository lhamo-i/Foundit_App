import React, { useState } from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import FilterTabs from '../../components/FilterTabs';
import ClaimStatusPill from '../../components/ClaimStatusPill';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { timeAgo } from '../../utils/format';
import { openClaim } from '../../utils/navHelpers';
import { colors, radius, spacing, shadow } from '../../theme/colors';

export default function MyClaimsScreen({ navigation }) {
  const { user, getUserById } = useAuth();
  const { claims, items } = useData();
  const [scope, setScope] = useState('Sent');
  const [status, setStatus] = useState('All');

  // "Sent" = claims I made. "Received" = claims on my posts.
  const rows = claims
    .map((c) => ({ claim: c, item: items.find((i) => i.id === c.itemId) }))
    .filter((r) => r.item)
    .filter((r) => (scope === 'Sent' ? r.claim.claimerId === user.id : r.item.ownerId === user.id))
    .filter((r) => {
      if (status === 'Pending') return r.claim.status === 'pending';
      if (status === 'Resolved') return r.claim.status !== 'pending';
      return true;
    })
    .sort((a, b) => b.claim.createdAt - a.claim.createdAt);

  const renderRow = ({ item: { claim, item } }) => {
    const who = getUserById(claim.claimerId);
    const resolved = claim.status !== 'pending';
    return (
      <Pressable
        style={({ pressed }) => [styles.row, shadow.card, pressed && styles.pressed]}
        onPress={() => openClaim(navigation, claim, user.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, claim ${claim.code}, ${claim.status}`}
      >
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.noThumb]}>
            <Ionicons name={item.icon || 'cube-outline'} size={26} color={colors.text} />
          </View>
        )}
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.code}>
            #{claim.code}{scope === 'Received' ? ` · ${who.name}` : ''}
          </Text>
          <Text style={styles.time}>
            {resolved ? 'Resolved' : 'Submitted'} · {timeAgo(claim.resolvedAt || claim.createdAt)}
          </Text>
        </View>
        <View style={styles.right}>
          <ClaimStatusPill status={claim.status} />
          <Ionicons name="chevron-forward" size={18} color={colors.text} style={styles.chev} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="My Claims" />
      <View style={styles.filters}>
        <FilterTabs options={['Sent', 'Received']} selected={scope} onSelect={setScope} />
        <FilterTabs options={['All', 'Pending', 'Resolved']} selected={status} onSelect={setStatus} style={styles.statusRow} />
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.claim.id}
        renderItem={renderRow}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No claims here"
            message={scope === 'Sent' ? 'Claims you make on other posts appear here.' : 'Claims on your posts appear here.'}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  statusRow: { marginTop: spacing.md, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.85 },
  thumb: { width: 56, height: 56, borderRadius: radius.sm },
  noThumb: { backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, marginLeft: spacing.md, marginRight: spacing.sm },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  code: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end' },
  chev: { marginTop: spacing.sm },
});
