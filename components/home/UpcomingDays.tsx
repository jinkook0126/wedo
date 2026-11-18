import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import type { UpcomingDay } from '@/constants/sample-data';
import { palette, radius, shadow, toneColors, typography } from '@/constants/theme';
import { daysBetween, formatMonthDay } from '@/lib/date';

type Props = {
  days: UpcomingDay[];
  today?: Date;
};

type Day = UpcomingDay & { daysLeft: number };

function formatCountdown(daysLeft: number) {
  if (daysLeft === 0) return 'D-Day';
  return daysLeft > 0 ? `D-${daysLeft}` : `D+${-daysLeft}`;
}

function upcomingFrom(days: UpcomingDay[], today: Date): Day[] {
  return days
    .map((day) => ({ ...day, daysLeft: daysBetween(today, day.date) }))
    .filter((day) => day.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

function openCalendar() {
  router.push('/calendar');
}

export function UpcomingDays({ days, today = new Date() }: Props) {
  const upcoming = upcomingFrom(days, today);
  const pinned = upcoming.find((day) => day.pinned);
  const featured = upcoming.length >= 3 ? (pinned ?? upcoming[0]) : undefined;
  const rest = featured ? upcoming.filter((day) => day.id !== featured.id) : upcoming;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={typography.heading}>다가오는 날</Text>
        <Pressable
          onPress={openCalendar}
          accessibilityRole="button"
          accessibilityLabel="다가오는 날 전체 보기"
          hitSlop={8}
          style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}>
          <Text style={styles.seeAllLabel}>전체 보기</Text>
          <AppIcon name="chevronRight" color={palette.muted} size={14} />
        </Pressable>
      </View>

      {upcoming.length === 0 && <EmptyState />}
      {upcoming.length === 1 && <HeroCard day={upcoming[0]} />}
      {upcoming.length === 2 && (
        <View style={styles.pairRow}>
          {upcoming.map((day) => (
            <PairCard key={day.id} day={day} />
          ))}
        </View>
      )}
      {featured && (
        <>
          <HeroCard day={featured} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.miniScroll}
            contentContainerStyle={styles.miniRow}>
            {rest.map((day) => (
              <MiniCard key={day.id} day={day} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

function HeroCard({ day }: { day: Day }) {
  const { fg, bg } = toneColors[day.tone];
  return (
    <View
      style={[styles.hero, { backgroundColor: bg }]}
      accessible
      accessibilityLabel={cardLabel(day)}>
      <View style={styles.heroText}>
        {day.pinned && <AppIcon name="pin" color={fg} size={14} />}
        <Text style={styles.heroTitle} numberOfLines={1}>
          {day.title}
        </Text>
        <Text style={styles.date}>{formatMonthDay(day.date)}</Text>
      </View>
      <Text style={[styles.heroCount, { color: fg }]}>{formatCountdown(day.daysLeft)}</Text>
    </View>
  );
}

function PairCard({ day }: { day: Day }) {
  const { fg, bg } = toneColors[day.tone];
  return (
    <View
      style={[styles.pairCard, { backgroundColor: bg }]}
      accessible
      accessibilityLabel={cardLabel(day)}>
      {day.pinned && <AppIcon name="pin" color={fg} size={14} />}
      <Text style={styles.pairTitle} numberOfLines={1}>
        {day.title}
      </Text>
      <Text style={styles.date}>{formatMonthDay(day.date)}</Text>
      <Text style={[styles.pairCount, { color: fg }]}>{formatCountdown(day.daysLeft)}</Text>
    </View>
  );
}

function MiniCard({ day }: { day: Day }) {
  const { fg, bg } = toneColors[day.tone];
  return (
    <View style={[styles.mini, { backgroundColor: bg }]} accessible accessibilityLabel={cardLabel(day)}>
      <View style={styles.miniTitle}>
        {day.pinned ? (
          <AppIcon name="pin" color={fg} size={12} />
        ) : (
          <View style={[styles.dot, { backgroundColor: fg }]} />
        )}
        <Text style={typography.body} numberOfLines={1}>
          {day.title}
        </Text>
      </View>
      <Text style={[styles.miniCount, { color: fg }]}>{formatCountdown(day.daysLeft)}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>기대되는 날이 아직 없어요</Text>
      <Text style={styles.emptyBody}>캘린더에서 함께 기억하고 싶은 날을 추가해보세요</Text>
      <Pressable
        onPress={openCalendar}
        accessibilityRole="button"
        accessibilityLabel="캘린더 열기"
        style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}>
        <Text style={styles.emptyButtonLabel}>캘린더 열기</Text>
      </Pressable>
    </View>
  );
}

function cardLabel(day: Day) {
  return `${day.title}, ${formatMonthDay(day.date)}, ${formatCountdown(day.daysLeft)}`;
}

const styles = StyleSheet.create({
  section: {
    gap: 13,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllLabel: {
    ...typography.caption,
    color: palette.muted,
  },
  pressed: {
    opacity: 0.6,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  heroTitle: {
    ...typography.heading,
    fontSize: 16,
    lineHeight: 22,
  },
  heroCount: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  date: {
    ...typography.caption,
    color: palette.muted,
  },
  pairRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pairCard: {
    flex: 1,
    gap: 4,
    minHeight: 112,
    padding: 14,
    borderRadius: radius.lg,
  },
  pairTitle: {
    ...typography.body,
    fontWeight: '700',
  },
  pairCount: {
    marginTop: 'auto',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  miniScroll: {
    flexGrow: 0,
  },
  miniRow: {
    gap: 8,
  },
  mini: {
    width: 132,
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  miniTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  miniCount: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  empty: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  emptyTitle: {
    ...typography.body,
    fontWeight: '700',
  },
  emptyBody: {
    ...typography.caption,
    color: palette.muted,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: palette.soft,
  },
  emptyButtonLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.accent,
  },
});
