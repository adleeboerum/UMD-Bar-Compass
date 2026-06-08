import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Destination } from '../bars';
import { colors, font, radius, spacing } from '../theme';

type Props = {
  destinations: Destination[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function DestinationPicker({
  destinations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {destinations.map((d) => {
        const selected = d.id === selectedId;
        const home = d.kind === 'home';
        return (
          <Pressable
            key={d.id}
            onPress={() => onSelect(d.id)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              home && !selected && styles.chipHome,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.icon}>{home ? '🏠' : '🍺'}</Text>
            <View>
              <Text
                style={[styles.name, selected && styles.nameSelected]}
                numberOfLines={1}
              >
                {d.name}
              </Text>
              {d.tag ? (
                <Text
                  style={[styles.tag, selected && styles.tagSelected]}
                  numberOfLines={1}
                >
                  {d.tag}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipSelected: {
    backgroundColor: colors.red,
    borderColor: colors.redSoft,
  },
  chipHome: {
    borderColor: colors.gold,
  },
  icon: { fontSize: 18 },
  name: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  nameSelected: { color: colors.text },
  tag: {
    color: colors.textMuted,
    fontSize: font.caption,
  },
  tagSelected: { color: 'rgba(255,255,255,0.85)' },
  pressed: { opacity: 0.7 },
});
