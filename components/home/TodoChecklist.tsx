import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { Pill } from '@/components/ui/Pill';
import type { TodoItem } from '@/constants/sample-data';
import { palette, radius, shadow, typography } from '@/constants/theme';

type Props = {
  initialItems: TodoItem[];
};

export function TodoChecklist({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const doneCount = items.filter((item) => item.done).length;

  const toggle = (id: string) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={typography.heading}>함께하는 작은 일들</Text>
        <Pill label={`${items.length}개 중 ${doneCount}개 완료`} tone="green" />
      </View>

      <View style={styles.card}>
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => toggle(item.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.done }}
            accessibilityLabel={item.title}
            style={({ pressed }) => [
              styles.row,
              index > 0 && styles.divider,
              pressed && styles.pressed,
            ]}>
            <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
              {item.done && <AppIcon name="check" color="#FFFFFF" size={14} />}
            </View>
            <View style={styles.details}>
              <Text style={[typography.body, item.done && styles.doneText]}>{item.title}</Text>
              <Text
                style={[
                  styles.assignee,
                  { color: item.assignee === '함께' ? palette.accent : palette.muted },
                ]}>
                {item.assignee}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
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
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: palette.green,
    borderColor: palette.green,
  },
  details: {
    flex: 1,
    gap: 5,
  },
  doneText: {
    color: palette.muted,
  },
  assignee: {
    ...typography.micro,
  },
});
