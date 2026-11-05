import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ItemCard from './ItemCard';
import { spacing } from '../theme/colors';

// The 2-column grid of item cards (used by Home, Search and Saved Items).
export default function ItemGrid({
  items,
  savedIds,
  onItemPress,
  onToggleSave,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}) {
  // If the count is odd, add an invisible spacer so the last card doesn't stretch.
  const data = items.length % 2 === 1 ? [...items, { id: '__spacer', spacer: true }] : items;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.list, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={({ item }) =>
        item.spacer ? (
          <View style={styles.spacer} />
        ) : (
          <ItemCard
            item={item}
            saved={savedIds.includes(item.id)}
            onPress={() => onItemPress(item)}
            onToggleSave={() => onToggleSave(item.id)}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: { gap: spacing.md, marginBottom: spacing.md },
  spacer: { flex: 1 },
});
