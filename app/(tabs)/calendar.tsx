import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddEventSheet, type NewEvent } from '@/components/calendar/AddEventSheet';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { DaySchedule } from '@/components/calendar/DaySchedule';
import { AppIcon } from '@/components/ui/AppIcon';
import { FAB_SIZE, FloatingAddButton } from '@/components/ui/FloatingAddButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { calendarDays, type CalendarEvent } from '@/constants/sample-data';
import { palette, radius, shadow, spacing, typography, type Tone } from '@/constants/theme';
import { eachDay, isSameDay, toDateKey, toTimeKey } from '@/lib/date';

const EVENT_TONES: Tone[] = ['accent', 'green', 'blue'];

function sortByTime(events: CalendarEvent[]) {
  return [...events].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default function CalendarScreen() {
  const today = startOfToday();
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [days, setDays] = useState(calendarDays);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isShowingToday = isSameMonth(cursor, today) && isSameDay(selectedDate, today);

  const focusDate = (date: Date) => {
    setSelectedDate(date);
    if (!isSameMonth(date, cursor)) setCursor(startOfMonth(date));
  };

  const selectDate = (date: Date) => {
    if (isSameDay(date, selectedDate)) setSheetOpen(true);
    else focusDate(date);
  };

  const addEvent = ({ title, memo, start, end, allDay }: NewEvent) => {
    const dates = eachDay(start, end);
    const startKey = toDateKey(start);
    setDays((prev) => {
      const event: CalendarEvent = {
        id: `${Date.now()}`,
        title,
        memo,
        time: allDay ? undefined : toTimeKey(start),
        endTime: allDay ? undefined : toTimeKey(end),
        span: dates.length > 1 ? { start: startKey, end: toDateKey(end) } : undefined,
        tone: EVENT_TONES[(prev[startKey]?.events?.length ?? 0) % EVENT_TONES.length],
      };
      const next = { ...prev };
      for (const date of dates) {
        const key = toDateKey(date);
        next[key] = { ...next[key], events: sortByTime([...(next[key]?.events ?? []), event]) };
      }
      return next;
    });
    setSheetOpen(false);
    focusDate(start);
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    setCursor(next);
    setSelectedDate(isSameMonth(next, today) ? today : next);
  };

  const goToToday = () => {
    setCursor(startOfMonth(today));
    setSelectedDate(today);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="함께 채워가는 우리의 날들"
          title={`${cursor.getFullYear()}년 ${cursor.getMonth() + 1}월`}
          right={
            <View style={styles.nav}>
              <Pressable
                onPress={goToToday}
                disabled={isShowingToday}
                accessibilityRole="button"
                accessibilityLabel="오늘로 이동"
                accessibilityState={{ disabled: isShowingToday }}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.todayButton,
                  isShowingToday && styles.todayButtonIdle,
                  pressed && { opacity: 0.6 },
                ]}>
                <Text style={[styles.todayLabel, isShowingToday && styles.todayLabelIdle]}>
                  오늘
                </Text>
              </Pressable>
              <NavButton icon="chevronLeft" label="이전 달" onPress={() => shiftMonth(-1)} />
              <NavButton icon="chevronRight" label="다음 달" onPress={() => shiftMonth(1)} />
            </View>
          }
        />
        <CalendarGrid
          year={cursor.getFullYear()}
          month={cursor.getMonth()}
          days={days}
          selectedDate={selectedDate}
          onSelectDate={selectDate}
          today={today}
        />
        <DaySchedule date={selectedDate} day={days[toDateKey(selectedDate)]} />
      </ScrollView>

      <FloatingAddButton onPress={() => setSheetOpen(true)} accessibilityLabel="일정 추가" />

      <AddEventSheet
        visible={sheetOpen}
        initialDate={selectedDate}
        onClose={() => setSheetOpen(false)}
        onSave={addEvent}
      />
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
    paddingBottom: FAB_SIZE + spacing.screen * 2,
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
