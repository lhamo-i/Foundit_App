import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme/colors';

// TEMPORARY: stands in for screens we build in Stage 2.
export default function ScreenPlaceholder({ title, icon }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.center}>
        <Ionicons name={icon} size={56} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>This screen is built in Stage 2.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
});
