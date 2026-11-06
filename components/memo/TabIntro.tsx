import { StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/theme';

type Props = {
  title: string;
  subtitle: string;
};

export function TabIntro({ title, subtitle }: Props) {
  return (
    <View style={styles.intro}>
      <Text style={[typography.heading, styles.title]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 8,
  },
  title: {
    fontSize: 21,
    lineHeight: 28,
  },
  subtitle: {
    ...typography.caption,
    color: palette.muted,
  },
});
