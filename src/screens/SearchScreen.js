import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import FilterTabs from '../components/FilterTabs';
import Dropdown from '../components/Dropdown';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { SAMPLE_ITEMS } from '../data/sampleItems';
import { CATEGORIES, LOCATIONS } from '../utils/constants';
import { padToEven, savedFirst } from '../utils/listHelpers';
import { useSaved } from '../context/SavedContext';
import { colors, radius, spacing, typography } from '../theme/colors';

const ALL_CATEGORIES = 'All categories';
const ALL_LOCATIONS = 'All locations';

export default function SearchScreen({ navigation }) {
  const { isSaved, toggleSave } = useSaved();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [location, setLocation] = useState(ALL_LOCATIONS);

  const results = SAMPLE_ITEMS.filter((item) => {
    const matchesName = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter.toLowerCase();
    const matchesCategory = category === ALL_CATEGORIES || item.category === category;
    const matchesLocation = location === ALL_LOCATIONS || item.location === location;
    return matchesName && matchesType && matchesCategory && matchesLocation;
  });

  const hasFilters =
    query !== '' ||
    typeFilter !== 'All' ||
    category !== ALL_CATEGORIES ||
    location !== ALL_LOCATIONS;

  const clearAll = () => {
    setQuery('');
    setTypeFilter('All');
    setCategory(ALL_CATEGORIES);
    setLocation(ALL_LOCATIONS);
  };

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
    <View style={styles.container}>
      <ScreenHeader title="Search" />

      <View style={styles.filters}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by item name"
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <FilterTabs
          options={['All', 'Lost', 'Found']}
          selected={typeFilter}
          onSelect={setTypeFilter}
          style={styles.tabs}
        />

        <View style={styles.dropRow}>
          <Dropdown
            style={styles.dropHalf}
            placeholder="Category"
            options={[ALL_CATEGORIES, ...CATEGORIES]}
            value={category}
            onChange={setCategory}
          />
          <Dropdown
            style={styles.dropHalf}
            placeholder="Location"
            options={[ALL_LOCATIONS, ...LOCATIONS]}
            value={location}
            onChange={setLocation}
          />
        </View>

        <View style={styles.countRow}>
          <Text style={typography.caption}>
            {results.length} {results.length === 1 ? 'item' : 'items'} found
          </Text>
          {hasFilters ? (
            <Pressable onPress={clearAll} accessibilityRole="button">
              <Text style={styles.clear}>Clear filters</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={padToEven(savedFirst(results, isSaved))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No matching items"
            message="Try a different name or clear the filters."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { paddingHorizontal: spacing.lg },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.inputBg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, fontSize: 15, color: colors.text, paddingVertical: 8 },
  tabs: { marginTop: spacing.md, marginBottom: spacing.md },
  dropRow: { flexDirection: 'row', gap: spacing.md },
  dropHalf: { flex: 1, marginBottom: spacing.sm },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  clear: { fontSize: 13, fontWeight: '700', color: colors.text, textDecorationLine: 'underline' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: { gap: spacing.md, marginBottom: spacing.md },
  spacer: { flex: 1 },
});
