import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { palette, radius, shadow, spacing, typography } from '@/constants/theme';

type Props = {
  eyebrow: string;
  title: string;
  icon: AppIconName;
  message: string;
};

export function PlaceholderScreen({ eyebrow, title, icon, message }: Props) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow={eyebrow} title={title} />
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <AppIcon name={icon} color={palette.accent} size={24} />
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
    gap: spacing.section,
  },
  card: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.body,
    color: palette.muted,
    textAlign: 'center',
  },
});
