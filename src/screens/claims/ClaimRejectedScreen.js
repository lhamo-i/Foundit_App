import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';
import { useData } from '../../context/DataContext';
import { colors, radius, spacing, typography } from '../../theme/colors';

export default function ClaimRejectedScreen({ route, navigation }) {
  const { claimId } = route.params;
  const { claims } = useData();
  const claim = claims.find((c) => c.id === claimId);

  if (!claim) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState title="Claim not found" />
      </SafeAreaView>
    );
  }

  const underReview = !!claim.review;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.circle}>
          <Ionicons name="close" size={56} color={colors.dangerText} />
        </View>
        <Text style={styles.title}>Claim Rejected</Text>
        <Text style={styles.sub}>The claim has been rejected.</Text>
        <View style={styles.reason}>
          <Text style={styles.reasonLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{claim.rejectReason || 'Answers did not match.'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {underReview ? (
          <CustomButton
            title="View Review Status"
            variant="dark"
            onPress={() => navigation.navigate('DisputeReview', { claimId })}
          />
        ) : (
          <CustomButton
            title="Request Review"
            variant="dark"
            onPress={() => navigation.navigate('RequestReview', { claimId })}
          />
        )}
        <CustomButton
          title="View Claim Details"
          variant="outline"
          onPress={() => navigation.navigate('ClaimDetails', { claimId })}
          style={styles.second}
        />
        <CustomButton
          title="Back to Home"
          variant="outline"
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
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title, fontSize: 28, marginTop: spacing.xl },
  sub: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm },
  reason: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lostBg,
  },
  reasonLabel: { fontSize: 13, fontWeight: '700', color: colors.lostText },
  reasonText: { fontSize: 15, color: colors.lostText, marginTop: 2, textAlign: 'center' },
  actions: { paddingBottom: spacing.md },
  second: { marginTop: spacing.md },
});
