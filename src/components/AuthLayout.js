import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

// Shared page shape for Login, Register and Forgot Password:
// small logo, title, subtitle, then the form (children).
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Ionicons name="search" size={32} color={colors.text} />
          </View>
          <Text style={styles.brand}>Foundit</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.form}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.xl, alignItems: 'center' },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  brand: { ...typography.title, marginTop: spacing.sm },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.xl },
  subtitle: { ...typography.caption, fontSize: 14, marginTop: spacing.xs, textAlign: 'center' },
  form: { width: '100%', marginTop: spacing.xl },
});
