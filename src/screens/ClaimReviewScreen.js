import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import ItemSummary from '../components/ItemSummary';
import ClaimStatusBadge from '../components/ClaimStatusBadge';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { getSampleItem } from '../data/sampleItems';
import { useClaims } from '../context/ClaimsContext';
import { useSession } from '../context/SessionContext';
import { colors, radius, spacing, typography } from '../theme/colors';

// The uploader reviews one claim: answers, proof, then Approve or Reject.
export default function ClaimReviewScreen({ navigation, route }) {
  const { getClaim, approveClaim, rejectClaim, requestProof } = useClaims();
  const { isStaff } = useSession();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');

  const claim = getClaim(route.params ? route.params.claimId : null);
  const item = claim ? getSampleItem(claim.itemId) : null;

  // Only the uploader (or campus staff) may review.
  // STAGE 6: Firestore Security Rules enforce this on the server too.
  if (!claim || !item || (!item.isMine && !isStaff)) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Claim Details" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="lock-closed-outline"
          title="Not available"
          message="Only the uploader can review this claim."
        />
      </View>
    );
  }

  const canDecide = claim.status === 'pending';

  const handleApprove = () => {
    Alert.alert(
      'Approve this claim?',
      `${claim.claimantName} (ID ${claim.claimantId}) will be treated as the owner. Only one claim can be approved for an item.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            const result = approveClaim(claim.id);
            if (!result.ok) {
              Alert.alert('Could not approve', result.message);
              return;
            }
            Alert.alert('Claim approved', 'Chat and handover are added in the next parts.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert('Reject this claim?', 'The claimant will see your reason, if you gave one.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          rejectClaim(claim.id, reason.trim());
          navigation.goBack();
        },
      },
    ]);
  };

  const handleRequestProof = () => {
    Alert.alert('Ask for more proof?', 'The claimant will be asked to upload a photo.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Ask',
        onPress: () => {
          requestProof(claim.id);
          Alert.alert('Request sent', 'The claim stays pending until they respond.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Claim Details" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ItemSummary item={item} />

          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.claimId}>Claim #{claim.id}</Text>
              <ClaimStatusBadge status={claim.status} />
            </View>
            <Text style={styles.label}>Claimant</Text>
            <Text style={styles.value}>{claim.claimantName}</Text>
            <Text style={styles.label}>Student/Staff ID</Text>
            <Text style={styles.value}>{claim.claimantId}</Text>
            <Text style={styles.label}>Submitted</Text>
            <Text style={styles.value}>{claim.submittedLabel}</Text>
          </View>

          <Text style={styles.sectionTitle}>Answers provided</Text>
          {claim.answers.map((a, index) => (
            <View key={a.question} style={styles.answer}>
              <Text style={styles.question}>
                {index + 1}. {a.question}
              </Text>
              <Text style={styles.answerText}>{a.answer}</Text>
            </View>
          ))}
          <Text style={styles.hint}>
            Matching answers do not prove ownership. You make the final decision.
          </Text>

          <Text style={styles.sectionTitle}>Additional proof</Text>
          {claim.evidence.length === 0 ? (
            <Text style={styles.none}>No additional proof submitted.</Text>
          ) : (
            <View style={styles.proofRow}>
              {claim.evidence.map((uri, index) => (
                <Image key={uri + index} source={{ uri }} style={styles.proof} />
              ))}
            </View>
          )}

          {claim.proofRequested ? (
            <Text style={styles.waiting}>You asked for more proof. Waiting for the claimant.</Text>
          ) : null}

          {claim.status === 'disputed' ? (
            <Text style={styles.waiting}>
              This rejected claim is being reviewed by campus staff.
            </Text>
          ) : null}

          {canDecide ? (
            <View style={styles.actions}>
              {showReason ? (
                <View>
                  <CustomInput
                    label="Reason for rejection (optional)"
                    placeholder="e.g. Answers did not match"
                    value={reason}
                    onChangeText={setReason}
                    multiline
                  />
                  <View style={styles.buttonRow}>
                    <CustomButton
                      title="Back"
                      variant="outline"
                      onPress={() => setShowReason(false)}
                      style={styles.half}
                    />
                    <CustomButton
                      title="Confirm Reject"
                      variant="danger"
                      onPress={handleReject}
                      style={styles.half}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.buttonRow}>
                    <CustomButton
                      title="Reject"
                      variant="danger"
                      onPress={() => setShowReason(true)}
                      style={styles.half}
                    />
                    <CustomButton title="Approve" onPress={handleApprove} style={styles.half} />
                  </View>
                  {!claim.proofRequested ? (
                    <CustomButton
                      title="Ask for More Proof"
                      variant="outline"
                      icon="image-outline"
                      onPress={handleRequestProof}
                      style={styles.proofButton}
                    />
                  ) : null}
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  claimId: { fontSize: 15, fontWeight: '700', color: colors.text },
  label: { fontSize: 12, color: colors.textMuted, marginTop: spacing.sm },
  value: { fontSize: 16, fontWeight: '600', color: colors.text },
  sectionTitle: { ...typography.heading, marginTop: spacing.xl, marginBottom: spacing.sm },
  answer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  question: { fontSize: 13, color: colors.textMuted },
  answerText: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 2 },
  hint: { ...typography.caption, marginTop: spacing.xs },
  none: { ...typography.caption },
  proofRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  proof: { width: 96, height: 96, borderRadius: radius.sm },
  waiting: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: '#EFE7D2',
    fontSize: 14,
    color: colors.text,
  },
  actions: { marginTop: spacing.xl },
  buttonRow: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1, paddingHorizontal: spacing.md },
  proofButton: { marginTop: spacing.md },
});
