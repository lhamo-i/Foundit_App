import React from 'react';
import { View, Text, Pressable, Switch, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import { useSession } from '../context/SessionContext';
import { colors, radius, spacing, typography } from '../theme/colors';

// TEMPORARY profile. The full Profile screen is built in Stage 2, Part C.
// It exists now so you can reach the claim screens while testing.
function Row({ icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.text} />
    </Pressable>
  );
}

export default function ProfileTempScreen({ navigation }) {
  const { user, isStaff, setIsStaff } = useSession();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={44} color={colors.text} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.sub}>
          {isStaff ? 'Campus Staff (sample)' : user.role} • ID {user.id}
        </Text>

        <View style={styles.list}>
          <Row
            icon="document-text-outline"
            label="My Claims"
            onPress={() => navigation.navigate('ClaimManagement', { mode: 'mine' })}
          />
          <Row
            icon="mail-unread-outline"
            label="Incoming Claims (on my posts)"
            onPress={() => navigation.navigate('ClaimManagement', { mode: 'incoming' })}
          />
          <Row
            icon="shield-outline"
            label="Dispute Review (staff)"
            onPress={() => navigation.navigate('DisputeManagement')}
          />
          <Row
            icon="log-out-outline"
            label="Log Out"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
          />
        </View>

        <View style={styles.sample}>
          <View style={styles.sampleText}>
            <Text style={styles.sampleTitle}>Sample tool: act as campus staff</Text>
            <Text style={typography.caption}>
              For testing only. In the real app, staff accounts are set by an administrator.
            </Text>
          </View>
          <Switch
            value={isStaff}
            onValueChange={setIsStaff}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <Text style={styles.note}>The full profile screen arrives in the next part.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center', padding: spacing.lg, paddingBottom: spacing.xxl },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...typography.title, marginTop: spacing.md },
  sub: { ...typography.caption, marginTop: 2 },
  list: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.7 },
  rowLabel: { flex: 1, marginLeft: spacing.md, fontSize: 16, color: colors.text },
  sample: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  sampleText: { flex: 1, marginRight: spacing.md },
  sampleTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  note: { ...typography.caption, marginTop: spacing.lg },
});
