import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pickImageWithPrompt } from '../utils/pickImage';
import { colors, radius, spacing } from '../theme/colors';

// The dashed "Upload Photo" box. Shows a preview once a photo is chosen.
export default function PhotoPicker({
  uri,
  onChange,
  title = 'Upload Photo',
  hint = 'Tap to add a photo',
  height = 150,
  style,
}) {
  const choose = async () => {
    const picked = await pickImageWithPrompt();
    if (picked) onChange(picked);
  };

  if (uri) {
    return (
      <View style={[styles.previewWrap, { height }, style]}>
        <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
        <Pressable
          style={styles.remove}
          onPress={() => onChange(null)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Remove photo"
        >
          <Ionicons name="close" size={18} color={colors.text} />
        </Pressable>
        <Pressable style={styles.change} onPress={choose} accessibilityRole="button">
          <Ionicons name="camera-outline" size={16} color={colors.text} />
          <Text style={styles.changeText}>Change</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={choose}
      style={[styles.box, { height }, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Ionicons name="image-outline" size={36} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  hint: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  previewWrap: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surfaceLight },
  preview: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  change: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  changeText: { marginLeft: 4, fontSize: 13, fontWeight: '600', color: colors.text },
});
