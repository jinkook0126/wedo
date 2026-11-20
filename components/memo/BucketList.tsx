import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyList } from '@/components/memo/EmptyList';
import { AppIcon } from '@/components/ui/AppIcon';
import { Checkbox } from '@/components/ui/Checkbox';
import type { BucketItem } from '@/constants/memo-data';
import { palette, radius, shadow } from '@/constants/theme';

type Props = {
  items: BucketItem[];
  onToggle: (id: string) => void;
};

export function BucketList({ items, onToggle }: Props) {
  const doneItems = items.filter((item) => item.done);
  const openItems = items.filter((item) => !item.done);
  const progress = items.length === 0 ? 0 : doneItems.length / items.length;

  if (items.length === 0) {
    return (
      <EmptyList
        title="우리의 다음을 꿈꿔 볼까요?"
        subtitle="함께 해 보고 싶은 일을 적어 두면 하나씩 이룰 수 있어요"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>함께 이룬 버킷리스트</Text>
          <Text style={styles.count}>
            <Text style={styles.countDone}>{doneItems.length}</Text>
            <Text style={styles.countTotal}>{` / ${items.length}`}</Text>
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.card}>
        {openItems.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: false }}
            accessibilityLabel={item.title}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.divider,
              pressed && styles.pressed,
            ]}>
            <Checkbox checked={false} round />
            <View style={styles.details}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagLabel}>{item.tag}</Text>
                </View>
              </View>
              {item.note.length > 0 && <Text style={styles.note}>{item.note}</Text>}
            </View>
          </Pressable>
        ))}

        {doneItems.length > 0 && (
          <View style={[styles.doneRow, openItems.length > 0 && styles.divider]}>
            <Text style={styles.doneLabel}>완료 {doneItems.length}개</Text>
            <AppIcon name="chevronRight" color={palette.muted} size={16} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  progressCard: {
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  count: {
    fontVariant: ['tabular-nums'],
  },
  countDone: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.4,
    color: palette.accent,
  },
  countTotal: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    color: palette.muted,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: palette.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.accent,
  },
  card: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  pressed: {
    opacity: 0.6,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: palette.track,
  },
  tagLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: -0.1,
    color: palette.muted,
  },
  note: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
    letterSpacing: -0.1,
    color: palette.muted,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  doneLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: -0.2,
    color: palette.muted,
  },
});
