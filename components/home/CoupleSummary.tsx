import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { daysBetween } from '@/lib/date';

type Props = {
  names: string;
  startDate: Date;
  today?: Date;
};

function formatSince(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day} 부터`;
}

function formatTogether(start: Date, today: Date) {
  const days = daysBetween(start, today);
  if (days === 0) return 'D-Day';
  const count = Math.abs(days).toLocaleString('ko-KR');
  return days > 0 ? `D+${count}` : `D-${count}`;
}

export function CoupleSummary({ names, startDate, today = new Date() }: Props) {
  const since = formatSince(startDate);
  const together = formatTogether(startDate, today);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${names}, ${since}, ${together}`}>
      <View style={styles.text}>
        <Text style={styles.names}>{names}</Text>
        <Text style={styles.since}>{since}</Text>
      </View>
      <Text style={styles.count}>{together}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  names: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.32,
    color: palette.ink,
  },
  since: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: -0.24,
    color: palette.muted,
  },
  count: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.72,
    color: palette.accent,
  },
});
