import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

// A dropdown. Tapping it opens a list at the bottom of the screen.
//   options = ['Library', 'Canteen'] or [{ value: 'x', label: 'Shown text' }]
export default function SelectField({
  label,
  value,
  placeholder = 'Select...',
  options,
  onSelect,
  icon,
  error,
  title,
  style,
}) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const list = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = list.find((o) => o.value === value);

  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        style={[styles.box, !!error && styles.boxError]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label || 'Select'}: ${selected ? selected.label : 'none chosen'}`}
      >
        {icon ? <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.leftIcon} /> : null}
        <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <Text style={styles.sheetTitle}>{title || label || 'Choose one'}</Text>
            <FlatList
              data={list}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    style={[styles.option, active && styles.optionActive]}
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
                    {active ? <Ionicons name="checkmark" size={20} color={colors.text} /> : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
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
  boxError: { borderColor: colors.danger },
  leftIcon: { marginRight: spacing.sm },
  value: { flex: 1, fontSize: 15, color: colors.text },
  placeholder: { color: colors.placeholder },
  error: { marginTop: spacing.xs, fontSize: 13, color: colors.danger },

  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  optionActive: { backgroundColor: colors.surface },
  optionText: { fontSize: 16, color: colors.text },
  optionTextActive: { fontWeight: '700' },
});
