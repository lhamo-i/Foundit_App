import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

// What the claimant sees after asking for a review.
export default function DisputeStatusScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.circle}>
          <Ionicons name="headset-outline" size={56} color={colors.text} />
        </View>
        <Text style={styles.title}>Your request is under review</Text>
        <Text style={styles.text}>
          Our campus team will review your dispute and get back to you.
        </Text>
      </View>
      <View style={styles.buttons}>
        <CustomButton
          title="Back to Home"
          variant="dark"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.title, fontSize: 24, textAlign: 'center' },
  text: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
  buttons: { padding: spacing.xl },
});
