import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function MemoTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            hitSlop={6}
            style={styles.tab}>
            <Text style={[styles.label, selected ? styles.selected : styles.idle]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
  },
  tab: {
    paddingVertical: 2,
  },
  label: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  selected: {
    fontWeight: '800',
    color: palette.ink,
  },
  idle: {
    fontWeight: '500',
    color: palette.muted,
  },
});
