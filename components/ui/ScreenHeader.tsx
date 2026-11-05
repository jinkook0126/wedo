import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/theme';

type Props = {
  eyebrow: string;
  title: string;
  right?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={typography.title}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.muted,
    letterSpacing: 0.8,
  },
});
