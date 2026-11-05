import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';

// Top bar for stack screens: back arrow, centred title, optional right-hand button.
export default function ScreenHeader({ title, onBack, right, showBack = true }) {
  const navigation = useNavigation();
  const goBack = onBack || (() => navigation.goBack());

  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={goBack}
            hitSlop={10}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>{right || null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  side: { width: 48, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.heading, flex: 1, textAlign: 'center' },
});
