import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthLayout from '../../components/AuthLayout';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { CAMPUS_EMAIL_DOMAIN } from '../../data/constants';
import { colors, radius, spacing } from '../../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res = await resetPassword(email.trim());
    setLoading(false);
    if (!res.ok) setError(res.error);
    else setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email">
        <View style={styles.sentBox}>
          <Ionicons name="mail-open-outline" size={40} color={colors.text} />
          <Text style={styles.sentText}>
            If an account exists for {email.trim()}, we have sent a link to reset your password.
          </Text>
        </View>
        <CustomButton title="Back to Login" variant="dark" onPress={() => navigation.navigate('Login')} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your campus email and we'll send you a reset link.">
      <CustomInput
        label="Institutional Email"
        icon="mail-outline"
        placeholder={`name@${CAMPUS_EMAIL_DOMAIN}`}
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
      />
      <CustomButton title="Send reset link" onPress={submit} loading={loading} disabled={!email.trim()} />
      <CustomButton
        title="Back to Login"
        variant="outline"
        onPress={() => navigation.goBack()}
        style={styles.back}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: spacing.md },
  sentBox: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  sentText: { marginTop: spacing.md, fontSize: 15, color: colors.text, textAlign: 'center' },
});
