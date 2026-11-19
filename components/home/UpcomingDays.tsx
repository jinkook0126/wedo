import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const below = featured
    ? upcoming.filter((day) => day.id !== featured.id).slice(0, 2)
    : [];

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.sectionTitle}>다가오는 날</Text>
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
        <>
          <HeroCard day={upcoming[0]} kicker={upcoming[0].pinned ? undefined : '가장 가까운 날'} />
          <ListCard day={upcoming[1]} />
        </>
      )}
      {featured && (
        <>
          <HeroCard day={featured} />
          <View style={styles.miniRow}>
            {below.map((day) => (
              <MiniCard key={day.id} day={day} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function HeroCard({ day, kicker }: { day: Day; kicker?: string }) {
  const { fg, bg } = toneColors[day.tone];
  return (
    <View
      style={[styles.hero, { backgroundColor: bg }]}
      accessible
      accessibilityLabel={cardLabel(day)}>
      <View style={styles.heroText}>
        {kicker ? (
          <Text style={[styles.kicker, { color: fg }]}>{kicker}</Text>
        ) : (
          day.pinned && <AppIcon name="pin" color={fg} size={14} />
        )}
        <Text style={styles.heroTitle} numberOfLines={1}>
          {day.title}
        </Text>
        <Text style={styles.date}>{formatMonthDay(day.date)}</Text>
      </View>
      <Text style={[styles.heroCount, { color: fg }]}>{formatCountdown(day.daysLeft)}</Text>
    </View>
  );
}

function ListCard({ day }: { day: Day }) {
  const { fg, bg } = toneColors[day.tone];
  return (
    <View style={styles.listCard} accessible accessibilityLabel={cardLabel(day)}>
      <View style={styles.listText}>
        <View style={styles.listTitle}>
          {day.pinned && <AppIcon name="pin" color={fg} size={12} />}
          <Text style={styles.listLabel} numberOfLines={1}>
            {day.title}
          </Text>
        </View>
        <Text style={styles.date}>{formatMonthDay(day.date)}</Text>
      </View>
      <View style={[styles.listBadge, { backgroundColor: bg }]}>
        <Text style={[styles.listBadgeLabel, { color: fg }]}>{formatCountdown(day.daysLeft)}</Text>
      </View>
    </View>
  );
}

function MiniCard({ day }: { day: Day }) {
  const { fg, bg } = toneColors[day.tone];
  return (
    <View style={[styles.mini, { backgroundColor: bg }]} accessible accessibilityLabel={cardLabel(day)}>
      <View style={styles.miniTitle}>
        {day.pinned && <AppIcon name="pin" color={fg} size={12} />}
        <Text style={styles.miniLabel} numberOfLines={1}>
          {day.title}
        </Text>
      </View>
      <View style={styles.miniFooter}>
        <Text style={[styles.miniCount, { color: fg }]}>{formatCountdown(day.daysLeft)}</Text>
        <Text style={styles.miniDate}>{formatMonthDay(day.date)}</Text>
      </View>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.ink,
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
  kicker: {
    ...typography.caption,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  heroCount: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 39,
    letterSpacing: -0.64,
  },
  date: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: -0.22,
    color: palette.muted,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.surface,
  },
  listText: {
    flex: 1,
    gap: 2,
  },
  listTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listLabel: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: -0.24,
    color: palette.ink,
  },
  listBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  listBadgeLabel: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  miniRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mini: {
    flex: 1,
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
  miniLabel: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: -0.24,
    color: palette.ink,
  },
  miniFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  miniCount: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  miniDate: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: -0.22,
    color: palette.muted,
    textAlign: 'right',
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
