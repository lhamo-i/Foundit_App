
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AuthLayout from '../../components/AuthLayout';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { isValidCampusEmail } from '../../data/constants';
import { colors, radius, spacing } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    const cleanEmail = email.trim().toLowerCase();

    // Validate institutional email
    if (!cleanEmail) {
      e.email = 'Enter your institutional email';
    } else if (!isValidCampusEmail(cleanEmail)) {
      e.email = 'Use your CST email (e.g. 02240189.cst@rub.edu.bt)';
    }

    // Validate password
    if (!password) {
      e.password = 'Enter your password';
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(cleanEmail, password);

      if (!result.ok) {
        setErrors({ form: result.error });
      }
    } catch (error) {
      console.log('Login screen error:', error);
      setErrors({
        form: 'Unable to log in. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue"
    >
      <CustomInput
        label="Institutional Email"
        icon="mail-outline"
        placeholder="02240189.cst@rub.edu.bt"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <CustomInput
        label="Password"
        icon="lock-closed-outline"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />

      <Pressable
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgot}
        accessibilityRole="button"
      >
        <Text style={styles.link}>Forgot Password?</Text>
      </Pressable>

      {errors.form ? (
        <View style={styles.formError}>
          <Ionicons
            name="alert-circle"
            size={18}
            color={colors.lostText}
          />
          <Text style={styles.formErrorText}>
            {errors.form}
          </Text>
        </View>
      ) : null}

      <CustomButton
        title="Login"
        variant="dark"
        onPress={submit}
        loading={loading}
      />

      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      <CustomButton
        title="Continue with Google"
        icon="logo-google"
        variant="outline"
        onPress={() => {}}
      />

      <View style={styles.bottomRow}>
        <Text style={styles.muted}>
          Don't have an account? 
        </Text>

        <Pressable
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
        >
          <Text style={styles.linkBold}>Sign Up</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },

  link: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  linkBold: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  muted: {
    fontSize: 14,
    color: colors.textMuted,
  },

  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.lostBg,
  },

  formErrorText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 13,
    color: colors.lostText,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  or: {
    marginHorizontal: spacing.md,
    color: colors.textMuted,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
});
