import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { Pill } from '@/components/ui/Pill';
import { palette, radius, shadow, typography } from '@/constants/theme';
import { daysBetween } from '@/lib/date';

type Props = {
  startDate: Date;
  anniversary: { label: string; date: Date };
  today?: Date;
};

export function DDayCard({ startDate, anniversary, today = new Date() }: Props) {
  const daysTogether = daysBetween(startDate, today) + 1;
  const daysLeft = daysBetween(today, anniversary.date);
  const countdown = daysLeft === 0 ? '오늘' : daysLeft > 0 ? `${daysLeft}일 전` : `${-daysLeft}일 지남`;

  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <AppIcon name="heart" color={palette.accent} size={22} />
      </View>

      <View style={styles.body}>
        <Text style={styles.caption}>매일 조금씩 더 사랑하는 우리</Text>
        <Text style={styles.count} numberOfLines={1} adjustsFontSizeToFit>
          함께한 지 {daysTogether.toLocaleString('ko-KR')}일
        </Text>
      </View>

      <View style={styles.next}>
        <Pill label={countdown} tone="accent" />
        <Text style={styles.nextLabel}>{anniversary.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: palette.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  caption: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
  },
  count: {
    ...typography.heading,
    fontSize: 22,
    lineHeight: 30,
  },
  next: {
    alignItems: 'flex-end',
    gap: 3,
  },
  nextLabel: {
    ...typography.micro,
    color: palette.muted,
  },
});
