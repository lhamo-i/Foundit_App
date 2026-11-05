import React, { useState } from 'react';
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import StatusBadge from '../../components/StatusBadge';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import HandoverPicker from '../../components/HandoverPicker';
import EmptyState from '../../components/EmptyState';
import { useData } from '../../context/DataContext';
import { colors, radius, spacing, typography } from '../../theme/colors';

// "This is mine" (Found post) or "I found this" (Lost post).
// The responder answers the poster's questions; the poster then approves or rejects.
export default function ClaimVerificationScreen({ route, navigation }) {
  const { itemId } = route.params;
  const { items, submitClaim } = useData();
  const item = items.find((i) => i.id === itemId);

  const [answers, setAnswers] = useState({});
  const [handoverType, setHandoverType] = useState('dropoff');
  const [handoverPlace, setHandoverPlace] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Claim" />
        <EmptyState title="Item not found" />
      </SafeAreaView>
    );
  }

  const isFound = item.type === 'found';
  const questions = item.questions && item.questions.length ? item.questions : ['Describe the item in your own words.'];

  const submit = () => {
    const e = {};
    questions.forEach((q, i) => {
      if (!(answers[i] || '').trim()) e[`q${i}`] = 'Please answer this question';
    });
    // On a Lost post the responder is the finder, so they choose the handover.
    if (!isFound && handoverType !== 'keeps' && !handoverPlace) e.handover = 'Choose where the handover will happen';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    const claim = submitClaim({
      itemId: item.id,
      answers: questions.map((q, i) => ({ q, a: answers[i].trim() })),
      handover: isFound ? null : { type: handoverType, place: handoverType === 'keeps' ? null : handoverPlace },
    });
    setSaving(false);
    navigation.replace('ClaimSubmitted', { claimId: claim.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title={isFound ? 'Claim This Item' : 'I Found This'} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.noImage]}>
              <Ionicons name={item.icon || 'cube-outline'} size={64} color={colors.text} />
            </View>
          )}

          <View style={styles.titleRow}>
            <StatusBadge type={item.type} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.loc}>{item.location}</Text>
          </View>

          <View style={styles.verifyHead}>
            <Ionicons name="shield-checkmark" size={22} color={colors.text} />
            <Text style={styles.verifyTitle}>
              {isFound ? 'Verify that this item is yours' : 'Verify that you found this item'}
            </Text>
          </View>
          <Text style={styles.sub}>Answer the following questions:</Text>

          {questions.map((q, i) => (
            <CustomInput
              key={i}
              label={`${i + 1}. ${q}`}
              placeholder="Enter answer"
              value={answers[i] || ''}
              onChangeText={(t) => setAnswers((prev) => ({ ...prev, [i]: t }))}
              error={errors[`q${i}`]}
              maxLength={150}
            />
          ))}

          {!isFound ? (
            <View>
              <Text style={styles.handoverTitle}>How can you return it?</Text>
              <Text style={styles.sub}>Valuables are safest at a drop-off point.</Text>
              <HandoverPicker
                type={handoverType}
                place={handoverPlace}
                onChangeType={setHandoverType}
                onChangePlace={setHandoverPlace}
                error={errors.handover}
              />
            </View>
          ) : null}

          <View style={styles.privacy}>
            <Ionicons name="information-circle-outline" size={18} color={colors.text} />
            <Text style={styles.privacyText}>
              Your contact details are never shown to the poster unless you message them first.
            </Text>
          </View>

          <CustomButton title="Submit Claim" variant="dark" onPress={submit} loading={saving} style={styles.submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  image: { width: '100%', height: 170, borderRadius: radius.lg },
  noImage: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  title: { ...typography.heading, fontSize: 20, marginLeft: spacing.sm, flex: 1 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  loc: { fontSize: 14, color: colors.textMuted, marginLeft: 4 },
  verifyHead: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl },
  verifyTitle: { ...typography.heading, marginLeft: spacing.sm, flex: 1 },
  sub: { fontSize: 13.5, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  handoverTitle: { ...typography.heading, marginTop: spacing.md },
  privacy: {
    flexDirection: 'row',
    padding: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
  },
  privacyText: { flex: 1, marginLeft: spacing.sm, fontSize: 12.5, color: colors.textMuted },
  submit: { marginTop: spacing.lg },
});
