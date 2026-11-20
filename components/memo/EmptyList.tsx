import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  title: string;
  subtitle: string;
};

export function EmptyList({ title, subtitle }: Props) {
  return (
    <View style={styles.empty}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.3,
    color: palette.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    letterSpacing: -0.15,
    color: palette.muted,
    textAlign: 'center',
  },
});
