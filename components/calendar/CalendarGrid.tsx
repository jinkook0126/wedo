import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CalendarDay } from '@/constants/sample-data';
import { palette, radius, shadow, toneColors, typography } from '@/constants/theme';
import { buildMonthWeeks, formatKoreanDate, isSameDay, toDateKey, weekdayLabels } from '@/lib/date';

const CELL_HEIGHT = 108;
const MAX_LABELS = 2;

type Props = {
  year: number;
  month: number;
  days: Record<string, CalendarDay>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  today?: Date;
};

export function CalendarGrid({
  year,
  month,
  days,
  selectedDate,
  onSelectDate,
  today = new Date(),
}: Props) {
  const weeks = buildMonthWeeks(year, month);

  return (
    <View style={styles.card}>
      <View style={styles.weekdays}>
        {weekdayLabels.map((label, i) => (
          <Text key={label} style={[styles.weekday, { color: weekdayColor(i) }]}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week) => (
        <View key={toDateKey(week[0])} style={styles.week}>
          {week.map((date) => (
            <DayCell
              key={toDateKey(date)}
              date={date}
              inMonth={date.getMonth() === month}
              isToday={isSameDay(date, today)}
              isSelected={isSameDay(date, selectedDate)}
              day={days[toDateKey(date)]}
              onPress={() => onSelectDate(date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type DayCellProps = {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  day?: CalendarDay;
  onPress: () => void;
};

function DayCell({ date, inMonth, isToday, isSelected, day, onPress }: DayCellProps) {
  const events = inMonth ? (day?.events ?? []) : [];
  const photo = inMonth ? day?.photo : undefined;
  const hidden = events.length - MAX_LABELS;
  const dateColor = isToday
    ? '#FFFFFF'
    : isSelected
      ? palette.accent
      : weekdayColor(date.getDay());

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={formatKoreanDate(date)}
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.cell,
        !inMonth && styles.outside,
        isSelected && styles.selected,
        pressed && !isSelected && styles.pressed,
      ]}>
      <View style={[styles.dateBadge, isToday && styles.todayBadge]}>
        <Text style={[styles.date, { color: dateColor }]}>{date.getDate()}</Text>
      </View>

      <View style={styles.labels}>
        {events.slice(0, MAX_LABELS).map((event) => (
          <View
            key={event.id}
            style={[styles.label, { backgroundColor: toneColors[event.tone].bg }]}>
            <Text
              numberOfLines={1}
              style={[styles.labelText, { color: toneColors[event.tone].fg }]}>
              {event.title}
            </Text>
          </View>
        ))}
        {hidden > 0 && <Text style={styles.more}>+{hidden}</Text>}
      </View>

      {photo && <Image source={{ uri: photo }} style={styles.thumb} accessibilityIgnoresInvertColors />}
    </Pressable>
  );
}

function weekdayColor(weekday: number) {
  if (weekday === 0) return palette.accent;
  if (weekday === 6) return palette.blue;
  return palette.ink;
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 6,
    paddingBottom: 6,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  weekdays: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  weekday: {
    ...typography.micro,
    flex: 1,
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  cell: {
    flex: 1,
    height: CELL_HEIGHT,
    paddingTop: 6,
    paddingHorizontal: 2,
    paddingBottom: 4,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  outside: {
    opacity: 0.3,
  },
  selected: {
    borderRadius: 10,
    backgroundColor: palette.bg,
    outlineWidth: 1.5,
    outlineColor: palette.accent,
    outlineOffset: -1.5,
  },
  pressed: {
    borderRadius: 10,
    backgroundColor: palette.bg,
  },
  dateBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadge: {
    backgroundColor: palette.accent,
  },
  date: {
    ...typography.caption,
    fontWeight: '700',
  },
  labels: {
    alignSelf: 'stretch',
    gap: 2,
  },
  label: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  more: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    color: palette.muted,
    textAlign: 'center',
  },
  thumb: {
    marginTop: 'auto',
    alignSelf: 'stretch',
    flexBasis: 30,
    flexShrink: 1,
    minHeight: 14,
    borderRadius: 6,
    backgroundColor: palette.line,
  },
});
