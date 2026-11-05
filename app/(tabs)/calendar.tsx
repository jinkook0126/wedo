import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { AppIcon } from '@/components/ui/AppIcon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { calendarDays } from '@/constants/sample-data';
import { palette, radius, shadow, spacing, typography } from '@/constants/theme';

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function CalendarScreen() {
  const [cursor, setCursor] = useState(startOfCurrentMonth);
  const today = startOfCurrentMonth();
  const isCurrentMonth =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const shiftMonth = (delta: number) =>
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="함께 채워가는 우리의 날들"
          title={`${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`}
          right={
            <View style={styles.nav}>
              <Pressable
                onPress={() => setCursor(startOfCurrentMonth())}
                disabled={isCurrentMonth}
                accessibilityRole="button"
                accessibilityLabel="오늘로 이동"
                accessibilityState={{ disabled: isCurrentMonth }}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.todayButton,
                  isCurrentMonth && styles.todayButtonIdle,
                  pressed && { opacity: 0.6 },
                ]}>
                <Text style={[styles.todayLabel, isCurrentMonth && styles.todayLabelIdle]}>
                  오늘
                </Text>
              </Pressable>
              <NavButton icon="chevronLeft" label="이전 달" onPress={() => shiftMonth(-1)} />
              <NavButton icon="chevronRight" label="다음 달" onPress={() => shiftMonth(1)} />
            </View>
          }
        />
        <CalendarGrid year={cursor.getFullYear()} month={cursor.getMonth()} days={calendarDays} />
      </ScrollView>
    </SafeAreaView>
  );
}

type NavButtonProps = {
  icon: 'chevronLeft' | 'chevronRight';
  label: string;
  onPress: () => void;
};

function NavButton({ icon, label, onPress }: NavButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.navButton, pressed && { opacity: 0.6 }]}>
      <AppIcon name={icon} color={palette.ink} size={16} />
    </Pressable>
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
  nav: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  todayButton: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: palette.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButtonIdle: {
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  todayLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.accent,
  },
  todayLabelIdle: {
    color: palette.muted,
  },
  navButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
