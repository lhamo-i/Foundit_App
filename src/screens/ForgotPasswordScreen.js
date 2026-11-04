import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateInstitutionalEmail } from '../utils/validation';
import { colors, spacing, typography } from '../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSend = () => {
    const message = validateInstitutionalEmail(email);
    setError(message);
    if (message) return;

    // STAGE 3: this will call Firebase sendPasswordResetEmail().
    Alert.alert(
      'Email check passed',
      'In Stage 3 a password reset link will be sent to this address.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Reset Password" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.text}>
          Enter your institutional email and we will send you a link to reset your password.
        </Text>
        <CustomInput
          label="Institutional email"
          icon="mail-outline"
          placeholder="02240189.cst@rub.edu.bt"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={error}
        />
        <CustomButton title="Send Reset Link" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.xl },
  text: { ...typography.body, marginBottom: spacing.xl },
});
