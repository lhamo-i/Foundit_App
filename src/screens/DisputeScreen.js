import React, { useState } from 'react';
import { View, Text, Image, FlatList, Alert, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { getSampleItem } from '../data/sampleItems';
import { useClaims } from '../context/ClaimsContext';
import { useSession } from '../context/SessionContext';
import { colors, radius, spacing, typography, shadow } from '../theme/colors';

// One disputed claim, with a note box and the two decision buttons.
function DisputeCard({ claim }) {
  const { decideDispute } = useClaims();
  const [note, setNote] = useState('');
  const item = getSampleItem(claim.itemId);

  const decide = (decision) => {
    const approve = decision === 'approve';
    Alert.alert(
      approve ? 'Approve this claim?' : 'Uphold the rejection?',
      'This is the final decision.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: approve ? 'Approve' : 'Uphold',
          onPress: () => {
            const result = decideDispute(claim.id, decision, note.trim());
            if (!result.ok) Alert.alert('Could not save decision', result.message);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.card, shadow.card]}>
      <Text style={styles.cardTitle}>
        {item ? item.title : 'Item'} • #{claim.id}
      </Text>
      <Text style={styles.line}>
        Claimant: {claim.claimantName} (ID {claim.claimantId})
      </Text>
      <Text style={styles.line}>Original rejection: {claim.rejectionReason || 'No reason given'}</Text>

      <Text style={styles.sub}>Claimant's explanation</Text>
      <Text style={styles.body}>{claim.appealText}</Text>

      <Text style={styles.sub}>Answers submitted</Text>
      {claim.answers.map((a) => (
        <Text key={a.question} style={styles.body}>
          {a.question} {'\u2192'} {a.answer}
        </Text>
      ))}

      <Text style={styles.sub}>Evidence</Text>
      {claim.evidence.length === 0 ? (
        <Text style={styles.body}>None submitted.</Text>
      ) : (
        <View style={styles.proofRow}>
          {claim.evidence.map((uri, index) => (
            <Image key={uri + index} source={{ uri }} style={styles.proof} />
          ))}
        </View>
      )}

      <CustomInput
        label="Decision note"
        placeholder="Record why you decided this"
        value={note}
        onChangeText={setNote}
        multiline
        style={styles.noteInput}
      />
      <View style={styles.buttonRow}>
        <CustomButton
          title="Uphold Rejection"
          variant="danger"
          onPress={() => decide('uphold')}
          style={styles.half}
        />
        <CustomButton title="Approve Claim" onPress={() => decide('approve')} style={styles.half} />
      </View>
    </View>
  );
}

// Campus staff only: review disputed claims and record the final decision.
export default function DisputeScreen({ navigation }) {
  const { claims } = useClaims();
  const { isStaff } = useSession();

  if (!isStaff) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Dispute Review" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="lock-closed-outline"
          title="Staff only"
          message="Only authorised campus staff can review disputes."
        />
      </View>
    );
  }

  const disputed = claims.filter((claim) => claim.status === 'disputed');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Dispute Review" onBack={() => navigation.goBack()} />
      <FlatList
        data={disputed}
        keyExtractor={(claim) => claim.id}
        renderItem={({ item }) => <DisputeCard claim={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-done-outline"
            title="No disputes waiting"
            message="Disputed claims will appear here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  line: { fontSize: 14, color: colors.text, marginTop: 2 },
  sub: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginTop: spacing.md },
  body: { ...typography.body, marginTop: 2 },
  proofRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  proof: { width: 80, height: 80, borderRadius: radius.sm },
  noteInput: { marginTop: spacing.lg, marginBottom: spacing.md },
  buttonRow: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1, paddingHorizontal: spacing.sm },
});
