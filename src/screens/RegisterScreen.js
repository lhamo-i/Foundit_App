import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import FilterTabs from '../components/FilterTabs';
import {
  validateRequired,
  validateInstitutionalEmail,
  validateUserId,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validation';
import { colors, spacing, typography } from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accountType, setAccountType] = useState('Student');
  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    const newErrors = {
      fullName: validateRequired(fullName, 'Full name'),
      userId: validateUserId(userId, email),
      email: validateInstitutionalEmail(email),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((message) => message)) return;

    // STAGE 2: sample mode. STAGE 3 creates the Firebase account here and
    // sends a verification email to the institutional address.
    Alert.alert(
      'Account form is valid',
      'In Stage 3 this creates your account and emails you a verification link. For now, continue to Login.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Account" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>Join the Foundit community at CST</Text>

          <Text style={styles.label}>I am a</Text>
          <FilterTabs
            options={['Student', 'Staff']}
            selected={accountType}
            onSelect={setAccountType}
            style={styles.tabs}
          />

          <CustomInput
            label="Full name"
            icon="person-outline"
            placeholder="Your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            error={errors.fullName}
          />
          <CustomInput
            label="Institutional email"
            icon="mail-outline"
            placeholder="02240189.cst@rub.edu.bt"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <CustomInput
            label={`${accountType} ID`}
            icon="id-card-outline"
            placeholder="e.g. 02240189"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.userId}
          />
          <CustomInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="At least 8 characters, letters and numbers"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />
          <CustomInput
            label="Confirm password"
            icon="lock-closed-outline"
            placeholder="Type the password again"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirm}
          />

          <CustomButton title="Register" onPress={handleRegister} />

          <View style={styles.footer}>
            <Text style={typography.body}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
              <Text style={styles.linkBold}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingTop: spacing.sm },
  subtitle: { ...typography.caption, textAlign: 'center', marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  tabs: { marginBottom: spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  linkBold: { fontSize: 15, fontWeight: '700', color: colors.text, textDecorationLine: 'underline' },
});
