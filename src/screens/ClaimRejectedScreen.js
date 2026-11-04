import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { useClaims } from '../context/ClaimsContext';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function ClaimRejectedScreen({ navigation, route }) {
  const { getClaim } = useClaims();
  const claim = getClaim(route.params ? route.params.claimId : null);

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });

  if (!claim) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState icon="alert-circle-outline" title="Claim not found" />
        <View style={styles.buttons}>
          <CustomButton title="Back to Home" variant="dark" onPress={goHome} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.circle}>
          <Ionicons name="close" size={56} color={colors.white} />
        </View>
        <Text style={styles.title}>Claim Rejected</Text>
        <Text style={styles.text}>Claim #{claim.id} was rejected.</Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Reason</Text>
          <Text style={styles.reasonText}>
            {claim.rejectionReason || 'No reason was given.'}
          </Text>
        </View>

        {claim.finalDecision ? (
          <View style={styles.finalBox}>
            <Text style={styles.finalTitle}>Final decision by campus staff</Text>
            <Text style={styles.finalText}>{claim.staffNote || 'No note was added.'}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.buttons}>
        {!claim.finalDecision ? (
          <CustomButton
            title="Request Review"
            icon="refresh-outline"
            onPress={() => navigation.navigate('RequestReview', { claimId: claim.id })}
            style={styles.gap}
          />
        ) : null}
        <CustomButton title="Back to Home" variant="outline" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center', padding: spacing.xl, paddingTop: spacing.xxl },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.title, fontSize: 26 },
  text: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  reasonBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.lostBg,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  reasonLabel: { fontSize: 13, fontWeight: '700', color: colors.lostText },
  reasonText: { fontSize: 16, color: colors.lostText, marginTop: 2 },
  finalBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  finalTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  finalText: { fontSize: 15, color: colors.text, marginTop: 2 },
  buttons: { padding: spacing.xl, paddingTop: spacing.sm },
  gap: { marginBottom: spacing.sm },
});
