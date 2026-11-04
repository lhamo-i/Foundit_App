import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FilterTabs from '../components/FilterTabs';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { SAMPLE_ITEMS } from '../data/sampleItems';
import { padToEven, savedFirst } from '../utils/listHelpers';
import { useSaved } from '../context/SavedContext';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  // "State" = data the screen remembers. When it changes, the screen redraws.
  const [filter, setFilter] = useState('All');
  const { isSaved, toggleSave } = useSaved();

  // Keep only the items that match the selected filter
  const visible = SAMPLE_ITEMS.filter((item) => {
    if (filter === 'Lost') return item.type === 'lost';
    if (filter === 'Found') return item.type === 'found';
    return true;
  });

  const renderItem = ({ item }) => {
    if (item.spacer) return <View style={styles.spacer} />;
    return (
      <ItemCard
        item={item}
        saved={isSaved(item.id)}
        onToggleSave={() => toggleSave(item.id)}
        onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={padToEven(savedFirst(visible, isSaved))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No items yet"
            message="Lost and found reports will appear here."
          />
        }
        ListHeaderComponent={
          <View>
            {/* Top bar: logo, name and notification bell */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="search" size={22} color={colors.text} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appName}>Foundit</Text>
                <Text style={styles.tagline}>Find it. Report it. Get it back.</Text>
              </View>
              <View style={styles.bell}>
                <Ionicons name="notifications-outline" size={26} color={colors.text} />
                <View style={styles.bellDot} />
              </View>
            </View>

            {/* Search bar: tapping it opens the Search tab */}
            <Pressable
              style={styles.searchBar}
              onPress={() => navigation.navigate('Search')}
              accessibilityRole="button"
              accessibilityLabel="Search items"
            >
              <Ionicons name="search-outline" size={20} color={colors.textMuted} />
              <Text style={styles.searchText}>Search items...</Text>
            </Pressable>

            <FilterTabs
              options={['All', 'Lost', 'Found']}
              selected={filter}
              onSelect={setFilter}
              style={styles.filters}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: { gap: spacing.md, marginBottom: spacing.md },
  spacer: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, marginLeft: spacing.md },
  appName: { ...typography.title },
  tagline: { ...typography.caption },
  bell: { padding: spacing.xs },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.inputBg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchText: { marginLeft: spacing.sm, fontSize: 15, color: colors.placeholder },
  filters: { marginVertical: spacing.lg },
});
