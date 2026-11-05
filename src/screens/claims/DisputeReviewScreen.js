import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { colors, spacing, typography } from '../../theme/colors';

export default function DisputeReviewScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.circle}>
          <Ionicons name="headset-outline" size={56} color={colors.text} />
        </View>
        <Text style={styles.title}>Your request is under review</Text>
        <Text style={styles.sub}>
          Our campus team will review your dispute and get back to you soon.
        </Text>
      </View>
      <CustomButton
        title="Back to Home"
        variant="dark"
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title, fontSize: 24, marginTop: spacing.xl, textAlign: 'center' },
  sub: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});
