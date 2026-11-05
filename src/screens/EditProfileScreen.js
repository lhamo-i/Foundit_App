import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import Avatar from '../components/Avatar';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { pickImageWithPrompt } from '../utils/pickImage';
import { colors, radius, spacing } from '../theme/colors';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUri, setAvatarUri] = useState(user.avatarUri);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const changePhoto = async () => {
    const uri = await pickImageWithPrompt();
    if (uri) setAvatarUri(uri);
  };

  const save = async () => {
    if (name.trim().length < 2) {
      setError('Enter your full name');
      return;
    }
    setSaving(true);
    await updateProfile({ name: name.trim(), phone: phone.trim(), avatarUri });
    setSaving(false);
    Alert.alert('Saved', 'Your profile was updated.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Edit Profile" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.avatarWrap} onPress={changePhoto} accessibilityRole="button" accessibilityLabel="Change profile photo">
            <Avatar user={{ ...user, name, avatarUri }} size={104} />
            <View style={styles.camera}>
              <Ionicons name="camera-outline" size={18} color={colors.text} />
            </View>
          </Pressable>

          <CustomInput
            label="Full Name"
            icon="person-outline"
            value={name}
            onChangeText={(t) => {
              setName(t);
              setError('');
            }}
            autoCapitalize="words"
            error={error}
          />
          <CustomInput
            label="Phone (optional)"
            icon="call-outline"
            placeholder="e.g. 17XXXXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Text style={styles.locked}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.textMuted} /> Student ID ({user.studentId}) and email ({user.email}) cannot be changed.
          </Text>

          <CustomButton title="Save Changes" variant="dark" onPress={save} loading={saving} style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg },
  avatarWrap: { alignSelf: 'center', marginVertical: spacing.lg },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: { fontSize: 13, color: colors.textMuted, padding: spacing.md, borderRadius: radius.sm, backgroundColor: colors.surfaceLight },
  btn: { marginTop: spacing.xl },
});
