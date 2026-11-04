import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validateInstitutionalEmail, validateRequired } from '../utils/validation';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const newErrors = {
      email: validateInstitutionalEmail(email),
      password: validateRequired(password, 'Password'),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    // STAGE 2: sample mode. We only check the form and open the app.
    // STAGE 3: this will call Firebase Authentication instead.
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Ionicons name="search" size={34} color={colors.text} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in with your institutional email</Text>

          <View style={styles.form}>
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

            <CustomButton title="Login" variant="dark" onPress={handleLogin} />
          </View>

          <View style={styles.footer}>
            <Text style={typography.body}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="button">
              <Text style={styles.linkBold}>Register</Text>
            </Pressable>
          </View>

          <Text style={styles.note}>
            Sample mode: real Firebase login is added in Stage 3.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  logo: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.title, fontSize: 28, textAlign: 'center' },
  subtitle: { ...typography.caption, textAlign: 'center', marginTop: spacing.xs },
  form: { marginTop: spacing.xl },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.lg, marginTop: -spacing.xs },
  link: { fontSize: 14, color: colors.text, textDecorationLine: 'underline' },
  linkBold: { fontSize: 15, fontWeight: '700', color: colors.text, textDecorationLine: 'underline' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  note: { ...typography.caption, textAlign: 'center', marginTop: spacing.lg },
});
