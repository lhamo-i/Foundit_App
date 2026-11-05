import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import CustomInput from '../../components/CustomInput';
import PhotoPicker from '../../components/PhotoPicker';
import CustomButton from '../../components/CustomButton';
import { useData } from '../../context/DataContext';
import { colors, spacing } from '../../theme/colors';

// A rejected claimer explains why the item is theirs and asks the campus team to review.
export default function RequestReviewScreen({ route, navigation }) {
  const { claimId } = route.params;
  const { requestReview } = useData();
  const [message, setMessage] = useState('');
  const [evidenceUri, setEvidenceUri] = useState(null);
  const [error, setError] = useState('');

  const submit = () => {
    if (message.trim().length < 10) {
      setError('Please tell us a little more (at least 10 characters).');
      return;
    }
    requestReview(claimId, { message: message.trim(), evidenceUri });
    navigation.replace('DisputeReview', { claimId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Request Review" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <CustomInput
            label="Why do you believe this item is yours?"
            placeholder="Tell us more..."
            value={message}
            onChangeText={(t) => {
              setMessage(t);
              setError('');
            }}
            multiline
            maxLength={400}
            error={error}
          />
          <PhotoPicker
            uri={evidenceUri}
            onChange={setEvidenceUri}
            title="Upload more evidence"
            hint="Optional"
            height={160}
          />
          <CustomButton title="Submit Request" variant="dark" onPress={submit} style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg },
  btn: { marginTop: spacing.xl },
});
