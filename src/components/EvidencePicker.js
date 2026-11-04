import React from 'react';
import { View, Text, Image, Pressable, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

// Lets the user choose up to "max" photos from their gallery.
//   images   = list of photo addresses (URIs) chosen so far
//   onChange = called with the new list when photos are added or removed
// The photos stay on the phone for now. Stage 4 uploads them to PRIVATE Firebase Storage.
export default function EvidencePicker({
  images,
  onChange,
  max = 3,
  title = 'Upload Additional Evidence',
  hint = 'Optional: a photo, receipt or any proof',
}) {
  const pick = async () => {
    const remaining = max - images.length;
    if (remaining <= 0) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.7,
      });
      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        onChange([...images, ...uris].slice(0, max));
      }
    } catch (error) {
      Alert.alert('Could not open photos', 'Please try again.');
    }
  };

  const remove = (index) => onChange(images.filter((_, i) => i !== index));

  if (images.length === 0) {
    return (
      <Pressable
        style={styles.box}
        onPress={pick}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Ionicons name="image-outline" size={38} color={colors.text} />
        <Text style={styles.title}>{title}</Text>
        <Text style={typography.caption}>{hint}</Text>
      </Pressable>
    );
  }

  return (
    <View>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <View key={uri + index} style={styles.thumbWrap}>
            <Image source={{ uri }} style={styles.thumb} />
            <Pressable
              style={styles.remove}
              onPress={() => remove(index)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <Ionicons name="close" size={16} color={colors.white} />
            </Pressable>
          </View>
        ))}
        {images.length < max ? (
          <Pressable style={[styles.thumb, styles.addTile]} onPress={pick} accessibilityLabel="Add photo">
            <Ionicons name="add" size={30} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.count}>
        {images.length} of {max} photos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbWrap: { position: 'relative' },
  thumb: { width: 96, height: 96, borderRadius: radius.sm },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { ...typography.caption, marginTop: spacing.sm },
});
