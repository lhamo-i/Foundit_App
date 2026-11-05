import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthLayout from '../../components/AuthLayout';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { CAMPUS_EMAIL_DOMAIN } from '../../data/constants';
import { colors, radius, spacing } from '../../theme/colors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\d{5,}$/.test(studentId.trim())) e.studentId = 'Enter your student / staff ID (numbers only)';
    if (!email.trim().toLowerCase().endsWith('@' + CAMPUS_EMAIL_DOMAIN)) {
      e.email = `Use your campus email (@${CAMPUS_EMAIL_DOMAIN})`;
    }
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const res = await register({
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (!res.ok) setErrors({ form: res.error });
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the Foundit community">
      <CustomInput
        label="Full Name"
        icon="person-outline"
        placeholder="Your full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        error={errors.name}
      />
      <CustomInput
        label="Student / Staff ID"
        icon="id-card-outline"
        placeholder="e.g. 02240189"
        value={studentId}
        onChangeText={setStudentId}
        keyboardType="number-pad"
        error={errors.studentId}
      />
      <CustomInput
        label="Institutional Email"
        icon="mail-outline"
        placeholder={`name@${CAMPUS_EMAIL_DOMAIN}`}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <CustomInput
        label="Password"
        icon="lock-closed-outline"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />

      {errors.form ? (
        <View style={styles.formError}>
          <Ionicons name="alert-circle" size={18} color={colors.lostText} />
          <Text style={styles.formErrorText}>{errors.form}</Text>
        </View>
      ) : null}

      <CustomButton title="Register" onPress={submit} loading={loading} />

      <View style={styles.bottomRow}>
        <Text style={styles.muted}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
          <Text style={styles.linkBold}>Login</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  muted: { fontSize: 14, color: colors.textMuted },
  linkBold: { fontSize: 14, color: colors.text, fontWeight: '700', textDecorationLine: 'underline' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.lostBg,
  },
  formErrorText: { flex: 1, marginLeft: spacing.sm, fontSize: 13, color: colors.lostText },
});
