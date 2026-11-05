import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import MenuRow from '../components/MenuRow';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BADGES, POINTS_PER_RETURN } from '../data/constants';
import { colors, radius, spacing, typography, shadow } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, users, logout } = useAuth();
  const { items, claims, savedIds } = useData();

  const postCount = items.filter((i) => i.ownerId === user.id).length;
  const claimCount = claims.filter((c) => c.claimerId === user.id).length;
  const board = [...users].sort((a, b) => b.points - a.points).slice(0, 5);

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Avatar user={user} size={96} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.sub}>Student / Staff ID {user.studentId} · CST</Text>
          <CustomButton
            title="Edit Profile"
            variant="outline"
            icon="create-outline"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editBtn}
          />
        </View>

        <View style={[styles.stats, shadow.card]}>
          <Stat value={postCount} label="Posts" />
          <View style={styles.divider} />
          <Stat value={claimCount} label="Claims" />
          <View style={styles.divider} />
          <Stat value={savedIds.length} label="Saved" />
        </View>

        {/* Good Samaritan points and badges */}
        <View style={styles.card}>
          <View style={styles.pointsHead}>
            <Ionicons name="heart-circle-outline" size={26} color={colors.text} />
            <View style={styles.pointsText}>
              <Text style={styles.cardTitle}>Good Samaritan points</Text>
              <Text style={styles.cardSub}>Earn {POINTS_PER_RETURN} points every time an item you found is returned.</Text>
            </View>
            <Text style={styles.points}>{user.points}</Text>
          </View>

          <View style={styles.badgeRow}>
            {BADGES.map((b) => {
              const earned = user.returns >= b.minReturns;
              return (
                <View key={b.key} style={[styles.badge, earned ? styles.badgeOn : styles.badgeOff]}>
                  <Ionicons name={earned ? b.icon.replace('-outline', '') : 'lock-closed-outline'} size={26} color={earned ? colors.text : colors.textMuted} />
                  <Text style={[styles.badgeName, !earned && styles.badgeNameOff]}>{b.name}</Text>
                  <Text style={styles.badgeDesc}>{earned ? 'Earned' : b.desc}</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.boardTitle}>Leaderboard</Text>
          {board.map((u, i) => (
            <View key={u.id} style={[styles.boardRow, u.id === user.id && styles.boardMe]}>
              <Text style={styles.rank}>{i + 1}</Text>
              <Avatar user={u} size={32} />
              <Text style={styles.boardName} numberOfLines={1}>
                {u.name}{u.id === user.id ? ' (you)' : ''}
              </Text>
              <Text style={styles.boardPoints}>{u.points} pts</Text>
            </View>
          ))}
        </View>

        <View style={[styles.menu, shadow.card]}>
          <MenuRow icon="albums-outline" label="My Posts" onPress={() => navigation.navigate('MyPosts')} />
          <MenuRow icon="shield-checkmark-outline" label="My Claims" onPress={() => navigation.navigate('MyClaims')} />
          <MenuRow icon="bookmark-outline" label="Saved Items" onPress={() => navigation.navigate('SavedItems')} />
          <MenuRow icon="key-outline" label="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
          <MenuRow icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate('Help')} />
          <MenuRow icon="log-out-outline" label="Log Out" danger last onPress={confirmLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  top: { alignItems: 'center', marginTop: spacing.md },
  name: { ...typography.title, marginTop: spacing.md },
  sub: { ...typography.caption, marginTop: 2 },
  editBtn: { marginTop: spacing.md, minHeight: 42, paddingHorizontal: spacing.lg },

  stats: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 13, color: colors.textMuted },
  divider: { width: 1, backgroundColor: colors.border },

  card: { marginTop: spacing.lg, padding: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface },
  pointsHead: { flexDirection: 'row', alignItems: 'center' },
  pointsText: { flex: 1, marginHorizontal: spacing.md },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  points: { fontSize: 28, fontWeight: '800', color: colors.text },
  badgeRow: { flexDirection: 'row', marginTop: spacing.lg },
  badge: { flex: 1, alignItems: 'center', padding: spacing.md, borderRadius: radius.md, marginHorizontal: spacing.xs },
  badgeOn: { backgroundColor: colors.foundBg },
  badgeOff: { backgroundColor: colors.surfaceLight },
  badgeName: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 4, textAlign: 'center' },
  badgeNameOff: { color: colors.textMuted },
  badgeDesc: { fontSize: 11.5, color: colors.textMuted, marginTop: 1 },
  boardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  boardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: spacing.sm, borderRadius: radius.sm },
  boardMe: { backgroundColor: colors.surfaceLight },
  rank: { width: 22, fontSize: 14, fontWeight: '700', color: colors.textMuted },
  boardName: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.text },
  boardPoints: { fontSize: 14, fontWeight: '700', color: colors.text },

  menu: { marginTop: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surface, overflow: 'hidden' },
});
