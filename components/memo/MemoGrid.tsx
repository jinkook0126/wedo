import { StyleSheet, Text, View } from 'react-native';

import { EmptyList } from '@/components/memo/EmptyList';
import { AppIcon } from '@/components/ui/AppIcon';
import type { Memo } from '@/constants/memo-data';
import { palette, radius, shadow } from '@/constants/theme';

type Props = {
  memos: Memo[];
};

export function MemoGrid({ memos }: Props) {
  if (memos.length === 0) {
    return (
      <EmptyList
        title="잊고 싶지 않은 이야기를 남겨요"
        subtitle="사소한 생각도, 둘만의 약속도 괜찮아요"
      />
    );
  }

  const rows: Memo[][] = [];
  for (let index = 0; index < memos.length; index += 2) {
    rows.push(memos.slice(index, index + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((memo) => (
            <MemoCard key={memo.id} memo={memo} />
          ))}
          {row.length === 1 && <View style={styles.spacer} />}
        </View>
      ))}
    </View>
  );
}

function MemoCard({ memo }: { memo: Memo }) {
  const meta = memo.author ? `${memo.author} · ${memo.date}` : memo.date;

  return (
    <View style={[styles.card, memo.favorite && styles.favorite]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{memo.title}</Text>
        {memo.favorite && <AppIcon name="pin" color={palette.accent} size={14} />}
      </View>
      <Text style={styles.body}>{memo.body}</Text>
      <Text style={styles.meta}>{meta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  spacer: {
    flex: 1,
  },
  card: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  favorite: {
    backgroundColor: palette.soft,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  body: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    letterSpacing: -0.15,
    color: palette.muted,
  },
  meta: {
    marginTop: 'auto',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: -0.1,
    color: palette.muted,
  },
});
