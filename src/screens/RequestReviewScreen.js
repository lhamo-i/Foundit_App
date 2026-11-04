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
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import EvidencePicker from '../components/EvidencePicker';
import EmptyState from '../components/EmptyState';
import { useClaims } from '../context/ClaimsContext';
import { colors, spacing, typography } from '../theme/colors';

// The claimant explains why the item is theirs and asks campus staff to review again.
export default function RequestReviewScreen({ navigation, route }) {
  const { getClaim, requestReview } = useClaims();
  const claim = getClaim(route.params ? route.params.claimId : null);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  if (!claim || !claim.claimantIsMe || claim.status !== 'rejected' || claim.finalDecision) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Request Review" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="lock-closed-outline"
          title="Review not available"
          message="Only rejected claims without a final decision can be sent for review."
        />
      </View>
    );
  }

  const handleSubmit = () => {
    if (text.trim().length < 10) {
      setError('Please explain in at least 10 characters.');
      return;
    }
    setError('');
    Alert.alert('Send for review?', 'Campus staff will look at your claim and decide.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: () => {
          requestReview(claim.id, text.trim(), images);
          navigation.replace('DisputeStatus', { claimId: claim.id });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Request Review" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CustomInput
            label="Why do you believe this item is yours?"
            placeholder="Tell us more..."
            value={text}
            onChangeText={setText}
            multiline
            error={error}
          />
          <Text style={styles.label}>Upload more evidence (optional)</Text>
          <EvidencePicker images={images} onChange={setImages} />
          <Text style={styles.note}>
            Only the uploader and authorised campus staff can see your evidence.
          </Text>
          <CustomButton title="Submit Request" variant="dark" onPress={handleSubmit} style={styles.button} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  note: { ...typography.caption, marginTop: spacing.md },
  button: { marginTop: spacing.xl },
});
