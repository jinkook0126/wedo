import { Pressable, StyleSheet } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { palette, radius, spacing } from '@/constants/theme';

export const FAB_SIZE = 56;

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
};

export function FloatingAddButton({ onPress, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <AppIcon name="plus" color="#FFFFFF" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.screen,
    bottom: 20,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 20px 0px rgba(231, 131, 114, 0.35)',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
