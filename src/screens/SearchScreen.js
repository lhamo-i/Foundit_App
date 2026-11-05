import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FilterTabs from '../components/FilterTabs';
import ChipRow from '../components/ChipRow';
import ItemGrid from '../components/ItemGrid';
import EmptyState from '../components/EmptyState';
import { useData } from '../context/DataContext';
import { CATEGORY_NAMES, LOCATIONS } from '../data/constants';
import { colors, radius, spacing, typography } from '../theme/colors';

const ALL_CATEGORIES = 'All categories';
const ALL_LOCATIONS = 'All locations';

export default function SearchScreen({ navigation, route }) {
  const { items, savedIds, toggleSave } = useData();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [location, setLocation] = useState(ALL_LOCATIONS);

  // Home's search bar sends { focus: timestamp } so the keyboard opens here.
  const focusStamp = route.params && route.params.focus;
  useEffect(() => {
    if (focusStamp) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [focusStamp]);

  const q = query.trim().toLowerCase();
  const results = items
    .filter((i) => i.stage !== 'resolved')
    .filter((i) => type === 'All' || i.type === type.toLowerCase())
    .filter((i) => category === ALL_CATEGORIES || i.category === category)
    .filter((i) => location === ALL_LOCATIONS || i.location === location)
    .filter(
      (i) =>
        !q ||
        i.title.toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  const filtersActive = type !== 'All' || category !== ALL_CATEGORIES || location !== ALL_LOCATIONS || !!q;
  const clearAll = () => {
    setQuery('');
    setType('All');
    setCategory(ALL_CATEGORIES);
    setLocation(ALL_LOCATIONS);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ItemGrid
        items={results}
        savedIds={savedIds}
        onToggleSave={toggleSave}
        onItemPress={(item) => navigation.navigate('ItemDetails', { itemId: item.id })}
        ListEmptyComponent={
          <EmptyState icon="search-outline" title="No matches" message="Try a different word or clear the filters." />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Search</Text>

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color={colors.textMuted} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Search items..."
                placeholderTextColor={colors.placeholder}
                returnKeyType="search"
                accessibilityLabel="Search items"
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>

            <FilterTabs options={['All', 'Lost', 'Found']} selected={type} onSelect={setType} style={styles.rowGap} />
            <ChipRow options={[ALL_CATEGORIES, ...CATEGORY_NAMES]} selected={category} onSelect={setCategory} style={styles.rowGapSm} />
            <ChipRow options={[ALL_LOCATIONS, ...LOCATIONS]} selected={location} onSelect={setLocation} style={styles.rowGapSm} />

            <View style={styles.countRow}>
              <Text style={styles.count}>
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </Text>
              {filtersActive ? (
                <Pressable onPress={clearAll} accessibilityRole="button">
                  <Text style={styles.clear}>Clear all</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.title, marginTop: spacing.sm },
  searchBox: {
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
  input: { flex: 1, marginLeft: spacing.sm, fontSize: 15, color: colors.text, paddingVertical: 10 },
  rowGap: { marginTop: spacing.lg },
  rowGapSm: { marginTop: spacing.sm },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  count: { ...typography.caption },
  clear: { fontSize: 13, fontWeight: '700', color: colors.text, textDecorationLine: 'underline' },
});
