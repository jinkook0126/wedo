import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, shadow, typography } from '@/constants/theme';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.selected]}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.md + 4,
    backgroundColor: palette.track,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.muted,
  },
  selectedLabel: {
    color: palette.ink,
  },
});
