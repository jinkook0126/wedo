import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swipeable, { SwipeDirection } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DdayEditSheet } from '@/components/dday/DdayEditSheet';
import { useDays } from '@/components/home/DaysProvider';
import { AppIcon } from '@/components/ui/AppIcon';
import type { UpcomingDay } from '@/constants/sample-data';
import { palette, shadow, spacing, toneColors } from '@/constants/theme';
import { daysBetween, nextOccurrence } from '@/lib/date';

type Tab = 'upcoming' | 'past';
type Day = UpcomingDay & { daysLeft: number };

const TABS: { value: Tab; label: string }[] = [
  { value: 'upcoming', label: '다가오는 날' },
  { value: 'past', label: '지난 날' },
];

function formatCountdown(daysLeft: number) {
  if (daysLeft === 0) return 'D-Day';
  const count = Math.abs(daysLeft).toLocaleString('ko-KR');
  return daysLeft > 0 ? `D-${count}` : `D+${count}`;
}

function daysFor(days: UpcomingDay[], tab: Tab, today: Date): Day[] {
  const withCount = days.map((day) => {
    const date = day.repeatsYearly ? nextOccurrence(day.date, today) : day.date;
    return { ...day, date, daysLeft: daysBetween(today, date) };
  });
  if (tab === 'upcoming') {
    return withCount
      .filter((day) => day.repeatsYearly || day.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }
  return withCount.filter((day) => !day.repeatsYearly && day.daysLeft < 0).sort((a, b) => b.daysLeft - a.daysLeft);
}

export default function DdayScreen() {
  const { days, removeDay, pinDay, unpinDay } = useDays();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [editingId, setEditingId] = useState<string | null>(null);
  const visible = daysFor(days, tab, new Date());
  const editing = days.find((day) => day.id === editingId) ?? null;

  const requestPin = (day: Day) => {
    if (day.pinned) {
      unpinDay(day.id);
      return;
    }

    const current = days.find((item) => item.pinned);
    if (!current) {
      pinDay(day.id);
      return;
    }

    Alert.alert(
      '고정을 바꿀까요?',
      `지금은 "${current.title}"이 고정되어 있어요.\n바꿀 날: ${day.title}`,
      [
        { text: '취소', style: 'cancel' },
        { text: '바꾸기', onPress: () => pinDay(day.id) },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <AppIcon name="chevronLeft" color={palette.ink} size={22} />
        </Pressable>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((item) => {
          const selected = item.value === tab;
          return (
            <Pressable
              key={item.value}
              onPress={() => setTab(item.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={styles.tab}>
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {visible.length === 0 ? (
          <Text style={styles.empty}>
            {tab === 'upcoming' ? '다가오는 날이 아직 없어요' : '지나간 날이 아직 없어요'}
          </Text>
        ) : tab === 'past' ? (
          pastSections(visible).map((section) => (
            <View key={section.year} style={styles.yearGroup}>
              <Text style={styles.yearLabel}>{section.year}년</Text>
              {section.days.map((day) => (
                <DdayRow
                  key={day.id}
                  day={day}
                  plain
                  onPress={() => setEditingId(day.id)}
                  onDelete={removeDay}
                />
              ))}
            </View>
          ))
        ) : (
          visible.map((day) => (
            <DdayRow
              key={day.id}
              day={day}
              onPress={() => setEditingId(day.id)}
              onDelete={removeDay}
              onPin={requestPin}
            />
          ))
        )}
      </ScrollView>
      <DdayEditSheet day={editing} onClose={() => setEditingId(null)} />
    </SafeAreaView>
  );
}

function pastSections(days: Day[]) {
  const sections: { year: number; days: Day[] }[] = [];
  for (const day of days) {
    const year = day.date.getFullYear();
    const last = sections[sections.length - 1];
    if (!last || last.year !== year) sections.push({ year, days: [day] });
    else last.days.push(day);
  }
  return sections;
}

function DdayRow({
  day,
  plain = false,
  onPress,
  onDelete,
  onPin,
}: {
  day: Day;
  plain?: boolean;
  onPress: () => void;
  onDelete: (id: string) => void;
  onPin?: (day: Day) => void;
}) {
  const { fg, bg } = plain
    ? { fg: palette.muted, bg: palette.track }
    : toneColors[day.tone];
  const countdown = formatCountdown(day.daysLeft);
  const label = `${day.date.getFullYear()}년 ${day.date.getMonth() + 1}월 ${day.date.getDate()}일, ${day.title}, ${countdown}${day.pinned ? ', 고정됨' : ''}`;

  return (
    <Swipeable
      containerStyle={styles.swipe}
      overshootRight={false}
      friction={1}
      rightThreshold={72}
      renderRightActions={() => (
        <View style={styles.delete}>
          <Text style={styles.deleteLabel}>삭제</Text>
        </View>
      )}
      onSwipeableOpen={(direction) => {
        if (direction === SwipeDirection.LEFT) onDelete(day.id);
      }}>
      <Pressable
        onPress={onPress}
        onLongPress={onPin ? () => onPin(day) : undefined}
        delayLongPress={450}
        accessible
        accessibilityLabel={label}
        accessibilityHint={
          onPin
            ? '누르면 수정하고, 길게 누르면 고정하고, 왼쪽으로 밀면 삭제합니다'
            : '누르면 수정하고, 왼쪽으로 밀면 삭제합니다'
        }
        accessibilityActions={[
          { name: 'delete', label: '삭제' },
          ...(onPin ? [{ name: 'pin', label: day.pinned ? '고정 해제' : '고정' }] : []),
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'delete') onDelete(day.id);
          if (event.nativeEvent.actionName === 'pin') onPin?.(day);
        }}
        style={styles.row}>
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeMonth, { color: fg }]}>{day.date.getMonth() + 1}월</Text>
          <Text style={[styles.badgeDay, { color: fg }]}>{day.date.getDate()}</Text>
        </View>
        <View style={styles.titleWrap}>
          {day.pinned && <AppIcon name="pin" color={fg} size={14} />}
          <Text style={styles.rowTitle} numberOfLines={1}>
            {day.title}
          </Text>
        </View>
        <Text style={[styles.count, plain && styles.plainCount, !plain && { color: fg }]}>{countdown}</Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  header: {
    height: 48,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screen,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.muted,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabelSelected: {
    fontWeight: '700',
    color: palette.ink,
    borderBottomColor: palette.accent,
  },
  list: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
    gap: 10,
  },
  yearGroup: {
    gap: 10,
  },
  yearLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.2,
    color: palette.muted,
  },
  empty: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: palette.muted,
  },
  swipe: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  delete: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4534A',
  },
  deleteLabel: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: palette.surface,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeMonth: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  badgeDay: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  plainCount: {
    color: palette.muted,
  },
});
