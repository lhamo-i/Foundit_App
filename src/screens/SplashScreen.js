import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { colors, radius, spacing } from '../theme/colors';

// First screen: logo, name, tagline and a Get Started button.
export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Soft decorative circles in the palette */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.center}>
        <View style={styles.logo}>
          <Ionicons name="search" size={56} color={colors.text} />
        </View>
        <Text style={styles.name}>Foundit</Text>
        <Text style={styles.tagline}>Find it. Report it. Get it back.</Text>
        <Text style={styles.campus}>CST Campus Lost & Found</Text>
      </View>

      <View style={styles.bottom}>
        <CustomButton
          title="Get Started"
          variant="dark"
          icon="arrow-forward"
          onPress={() => navigation.replace('Login')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  circleTop: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.surface,
    opacity: 0.7,
  },
  circleBottom: {
    position: 'absolute',
    bottom: 90,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  logo: {
    width: 120,
    height: 120,
    borderRadius: radius.lg + 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  name: { fontSize: 42, fontWeight: '800', color: colors.text },
  tagline: { fontSize: 16, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  campus: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  bottom: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
