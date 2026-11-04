import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import ClaimStatusBadge from '../components/ClaimStatusBadge';
import EmptyState from '../components/EmptyState';
import { getSampleItem } from '../data/sampleItems';
import { useClaims } from '../context/ClaimsContext';
import { colors, radius, spacing, typography } from '../theme/colors';

// Shows the current state of a claim you submitted (pending or approved).
export default function ClaimSubmittedScreen({ navigation, route }) {
  const { getClaim } = useClaims();
  const claim = getClaim(route.params ? route.params.claimId : null);
  const item = claim ? getSampleItem(claim.itemId) : null;

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

  const approved = claim.status === 'approved';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.checkCircle}>
          <Ionicons name={approved ? 'checkmark-done' : 'checkmark'} size={52} color={colors.text} />
        </View>

        <Text style={styles.title}>{approved ? 'Claim Approved!' : 'Claim Submitted!'}</Text>
        <Text style={styles.text}>
          {approved
            ? 'The uploader approved your claim. Handover arrangements are added in a later stage.'
            : 'Your claim has been submitted. The uploader will review it and make the final decision.'}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Claim</Text>
          <Text style={styles.cardValue}>{claim.id}</Text>
          <Text style={[styles.cardLabel, styles.gap]}>Item</Text>
          <Text style={styles.cardValue}>{item ? item.title : 'Unknown item'}</Text>
          <Text style={[styles.cardLabel, styles.gap]}>Status</Text>
          <ClaimStatusBadge status={claim.status} />
        </View>

        {claim.proofRequested ? (
          <View style={styles.proofBox}>
            <Ionicons name="alert-circle-outline" size={22} color={colors.text} />
            <Text style={styles.proofText}>
              The uploader asked for more proof. Please add a photo to continue.
            </Text>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={22} color={colors.text} />
            <Text style={styles.infoText}>Check My Claims any time to see updates.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttons}>
        {claim.proofRequested ? (
          <CustomButton
            title="Add Proof"
            icon="image-outline"
            onPress={() => navigation.navigate('AdditionalProof', { claimId: claim.id })}
            style={styles.gapButton}
          />
        ) : null}
        <CustomButton title="Back to Home" variant="dark" onPress={goHome} style={styles.gapButton} />
        <CustomButton
          title="View My Claims"
          variant="outline"
          onPress={() => navigation.navigate('ClaimManagement', { mode: 'mine' })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center', padding: spacing.xl, paddingTop: spacing.xxl },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.title, fontSize: 26 },
  text: { ...typography.body, textAlign: 'center', marginTop: spacing.sm, color: colors.textMuted },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  cardLabel: { fontSize: 13, color: colors.textMuted },
  cardValue: { fontSize: 17, fontWeight: '700', color: colors.text },
  gap: { marginTop: spacing.md },
  proofBox: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE7D2',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  proofText: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.text },
  infoBox: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  infoText: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.text },
  buttons: { padding: spacing.xl, paddingTop: spacing.sm },
  gapButton: { marginBottom: spacing.sm },
});
