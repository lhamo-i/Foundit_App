import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import EvidencePicker from '../components/EvidencePicker';
import CustomButton from '../components/CustomButton';
import EmptyState from '../components/EmptyState';
import { useClaims } from '../context/ClaimsContext';
import { colors, spacing, typography } from '../theme/colors';

// The claimant adds supporting photos after the uploader asked for more proof.
export default function AdditionalProofScreen({ navigation, route }) {
  const { getClaim, addProof } = useClaims();
  const claim = getClaim(route.params ? route.params.claimId : null);
  const [images, setImages] = useState([]);

  if (!claim || !claim.claimantIsMe) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Add Proof" onBack={() => navigation.goBack()} />
        <EmptyState icon="lock-closed-outline" title="Not available" />
      </View>
    );
  }

  const handleSubmit = () => {
    if (images.length === 0) {
      Alert.alert('Add a photo', 'Please choose at least one photo first.');
      return;
    }
    // STAGE 4: photos upload to PRIVATE Firebase Storage that only you, the
    // uploader and campus staff can read.
    addProof(claim.id, images);
    Alert.alert('Proof submitted', 'The uploader will review it.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Proof" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          Upload a photo, receipt or anything that shows the item is yours. Only the uploader and
          authorised campus staff can see it.
        </Text>
        <EvidencePicker images={images} onChange={setImages} />
        <CustomButton title="Submit" variant="dark" onPress={handleSubmit} style={styles.button} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl },
  text: { ...typography.body, marginBottom: spacing.xl },
  button: { marginTop: spacing.xl },
});
