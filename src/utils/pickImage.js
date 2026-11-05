// Photo picking for posts, proof and profile pictures.
// Needs:  npx expo install expo-image-picker
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

async function fromLibrary() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permission needed', 'Please allow photo access in your phone settings.');
    return null;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: true,
  });
  return res.canceled ? null : res.assets[0].uri;
}

async function fromCamera() {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permission needed', 'Please allow camera access in your phone settings.');
    return null;
  }
  const res = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
  return res.canceled ? null : res.assets[0].uri;
}

// Asks "Take photo or choose from library?" and resolves to a local image uri (or null).
// With Firebase later, you upload this uri to Cloud Storage and save the download URL.
export function pickImageWithPrompt() {
  if (Platform.OS === 'web') return fromLibrary();
  return new Promise((resolve) => {
    Alert.alert(
      'Add a photo',
      'Where should the photo come from?',
      [
        { text: 'Take photo', onPress: () => fromCamera().then(resolve) },
        { text: 'Choose from library', onPress: () => fromLibrary().then(resolve) },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}
