import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Round profile picture. Shows the photo if there is one, otherwise the person's initials.
export default function Avatar({ user, size = 44, style }) {
  const name = (user && user.name) || '?';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  const box = { width: size, height: size, borderRadius: size / 2 };

  if (user && user.avatarUri) {
    return <Image source={{ uri: user.avatarUri }} style={[box, style]} />;
  }
  return (
    <View style={[styles.fallback, box, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.text, fontWeight: '700' },
});
