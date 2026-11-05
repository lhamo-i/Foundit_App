
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../../components/ScreenHeader';
import StatusBadge from '../../components/StatusBadge';
import ClaimStatusPill from '../../components/ClaimStatusPill';
import ContactCard from '../../components/ContactCard';
import HandoverPanel from '../../components/HandoverPanel';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';

import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getRoles } from '../../utils/roles';
import { maskStudentId, timeAgo } from '../../utils/format';
import { colors, radius, spacing, typography } from '../../theme/colors';

const REJECT_REASONS = [
  'Answers did not match.',
  'Not enough proof.',
  'Details do not match.',
];

export default function ClaimDetailsScreen({ route, navigation }) {
  const { claimId } = route.params;

  const { user, getUserById } = useAuth();

  const {
    claims,
    items,
    approveClaim,
    rejectClaim,
    requestMoreProof,
    openChat,
  } = useData();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState(REJECT_REASONS[0]);

  const claim = claims.find((c) => c.id === claimId);
  const item = claim && items.find((i) => i.id === claim.itemId);

  if (!claim || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Claim Details" />
        <EmptyState title="Claim not found" />
      </SafeAreaView>
    );
  }

  const { posterId, responderId } = getRoles(item, claim);

  const isPoster = user?.id === posterId;
  const isResponder = user?.id === responderId;

  const poster = getUserById(posterId);
  const responder = getUserById(responderId);

  // Safe names in case a Firestore profile is incomplete.
  const posterName = poster?.name || 'Unknown user';
  const responderName = responder?.name || 'Unknown user';

  const other = isPoster ? responder : poster;
  const otherName = isPoster ? responderName : posterName;

  const pending = claim.status === 'pending';
  const roleLabel = item.type === 'found' ? 'Claimant' : 'Finder';

  const message = () => {
    if (!other?.id) {
      Alert.alert('Unable to message', 'User information is unavailable.');
      return;
    }

    const chatId = openChat({
      itemId: item.id,
      otherUserId: other.id,
      claimId: claim.id,
    });

    navigation.navigate('ChatRoom', { chatId });
  };

  const confirmApprove = () => {
    Alert.alert(
      'Approve this claim?',
      `${responderName} will be told to arrange the handover.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => approveClaim(claim.id),
        },
      ]
    );
  };

  const confirmReject = () => {
    rejectClaim(claim.id, reason.trim());
    setRejectOpen(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Claim Details" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Item summary */}
        <Pressable
          style={styles.itemCard}
          onPress={() =>
            navigation.navigate('ItemDetails', { itemId: item.id })
          }
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.title || 'item'}`}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              style={styles.thumb}
            />
          ) : (
            <View style={[styles.thumb, styles.noThumb]}>
              <Ionicons
                name={item.icon || 'cube-outline'}
                size={30}
                color={colors.text}
              />
            </View>
          )}

          <View style={styles.itemText}>
            <StatusBadge type={item.type} />
            <Text style={styles.itemTitle}>
              {item.title || 'Untitled item'}
            </Text>
            <Text style={styles.code}>
              Claim #{claim.code || 'N/A'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.text}
          />
        </Pressable>

        {/* Claim status */}
        <View style={styles.statusRow}>
          <ClaimStatusPill status={claim.status} />
          <Text style={styles.time}>
            Submitted {timeAgo(claim.createdAt)}
          </Text>
        </View>

        {/* Claimant / Finder information */}
        <Text style={styles.who}>
          {roleLabel}:{' '}
          <Text style={styles.whoBold}>{responderName}</Text>

          {isPoster
            ? ` (Student ID: ${maskStudentId(responder?.studentId)})`
            : isResponder
              ? ' (you)'
              : ''}
        </Text>

        {/* Answers */}
        <Text style={styles.heading}>Answers Provided</Text>

        <View style={styles.card}>
          {Array.isArray(claim.answers) && claim.answers.length > 0 ? (
            claim.answers.map((a, i) => (
              <View
                key={i}
                style={[
                  styles.answer,
                  i > 0 && styles.answerGap,
                ]}
              >
                <Text style={styles.q}>
                  {i + 1}. {a.q || 'Question'}
                </Text>

                <Text style={styles.a}>
                  {a.a || 'No answer provided'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.q}>No answers available.</Text>
          )}
        </View>

        {/* Additional proof */}
        {claim.proofUri ? (
          <View>
            <Text style={styles.heading}>Additional Proof</Text>

            <Image
              source={{ uri: claim.proofUri }}
              style={styles.proof}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* Rejected: reason */}
        {claim.status === 'rejected' ? (
          <View style={styles.rejectBox}>
            <Text style={styles.rejectLabel}>Reason</Text>

            <Text style={styles.rejectText}>
              {claim.rejectReason || 'Answers did not match.'}
            </Text>
          </View>
        ) : null}

        {/* Responder asked for more proof */}
        {isResponder && pending && claim.proofRequested ? (
          <View style={styles.proofBanner}>
            <Ionicons
              name="alert-circle"
              size={20}
              color={colors.pendingText}
            />

            <Text style={styles.proofBannerText}>
              The poster asked for more proof (a photo or receipt).
            </Text>
          </View>
        ) : null}

        {/* Contact: shown to the responder only */}
        {isResponder && claim.status !== 'rejected' ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Contact</Text>

            <ContactCard
              item={item}
              posterName={posterName}
              revealed
            />
          </View>
        ) : null}

        {/* Approved: handover */}
        {claim.status === 'approved' ? (
          <View style={styles.section}>
            <HandoverPanel item={item} claim={claim} />
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.section}>
          {/* Poster actions */}
          {isPoster && pending ? (
            <View>
              <View style={styles.row}>
                <CustomButton
                  title="Reject"
                  variant="danger"
                  onPress={() => setRejectOpen(true)}
                  style={styles.rowBtn}
                />

                <CustomButton
                  title="Approve"
                  variant="dark"
                  onPress={confirmApprove}
                  style={styles.rowBtn}
                />
              </View>

              {!claim.proofRequested && !claim.proofUri ? (
                <CustomButton
                  title="Ask for more proof"
                  variant="outline"
                  icon="image-outline"
                  onPress={() => {
                    requestMoreProof(claim.id);

                    Alert.alert(
                      'Request sent',
                      `${responderName} was asked to add more proof.`
                    );
                  }}
                  style={styles.gap}
                />
              ) : null}
            </View>
          ) : null}

          {/* Responder actions */}
          {isResponder && pending ? (
            <CustomButton
              title={
                claim.proofUri
                  ? 'Replace Proof'
                  : 'Add Additional Proof'
              }
              variant={claim.proofRequested ? 'dark' : 'outline'}
              icon="image-outline"
              onPress={() =>
                navigation.navigate('AdditionalProof', {
                  claimId: claim.id,
                })
              }
            />
          ) : null}

          {/* Message */}
          {claim.status !== 'rejected' ? (
            <CustomButton
              title={`Message ${otherName.split(' ')[0]}`}
              variant="outline"
              icon="chatbubble-ellipses-outline"
              onPress={message}
              style={styles.gap}
            />
          ) : null}

          {/* Rejected claim */}
          {isResponder && claim.status === 'rejected' ? (
            <CustomButton
              title="See what happens next"
              variant="dark"
              onPress={() =>
                navigation.navigate('ClaimRejected', {
                  claimId: claim.id,
                })
              }
            />
          ) : null}
        </View>
      </ScrollView>

      {/* Reject pop-up */}
      <Modal
        visible={rejectOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setRejectOpen(false)}
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Reject this claim
            </Text>

            <Text style={styles.modalSub}>
              Tell {responderName.split(' ')[0]} why. They can ask for a review.
            </Text>

            <View style={styles.reasonWrap}>
              {REJECT_REASONS.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setReason(r)}
                  style={[
                    styles.reasonChip,
                    reason === r && styles.reasonChipActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: reason === r }}
                >
                  <Text style={styles.reasonText}>{r}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.reasonInput}
              value={reason}
              onChangeText={setReason}
              placeholder="Reason"
              placeholderTextColor={colors.placeholder}
              multiline
              maxLength={120}
            />

            <View style={styles.row}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={() => setRejectOpen(false)}
                style={styles.rowBtn}
              />

              <CustomButton
                title="Reject"
                variant="danger"
                onPress={confirmReject}
                disabled={!reason.trim()}
                style={styles.rowBtn}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
  },

  noThumb: {
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemText: {
    flex: 1,
    marginLeft: spacing.md,
  },

  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },

  code: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },

  time: {
    fontSize: 13,
    color: colors.textMuted,
  },

  who: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.md,
  },

  whoBold: {
    fontWeight: '700',
    color: colors.text,
  },

  heading: {
    ...typography.heading,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  card: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  answer: {},

  answerGap: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  q: {
    fontSize: 13,
    color: colors.textMuted,
  },

  a: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },

  proof: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
  },

  rejectBox: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lostBg,
  },

  rejectLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.lostText,
  },

  rejectText: {
    fontSize: 15,
    color: colors.lostText,
    marginTop: 2,
  },

  proofBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.pendingBg,
  },

  proofBannerText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.pendingText,
  },

  section: {
    marginTop: spacing.xl,
  },

  row: {
    flexDirection: 'row',
  },

  rowBtn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },

  gap: {
    marginTop: spacing.md,
  },

  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.overlay,
  },

  modalCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },

  modalTitle: {
    ...typography.heading,
    fontSize: 20,
  },

  modalSub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  reasonWrap: {
    marginTop: spacing.md,
  },

  reasonChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    marginBottom: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  reasonChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  reasonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },

  reasonInput: {
    minHeight: 60,
    padding: spacing.md,
    marginVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
