import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme/colors';

// Shown for ~2 seconds when the app opens (while AuthContext "initializes").
// With Firebase this is where the app checks if someone is already signed in.
export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.timing(bar, { toValue: 1, duration: 1700, useNativeDriver: false }).start();
  }, [fade, bar]);

  const width = bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.center, { opacity: fade }]}>
        <View style={styles.logo}>
          <Ionicons name="search" size={52} color={colors.text} />
        </View>
        <Text style={styles.name}>Foundit</Text>
        <Text style={styles.tagline}>Find it. Report it. Get it back.</Text>
      </Animated.View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  logo: {
    width: 104,
    height: 104,
    borderRadius: radius.lg + 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...typography.title, fontSize: 38, marginTop: spacing.lg },
  tagline: { ...typography.caption, fontSize: 15, marginTop: spacing.xs },
  track: {
    position: 'absolute',
    bottom: 64,
    width: 120,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.primary },
});
