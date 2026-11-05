import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import StageTracker from './StageTracker';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getRoles, getHandover } from '../utils/roles';
import { handoverInfo, POINTS_PER_RETURN } from '../data/constants';
import { colors, radius, spacing } from '../theme/colors';

// Handover details + the two confirmation buttons.
// The finder taps "Item handed over", the owner taps "I received it".
// The post becomes Resolved only when BOTH have confirmed.
export default function HandoverPanel({ item, claim }) {
  const { user } = useAuth();
  const { confirmHandover } = useData();
  const { finderId, ownerId } = getRoles(item, claim);
  const handover = getHandover(item, claim);
  const info = handover ? handoverInfo(handover.type) : null;
  const isFinder = user.id === finderId;
  const isOwner = user.id === ownerId;
  const resolved = item.stage === 'resolved';

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Handover</Text>
      <StageTracker stage={item.stage} />

      <View style={styles.detail}>
        <Ionicons name={info ? info.icon : 'help-circle-outline'} size={22} color={colors.text} />
        <View style={styles.detailText}>
          <Text style={styles.method}>{info ? info.label : 'Not chosen yet'}</Text>
          <Text style={styles.sub}>
            {handover && handover.place ? handover.place : 'Agree a time and place in the chat.'}
          </Text>
        </View>
      </View>

      <View style={styles.note}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.text} />
        <Text style={styles.noteText}>
          At pickup the owner must show a student / staff ID that matches their account name. Staff at a
          drop-off point log every pickup.
        </Text>
      </View>

      <View style={styles.confirmRow}>
        <ConfirmChip done={item.finderConfirmed} label="Finder handed over" />
        <ConfirmChip done={item.receiverConfirmed} label="Owner received" />
      </View>

      {resolved ? (
        <View style={styles.done}>
          <Ionicons name="checkmark-circle" size={20} color={colors.foundText} />
          <Text style={styles.doneText}>
            Resolved. {isFinder ? `You earned ${POINTS_PER_RETURN} points. Thank you!` : 'The item is back with its owner.'}
          </Text>
        </View>
      ) : (
        <>
          {isFinder && !item.finderConfirmed ? (
            <CustomButton
              title="Item handed over"
              icon="hand-right-outline"
              variant="dark"
              onPress={() => confirmHandover(item.id, 'finder')}
              style={styles.btn}
            />
          ) : null}
          {isOwner && !item.receiverConfirmed ? (
            <CustomButton
              title="I received it"
              icon="checkmark-done-outline"
              variant="dark"
              onPress={() => confirmHandover(item.id, 'receiver')}
              style={styles.btn}
            />
          ) : null}
          {(isFinder && item.finderConfirmed) || (isOwner && item.receiverConfirmed) ? (
            <Text style={styles.waiting}>You confirmed. Waiting for the other person.</Text>
          ) : null}
        </>
      )}
    </View>
  );
}

function ConfirmChip({ done, label }) {
  return (
    <View style={[styles.chip, done && styles.chipDone]}>
      <Ionicons
        name={done ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={done ? colors.foundText : colors.textMuted}
      />
      <Text style={[styles.chipText, done && styles.chipTextDone]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  detail: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  detailText: { marginLeft: spacing.md, flex: 1 },
  method: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  note: {
    flexDirection: 'row',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
  },
  noteText: { flex: 1, marginLeft: spacing.sm, fontSize: 12.5, color: colors.textMuted },
  confirmRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLight,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  chipDone: { backgroundColor: colors.foundBg },
  chipText: { marginLeft: 4, fontSize: 12.5, color: colors.textMuted, fontWeight: '600' },
  chipTextDone: { color: colors.foundText },
  btn: { marginTop: spacing.md },
  waiting: { marginTop: spacing.md, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  done: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.foundBg,
  },
  doneText: { flex: 1, marginLeft: spacing.sm, fontSize: 14, fontWeight: '600', color: colors.foundText },
});
