import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import PhotoPicker from '../../components/PhotoPicker';
import CustomButton from '../../components/CustomButton';
import { useData } from '../../context/DataContext';
import { colors, spacing } from '../../theme/colors';

// Claimer adds a photo, receipt or any other proof to a pending claim.
export default function AdditionalProofScreen({ route, navigation }) {
  const { claimId } = route.params;
  const { addProof } = useData();
  const [uri, setUri] = useState(null);

  const submit = () => {
    addProof(claimId, uri);
    Alert.alert('Proof sent', 'The poster has been notified.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Add Proof" />
      <View style={styles.body}>
        <PhotoPicker
          uri={uri}
          onChange={setUri}
          title="Upload Additional Evidence"
          hint="Photo, receipt or any proof"
          height={240}
        />
        <Text style={styles.note}>You can upload a photo, receipt or any other proof that the item is yours.</Text>
        <CustomButton title="Submit" variant="dark" onPress={submit} disabled={!uri} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg },
  note: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
  btn: { marginTop: spacing.xl },
});
