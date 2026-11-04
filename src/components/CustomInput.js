import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

// A reusable text box with an optional label, left icon and error message.
// If secureTextEntry is true (passwords), it shows an eye button to show/hide.
// Any other TextInput props (value, onChangeText, placeholder...) pass straight through.
export default function CustomInput({
  label,
  icon,
  error,
  secureTextEntry,
  multiline,
  style,
  ...rest
}) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.box,
          multiline && styles.boxMulti,
          focused && styles.boxFocused,
          !!error && styles.boxError,
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.leftIcon} />
        ) : null}

        <TextInput
          {...rest}
          style={[styles.input, multiline && styles.inputMulti]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={hidden}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            if (rest.onFocus) rest.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (rest.onBlur) rest.onBlur(e);
          }}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden(!hidden)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  boxMulti: { alignItems: 'flex-start', paddingVertical: spacing.sm },
  boxFocused: { borderColor: colors.primary },
  boxError: { borderColor: colors.danger },
  leftIcon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 10 },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
  error: { marginTop: spacing.xs, fontSize: 13, color: colors.danger },
});
