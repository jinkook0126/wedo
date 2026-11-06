import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TabIntro } from '@/components/memo/TabIntro';
import { Checkbox } from '@/components/ui/Checkbox';
import type { SharedTodo } from '@/constants/memo-data';
import { palette, radius, shadow, typography } from '@/constants/theme';
import { formatKoreanDate } from '@/lib/date';

type Props = {
  items: SharedTodo[];
  onToggle: (id: string) => void;
};

export function SharedTodos({ items, onToggle }: Props) {
  const doneCount = items.filter((item) => item.done).length;

  const groups = [
    { title: '함께할 일', items: items.filter((item) => item.shared) },
    { title: '서로할 일', items: items.filter((item) => !item.shared) },
  ];

  return (
    <View style={styles.container}>
      <TabIntro
        title="오늘도 함께, 하나씩"
        subtitle={`${formatKoreanDate(new Date())} · ${items.length}개 중 ${doneCount}개 완료`}
      />

      {groups.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.card}>
            {group.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onToggle(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.done }}
                accessibilityLabel={item.title}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                <Checkbox checked={item.done} />
                <View style={styles.details}>
                  <Text style={[typography.body, item.done && styles.doneTitle]}>{item.title}</Text>
                  <Text style={styles.assignee}>{item.done ? '완료' : item.assignee}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  group: {
    gap: 12,
  },
  groupTitle: {
    ...typography.body,
    fontWeight: '800',
  },
  card: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  details: {
    flex: 1,
    gap: 5,
  },
  doneTitle: {
    color: palette.muted,
    textDecorationLine: 'line-through',
  },
  assignee: {
    ...typography.micro,
    color: palette.accent,
  },
});
