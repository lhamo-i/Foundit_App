import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme/colors';

// Our own bottom bar, matching the design: four normal tabs
// and a raised round "Post" button in the middle.
// React Navigation gives us state, descriptors and navigation automatically.
const ICONS = {
  Home: { on: 'home', off: 'home-outline' },
  Search: { on: 'search', off: 'search-outline' },
  Chat: { on: 'chatbubble', off: 'chatbubble-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

export default function BottomNavigation({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, shadow.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = descriptors[route.key].options.title || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // The raised centre button
        if (route.name === 'Post') {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.postWrap}
              accessibilityRole="button"
              accessibilityLabel="Post an item"
            >
              <View style={styles.postCircle}>
                <Ionicons name="add" size={32} color={colors.text} />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
            </Pressable>
          );
        }

        const icons = ICONS[route.name];
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <Ionicons
              name={isFocused ? icons.on : icons.off}
              size={24}
              color={isFocused ? colors.text : colors.textMuted}
            />
            <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
            <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  tab: { flex: 1, alignItems: 'center' },
  postWrap: { flex: 1, alignItems: 'center', marginTop: -14 },
  postCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  labelActive: { color: colors.text, fontWeight: '700' },
  indicator: { height: 3, width: 24, borderRadius: 2, marginTop: 3, backgroundColor: 'transparent' },
  indicatorActive: { backgroundColor: colors.primary },
});
