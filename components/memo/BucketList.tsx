import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TabIntro } from '@/components/memo/TabIntro';
import { AppIcon } from '@/components/ui/AppIcon';
import { Checkbox } from '@/components/ui/Checkbox';
import type { BucketItem } from '@/constants/memo-data';
import { palette, radius, shadow, typography } from '@/constants/theme';

type Props = {
  items: BucketItem[];
  onToggle: (id: string) => void;
};

export function BucketList({ items, onToggle }: Props) {
  const doneCount = items.filter((item) => item.done).length;

  return (
    <View style={styles.container}>
      <TabIntro title="우리의 다음을 꿈꿔요" subtitle="함께 이루고 싶은 일들, 하나씩 차근차근." />

      <View style={styles.summary}>
        <AppIcon name="heart" color={palette.accent} size={22} />
        <View style={styles.summaryText}>
          <Text style={typography.body}>작은 꿈이 우리의 추억으로</Text>
          <Text style={styles.summaryCount}>
            목표 {items.length}개 중 {doneCount}개를 이뤘어요
          </Text>
        </View>
      </View>

      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onToggle(item.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.done }}
          accessibilityLabel={item.title}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
          <Checkbox checked={item.done} />
          <View style={styles.details}>
            <Text style={typography.body}>{item.title}</Text>
            <View style={styles.meta}>
              <View style={styles.tag}>
                <Text style={styles.tagLabel}>{item.tag}</Text>
              </View>
              {item.note.length > 0 && (
                <Text style={styles.note} numberOfLines={1}>
                  {item.note}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.soft,
  },
  summaryText: {
    flex: 1,
    gap: 3,
  },
  summaryCount: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.accent,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  pressed: {
    opacity: 0.7,
  },
  details: {
    flex: 1,
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: palette.soft,
  },
  tagLabel: {
    ...typography.micro,
    color: palette.accent,
  },
  note: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
    flexShrink: 1,
  },
});
