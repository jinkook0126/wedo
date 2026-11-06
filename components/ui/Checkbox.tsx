import { StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { palette, radius, toneColors, type Tone } from '@/constants/theme';

type Props = {
  checked: boolean;
  tone?: Tone;
};

export function Checkbox({ checked, tone = 'accent' }: Props) {
  const fill = toneColors[tone].fg;
  return (
    <View style={[styles.box, checked && { backgroundColor: fill, borderColor: fill }]}>
      {checked && <AppIcon name="check" color="#FFFFFF" size={14} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: palette.line,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
