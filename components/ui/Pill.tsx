import { StyleSheet, Text, View } from 'react-native';

import { radius, toneColors, typography, type Tone } from '@/constants/theme';

type Props = {
  label: string;
  tone: Tone;
};

export function Pill({ label, tone }: Props) {
  const { fg, bg } = toneColors[tone];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  label: {
    ...typography.micro,
  },
});
