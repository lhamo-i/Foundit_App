import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import ItemSummary from '../components/ItemSummary';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import EvidencePicker from '../components/EvidencePicker';
import EmptyState from '../components/EmptyState';
import { getSampleItem } from '../data/sampleItems';
import { SAMPLE_QUESTIONS, DEFAULT_QUESTIONS } from '../data/sampleClaims';
import { useClaims } from '../context/ClaimsContext';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function ClaimScreen({ navigation, route }) {
  const { addClaim, getMyClaimForItem } = useClaims();
  const itemId = route.params ? route.params.itemId : null;
  const item = getSampleItem(itemId);

  const questions = (item && SAMPLE_QUESTIONS[item.id]) || DEFAULT_QUESTIONS;
  const [answers, setAnswers] = useState(questions.map(() => ''));
  const [evidence, setEvidence] = useState([]);
  const [error, setError] = useState('');

  // Only Found items by other people can be claimed, and only once per person.
  const blocked = !item || item.type !== 'found' || item.isMine || getMyClaimForItem(itemId);
  if (blocked) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Claim This Item" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="alert-circle-outline"
          title="You can't claim this item"
          message="It may be your own post, or you already submitted a claim."
        />
      </View>
    );
  }

  const setAnswer = (index, text) => {
    setAnswers((current) => current.map((a, i) => (i === index ? text : a)));
  };

  const handleSubmit = () => {
    if (answers.some((a) => !a.trim())) {
      setError('Please answer every question.');
      return;
    }
    setError('');

    Alert.alert(
      'Submit this claim?',
      'The uploader will review your answers and make the final decision.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            // STAGE 4: a Cloud Function checks the answers privately, counts attempts
            // (max 3) and never auto-approves. Here we only save the claim in memory.
            const claimId = addClaim({
              itemId: item.id,
              answers: questions.map((q, i) => ({ question: q, answer: answers[i].trim() })),
              evidence,
            });
            navigation.replace('ClaimSubmitted', { claimId });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Claim This Item" onBack={() => navigation.goBack()} />
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

          <View style={styles.verifyHeader}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
            <View style={styles.verifyText}>
              <Text style={styles.verifyTitle}>Verify that this item is yours</Text>
              <Text style={typography.caption}>Answer the finder's private questions.</Text>
            </View>
          </View>

          {questions.map((question, index) => (
            <CustomInput
              key={question}
              label={`${index + 1}. ${question}`}
              placeholder="Enter your answer"
              value={answers[index]}
              onChangeText={(text) => setAnswer(index, text)}
            />
          ))}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.sectionTitle}>Additional evidence (optional)</Text>
          <EvidencePicker
            images={evidence}
            onChange={setEvidence}
            hint="A photo or receipt that shows it's yours"
          />

          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
            <Text style={styles.noticeText}>
              Your claim uses your Foundit account. You never need to share a phone number or
              email. You get up to 3 attempts per claim, and correct answers alone do not
              guarantee ownership.
            </Text>
          </View>

          <CustomButton title="Submit Claim" variant="dark" onPress={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  verifyHeader: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg },
  verifyText: { marginLeft: spacing.sm, flex: 1 },
  verifyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  error: { fontSize: 13, color: colors.danger, marginTop: -spacing.sm, marginBottom: spacing.md },
  sectionTitle: { ...typography.heading, marginTop: spacing.sm, marginBottom: spacing.sm },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.xl,
  },
  noticeText: { flex: 1, marginLeft: spacing.sm, fontSize: 13, color: colors.text, lineHeight: 19 },
});
