import React, { useState } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme/colors';

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const e = {};
    if (!current) e.current = 'Enter your current password';
    if (next.length < 6) e.next = 'New password must be at least 6 characters';
    if (confirm !== next) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    const res = await changePassword(current, next);
    setSaving(false);
    if (!res.ok) {
      setErrors({ current: res.error });
      return;
    }
    Alert.alert('Password changed', 'Use your new password next time you log in.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Change Password" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <CustomInput
            label="Current password"
            icon="lock-closed-outline"
            value={current}
            onChangeText={setCurrent}
            secureTextEntry
            autoCapitalize="none"
            error={errors.current}
          />
          <CustomInput
            label="New password"
            icon="key-outline"
            placeholder="At least 6 characters"
            value={next}
            onChangeText={setNext}
            secureTextEntry
            autoCapitalize="none"
            error={errors.next}
          />
          <CustomInput
            label="Confirm new password"
            icon="key-outline"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirm}
          />
          <CustomButton title="Update Password" variant="dark" onPress={submit} loading={saving} style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: spacing.lg },
  btn: { marginTop: spacing.md },
});
