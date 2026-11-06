import { Image, StyleSheet, Text, View } from 'react-native';

import { Pill } from '@/components/ui/Pill';
import type { CalendarDay, CalendarEvent } from '@/constants/sample-data';
import { palette, radius, shadow, toneColors, typography } from '@/constants/theme';
import { formatKoreanDate, formatKoreanTime, formatMonthDay, fromDateKey } from '@/lib/date';

type Props = {
  date: Date;
  day?: CalendarDay;
};

export function DaySchedule({ date, day }: Props) {
  const events = day?.events ?? [];
  const photo = day?.photo;
  const isEmpty = events.length === 0 && !photo;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={typography.heading}>{formatKoreanDate(date)}</Text>
        {events.length > 0 && <Pill label={`일정 ${events.length}개`} tone="accent" />}
      </View>

      <View style={styles.card}>
        {isEmpty && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>등록된 일정이 없어요</Text>
            <Text style={styles.emptyHint}>날짜를 한 번 더 누르면 바로 추가할 수 있어요</Text>
          </View>
        )}

        {events.map((event, index) => (
          <View key={event.id} style={[styles.row, index > 0 && styles.divider]}>
            <View style={[styles.bar, { backgroundColor: toneColors[event.tone].fg }]} />
            <View style={styles.details}>
              <Text style={typography.body}>{event.title}</Text>
              <Text style={styles.time}>{describeTime(event)}</Text>
              {event.memo && <Text style={styles.memo}>{event.memo}</Text>}
            </View>
          </View>
        ))}

        {photo && (
          <View style={[styles.photoBlock, events.length > 0 && styles.divider]}>
            <Text style={styles.photoLabel}>그날의 사진</Text>
            <Image source={{ uri: photo }} style={styles.photo} accessibilityIgnoresInvertColors />
          </View>
        )}
      </View>
    </View>
  );
}

function describeTime({ time, endTime, span }: CalendarEvent) {
  const at = (t?: string) => (t ? ` ${formatKoreanTime(t)}` : '');
  if (span) {
    const from = formatMonthDay(fromDateKey(span.start));
    const to = formatMonthDay(fromDateKey(span.end));
    return `${from}${at(time)} ~ ${to}${at(endTime)}`;
  }
  if (!time) return '하루 종일';
  return endTime ? `${formatKoreanTime(time)} ~ ${formatKoreanTime(endTime)}` : formatKoreanTime(time);
}

const styles = StyleSheet.create({
  section: {
    gap: 13,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  empty: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 28,
  },
  emptyTitle: {
    ...typography.body,
    color: palette.muted,
  },
  emptyHint: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  bar: {
    alignSelf: 'stretch',
    width: 4,
    minHeight: 34,
    borderRadius: radius.pill,
  },
  details: {
    flex: 1,
    gap: 3,
  },
  time: {
    ...typography.caption,
    color: palette.muted,
  },
  memo: {
    ...typography.caption,
    color: palette.ink,
    marginTop: 2,
  },
  photoBlock: {
    gap: 8,
    paddingTop: 14,
    paddingBottom: 12,
  },
  photoLabel: {
    ...typography.micro,
    color: palette.muted,
  },
  photo: {
    height: 160,
    borderRadius: radius.md,
    backgroundColor: palette.line,
  },
});
