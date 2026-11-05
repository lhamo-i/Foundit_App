import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import FilterTabs from '../components/FilterTabs';
import ItemRow from '../components/ItemRow';
import StageTracker from '../components/StageTracker';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { colors, spacing } from '../theme/colors';

export default function MyPostsScreen({ navigation }) {
  const { user } = useAuth();
  const { items, claims } = useData();
  const [tab, setTab] = useState('Active');

  const posts = items
    .filter((i) => i.ownerId === user.id)
    .filter((i) => (tab === 'Active' ? i.stage !== 'resolved' : i.stage === 'resolved'))
    .sort((a, b) => b.createdAt - a.createdAt);

  const renderPost = ({ item }) => {
    const pending = claims.filter((c) => c.itemId === item.id && c.status === 'pending');
    const approved = claims.find((c) => c.id === item.approvedClaimId);
    return (
      <ItemRow item={item} onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}>
        <StageTracker stage={item.stage} />
        {pending.length > 0 ? (
          <CustomButton
            title={`Review ${pending.length} ${pending.length === 1 ? 'claim' : 'claims'}`}
            variant="dark"
            icon="shield-checkmark-outline"
            onPress={() => navigation.navigate('ClaimDetails', { claimId: pending[0].id })}
            style={styles.btn}
          />
        ) : null}
        {approved && item.stage !== 'resolved' ? (
          <CustomButton
            title={item.stage === 'handed_over' && item.finderConfirmed ? 'Track handover' : 'Manage handover'}
            variant="dark"
            icon="swap-horizontal-outline"
            onPress={() => navigation.navigate('ClaimDetails', { claimId: approved.id })}
            style={styles.btn}
          />
        ) : null}
      </ItemRow>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="My Posts" />
      <View style={styles.tabs}>
        <FilterTabs options={['Active', 'Resolved']} selected={tab} onSelect={setTab} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="albums-outline"
            title={tab === 'Active' ? 'No active posts' : 'Nothing resolved yet'}
            message={tab === 'Active' ? 'Tap the + button to report a lost or found item.' : 'Returned items will appear here.'}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabs: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  btn: { marginTop: spacing.md, minHeight: 44 },
});
