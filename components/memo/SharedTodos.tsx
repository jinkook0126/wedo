import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyList } from '@/components/memo/EmptyList';
import { AppIcon } from '@/components/ui/AppIcon';
import { Checkbox } from '@/components/ui/Checkbox';
import { MEMBERS, type SharedTodo } from '@/constants/memo-data';
import { palette, radius, shadow, toneColors } from '@/constants/theme';

const FILTERS = ['전체', '함께', ...MEMBERS] as const;

const assigneeColors: Record<string, { fg: string; bg: string }> = {
  지현: toneColors.green,
  진국: toneColors.blue,
};

type Props = {
  items: SharedTodo[];
  onToggle: (id: string) => void;
};

export function SharedTodos({ items, onToggle }: Props) {
  const openItems = items.filter((item) => !item.done);
  const doneItems = items.filter((item) => item.done);

  if (items.length === 0) {
    return (
      <EmptyList
        title="함께 챙길 일이 아직 없어요"
        subtitle="함께 챙길 일이 생기면 여기에 모아 둘게요"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {FILTERS.map((filter) => {
          const selected = filter === '전체';
          return (
            <View key={filter} style={[styles.chip, selected && styles.chipSelected]}>
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{filter}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        {openItems.map((item, index) => (
          <TodoRow key={item.id} item={item} divider={index > 0} onToggle={onToggle} />
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

function TodoRow({
  item,
  divider,
  onToggle,
}: {
  item: SharedTodo;
  divider: boolean;
  onToggle: (id: string) => void;
}) {
  const together = item.assignee === '함께';
  const person = assigneeColors[item.assignee] ?? toneColors.blue;

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.done }}
      accessibilityLabel={`${item.title}, ${item.assignee}`}
      style={({ pressed }) => [styles.row, divider && styles.divider, pressed && styles.pressed]}>
      <Checkbox checked={false} round />
      <Text style={styles.title}>{item.title}</Text>
      <View style={[styles.pill, { backgroundColor: together ? palette.soft : person.bg }]}>
        <Text style={[styles.pillLabel, { color: together ? palette.accent : person.fg }]}>
          {item.assignee}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  chipSelected: {
    backgroundColor: palette.ink,
    boxShadow: 'none',
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  chipLabelSelected: {
    color: '#FFFFFF',
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
    alignItems: 'center',
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
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: -0.1,
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
