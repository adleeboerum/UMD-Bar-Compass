import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BARS, type Destination } from './src/bars';
import {
  bearingDegrees,
  cardinal,
  distanceMiles,
  formatDistance,
  formatWalkTime,
} from './src/geo';
import { clearHome, loadHome, saveHome, type HomeLocation } from './src/storage';
import { colors, font, radius, spacing } from './src/theme';
import CompassDial from './src/components/CompassDial';
import DestinationPicker from './src/components/DestinationPicker';
import HomeModal from './src/components/HomeModal';

type Coords = { lat: number; lng: number };

/** Animate an Animated.Value toward `target` degrees via the shortest path. */
function spinTo(
  value: Animated.Value,
  lastRef: { current: number },
  target: number
) {
  let delta = (((target - lastRef.current) % 360) + 360) % 360;
  if (delta > 180) delta -= 360;
  const next = lastRef.current + delta;
  lastRef.current = next;
  Animated.timing(value, {
    toValue: next,
    duration: 220,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start();
}

export default function App() {
  const { width } = useWindowDimensions();
  const dialSize = Math.min(width - spacing.lg * 2, 320);

  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>(
    'pending'
  );
  const [user, setUser] = useState<Coords | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [home, setHome] = useState<HomeLocation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(BARS[0].id);

  // Load any saved home on first launch.
  useEffect(() => {
    loadHome().then(setHome);
  }, []);

  // Destinations: saved home first (if any), then the College Park bars.
  const destinations: Destination[] = useMemo(() => {
    const bars: Destination[] = BARS.map((b) => ({ ...b, kind: 'bar' }));
    if (home) {
      return [
        { id: 'home', name: 'Home', lat: home.lat, lng: home.lng, kind: 'home', tag: home.label },
        ...bars,
      ];
    }
    return bars;
  }, [home]);

  const dest =
    destinations.find((d) => d.id === selectedId) ?? destinations[0];

  // Subscribe to GPS position and compass heading once permission is granted.
  useEffect(() => {
    let posSub: Location.LocationSubscription | undefined;
    let headSub: Location.LocationSubscription | undefined;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermission('denied');
        return;
      }
      setPermission('granted');

      posSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 5 },
        (loc) =>
          setUser({ lat: loc.coords.latitude, lng: loc.coords.longitude })
      );

      headSub = await Location.watchHeadingAsync((h) => {
        setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
      });
    })();

    return () => {
      posSub?.remove();
      headSub?.remove();
    };
  }, []);

  const ready = user !== null && heading !== null;
  const bearing = user ? bearingDegrees(user.lat, user.lng, dest.lat, dest.lng) : 0;
  const distance = user ? distanceMiles(user.lat, user.lng, dest.lat, dest.lng) : 0;
  const arrowAngle = (((bearing - (heading ?? 0)) % 360) + 360) % 360;

  // Two independent rotations: the ring tracks true north, the needle the bar.
  const dialRot = useRef(new Animated.Value(0)).current;
  const needleRot = useRef(new Animated.Value(0)).current;
  const dialLast = useRef(0);
  const needleLast = useRef(0);

  useEffect(() => {
    spinTo(dialRot, dialLast, -(heading ?? 0));
  }, [heading, dialRot]);

  useEffect(() => {
    spinTo(needleRot, needleLast, arrowAngle);
  }, [arrowAngle, needleRot]);

  // interpolate [0,1] -> ['0deg','1deg'] is identity for any accumulated value.
  const dialSpin = dialRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1deg'],
  });
  const needleSpin = needleRot.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1deg'],
  });

  async function handleSaveHome(h: HomeLocation) {
    await saveHome(h);
    setHome(h);
    setSelectedId('home');
    setModalOpen(false);
  }

  async function handleClearHome() {
    await clearHome();
    setHome(null);
    if (selectedId === 'home') setSelectedId(BARS[0].id);
    setModalOpen(false);
  }

  return (
    <SafeAreaProvider>
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.bgTop, colors.bgBottom]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>BAR COMPASS</Text>
            <Text style={styles.brandSub}>College Park · MD</Text>
          </View>
          <Pressable
            onPress={() => setModalOpen(true)}
            style={({ pressed }) => [styles.homeBtn, pressed && styles.pressed]}
          >
            <Text style={styles.homeBtnText}>
              {home ? '🏠 Edit home' : '🏠 Set home'}
            </Text>
          </Pressable>
        </View>

        {/* Compass */}
        <View style={styles.compassWrap}>
          <CompassDial
            size={dialSize}
            dialSpin={dialSpin}
            needleSpin={needleSpin}
            active={ready}
          />
        </View>

        {/* Readout card */}
        <View style={styles.card}>
          {permission === 'denied' ? (
            <Text style={styles.help}>
              Location is needed to point you to {dest.name}. Enable it in
              Settings, then reopen Bar Compass.
            </Text>
          ) : !ready ? (
            <Text style={styles.help}>
              Calibrating… move your phone in a figure-8 and make sure you’re
              outdoors with a clear GPS signal.
            </Text>
          ) : (
            <>
              <Text style={styles.cardLabel}>
                {dest.kind === 'home' ? 'Heading home' : 'Pointing to'}
              </Text>
              <Text style={styles.cardName}>{dest.name}</Text>
              <View style={styles.statsRow}>
                <Stat value={formatDistance(distance)} label="distance" />
                <Divider />
                <Stat value={cardinal(bearing)} label="direction" />
                <Divider />
                <Stat value={formatWalkTime(distance)} label="on foot" small />
              </View>
            </>
          )}
        </View>

        {/* Destination chips */}
        <View style={styles.pickerWrap}>
          <DestinationPicker
            destinations={destinations}
            selectedId={dest.id}
            onSelect={setSelectedId}
          />
        </View>
      </SafeAreaView>

      <HomeModal
        visible={modalOpen}
        current={home}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveHome}
        onClear={handleClearHome}
      />
    </View>
    </SafeAreaProvider>
  );
}

function Stat({
  value,
  label,
  small,
}: {
  value: string;
  label: string;
  small?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, small && styles.statValueSmall]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.statDivider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgTop },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  brand: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandSub: {
    color: colors.gold,
    fontSize: font.caption,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  homeBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  homeBtnText: { color: colors.text, fontSize: font.caption, fontWeight: '700' },
  compassWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: font.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  cardName: {
    color: colors.text,
    fontSize: font.display - 8,
    fontWeight: '800',
    marginTop: 2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '800',
  },
  statValueSmall: { fontSize: font.body },
  statLabel: {
    color: colors.textFaint,
    fontSize: font.caption,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  pickerWrap: {
    paddingVertical: spacing.lg,
  },
  help: {
    color: colors.textMuted,
    fontSize: font.body,
    textAlign: 'center',
    lineHeight: 23,
  },
  pressed: { opacity: 0.7 },
});
