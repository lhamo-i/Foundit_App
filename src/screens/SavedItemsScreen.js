import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import ItemGrid from '../components/ItemGrid';
import EmptyState from '../components/EmptyState';
import { useData } from '../context/DataContext';
import { colors, spacing } from '../theme/colors';

export default function SavedItemsScreen({ navigation }) {
  const { items, savedIds, toggleSave } = useData();
  const saved = items.filter((i) => savedIds.includes(i.id));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Saved Items" />
      <ItemGrid
        items={saved}
        savedIds={savedIds}
        onToggleSave={toggleSave}
        onItemPress={(item) => navigation.navigate('ItemDetails', { itemId: item.id })}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="bookmark-outline" title="Nothing saved" message="Tap the bookmark on an item to keep it here." />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingTop: spacing.md },
});
