import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FilterTabs from '../components/FilterTabs';
import ItemGrid from '../components/ItemGrid';
import EmptyState from '../components/EmptyState';
import { useData } from '../context/DataContext';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { items, savedIds, toggleSave, unreadCount } = useData();
  const [filter, setFilter] = useState('All');

  // Open reports only, newest first, matching the All / Lost / Found filter
  const visible = items
    .filter((item) => item.stage !== 'resolved')
    .filter((item) => {
      if (filter === 'Lost') return item.type === 'lost';
      if (filter === 'Found') return item.type === 'found';
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ItemGrid
        items={visible}
        savedIds={savedIds}
        onToggleSave={toggleSave}
        onItemPress={(item) => navigation.navigate('ItemDetails', { itemId: item.id })}
        ListEmptyComponent={
          <EmptyState title="No items yet" message="Lost and found reports will appear here." />
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
              <Pressable
                style={styles.bell}
                onPress={() => navigation.navigate('Notifications')}
                accessibilityRole="button"
                accessibilityLabel={`Notifications, ${unreadCount} unread`}
              >
                <Ionicons name="notifications-outline" size={26} color={colors.text} />
                {unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            </View>

            {/* Search bar: tapping it opens the Search tab with the keyboard ready */}
            <Pressable
              style={styles.searchBar}
              onPress={() => navigation.navigate('Search', { focus: Date.now() })}
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
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.dangerText },

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
