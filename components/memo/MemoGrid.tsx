import { StyleSheet, Text, View } from 'react-native';

import { TabIntro } from '@/components/memo/TabIntro';
import { AppIcon } from '@/components/ui/AppIcon';
import type { Memo } from '@/constants/memo-data';
import { palette, radius, shadow, typography } from '@/constants/theme';

type Props = {
  memos: Memo[];
};

export function MemoGrid({ memos }: Props) {
  const columns = [memos.filter((_, i) => i % 2 === 0), memos.filter((_, i) => i % 2 === 1)];

  return (
    <View style={styles.container}>
      <TabIntro title="잊고 싶지 않은 이야기" subtitle="사소한 생각도, 소중한 약속도 함께." />

      <View style={styles.grid}>
        {columns.map((column, c) => (
          <View key={c} style={styles.column}>
            {column.map((memo) => (
              <MemoCard key={memo.id} memo={memo} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function MemoCard({ memo }: { memo: Memo }) {
  return (
    <View style={[styles.card, memo.favorite && styles.favorite]}>
      {memo.favorite && <AppIcon name="heart" color={palette.accent} size={16} />}
      <Text style={typography.body}>{memo.title}</Text>
      <Text style={styles.body}>{memo.body}</Text>
      <Text style={styles.date}>{memo.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  card: {
    minHeight: 180,
    gap: 10,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  favorite: {
    minHeight: 216,
    backgroundColor: palette.soft,
    boxShadow: 'none',
  },
  body: {
    ...typography.caption,
    color: palette.muted,
    lineHeight: 19,
  },
  date: {
    ...typography.micro,
    color: palette.muted,
    marginTop: 4,
  },
});
