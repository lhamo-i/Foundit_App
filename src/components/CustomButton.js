import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

// A reusable button. "variant" changes how it looks:
//   primary = taupe (main actions)
//   dark    = charcoal (strong actions)
//   outline = border only (secondary actions)
//   danger  = red (reject / delete)
export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const isDisabled = disabled || loading;
  const look = variants[variant] || variants.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: look.bg, borderColor: look.border },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={look.text} />
      ) : (
        <>
          {icon ? (
            <Ionicons name={icon} size={20} color={look.text} style={styles.icon} />
          ) : null}
          <Text style={[styles.text, { color: look.text }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const variants = {
  primary: { bg: colors.primary, border: colors.primary, text: colors.text },
  dark: { bg: colors.text, border: colors.text, text: colors.background },
  outline: { bg: 'transparent', border: colors.text, text: colors.text },
  danger: { bg: colors.danger, border: colors.danger, text: colors.dangerText },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  text: { fontSize: 16, fontWeight: '700' },
  icon: { marginRight: spacing.sm },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
