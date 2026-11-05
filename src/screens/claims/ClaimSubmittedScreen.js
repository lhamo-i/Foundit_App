import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { colors, radius, spacing, typography } from '../../theme/colors';

export default function ClaimSubmittedScreen({ route, navigation }) {
  const { claimId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.circle}>
          <Ionicons name="checkmark" size={56} color={colors.background} />
        </View>
        <Text style={styles.title}>Claim Submitted!</Text>
        <Text style={styles.sub}>Your claim has been submitted and is under review.</Text>

        <View style={styles.info}>
          <Ionicons name="information-circle" size={22} color={colors.text} />
          <Text style={styles.infoText}>You'll be notified once the uploader responds.</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="View My Claim"
          variant="outline"
          onPress={() => navigation.replace('ClaimDetails', { claimId })}
        />
        <CustomButton
          title="Back to Home"
          variant="dark"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          style={styles.second}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.foundText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title, fontSize: 28, marginTop: spacing.xl },
  sub: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  infoText: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.text },
  actions: { paddingBottom: spacing.md },
  second: { marginTop: spacing.md },
});
