import * as Location from 'expo-location';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { HomeLocation } from '../storage';
import { colors, font, radius, spacing } from '../theme';

type Props = {
  visible: boolean;
  current: HomeLocation | null;
  onClose: () => void;
  onSave: (home: HomeLocation) => void;
  onClear: () => void;
};

export default function HomeModal({
  visible,
  current,
  onClose,
  onSave,
  onClear,
}: Props) {
  const [address, setAddress] = useState(current?.label ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const query = address.trim();
    if (!query) {
      setError('Enter an address first.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const results = await Location.geocodeAsync(query);
      if (!results.length) {
        setError("Couldn't find that address. Try adding the city or ZIP.");
        return;
      }
      const { latitude, longitude } = results[0];
      onSave({ label: query, lat: latitude, lng: longitude });
    } catch {
      setError('Something went wrong looking that up. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdropTap} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Set your home</Text>
          <Text style={styles.subtitle}>
            Enter your address and the compass can point you home at the end of
            the night.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 8000 Baltimore Ave, College Park, MD"
            placeholderTextColor={colors.textFaint}
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              setError(null);
            }}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
            ]}
            onPress={handleSave}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.primaryText}>Save home</Text>
            )}
          </Pressable>

          {current ? (
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={() => {
                onClear();
                setAddress('');
              }}
            >
              <Text style={styles.clearText}>Remove saved home</Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backdropTap: { flex: 1 },
  sheet: {
    backgroundColor: '#1B2138',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textFaint,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: font.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: font.body,
    color: colors.text,
  },
  error: {
    color: colors.redSoft,
    fontSize: font.caption,
    marginTop: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.red,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    shadowColor: colors.red,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryText: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  clearText: {
    color: colors.textMuted,
    fontSize: font.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
  pressed: { opacity: 0.7 },
});
