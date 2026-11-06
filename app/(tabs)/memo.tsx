import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BucketList } from '@/components/memo/BucketList';
import { MemoGrid } from '@/components/memo/MemoGrid';
import {
  AddBucketSheet,
  AddMemoSheet,
  AddTodoSheet,
  type NewBucketItem,
  type NewMemo,
  type NewTodo,
} from '@/components/memo/MemoSheets';
import { SharedTodos } from '@/components/memo/SharedTodos';
import { FAB_SIZE, FloatingAddButton } from '@/components/ui/FloatingAddButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import {
  initialBucketItems,
  initialSharedTodos,
  memos as initialMemos,
  type BucketItem,
  type Memo,
  type SharedTodo,
} from '@/constants/memo-data';
import { palette, spacing } from '@/constants/theme';

const TABS = [
  { value: 'bucket', label: '버킷리스트' },
  { value: 'memo', label: '메모' },
  { value: 'todo', label: '할 일' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

const ADD_LABELS: Record<TabValue, string> = {
  bucket: '버킷리스트 추가',
  memo: '메모 추가',
  todo: '할 일 추가',
};

function toggleDone<T extends { id: string; done: boolean }>(items: T[], id: string) {
  return items.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
}

export default function MemoScreen() {
  const [tab, setTab] = useState<TabValue>('bucket');
  const [openSheet, setOpenSheet] = useState<TabValue | null>(null);
  const [bucketItems, setBucketItems] = useState<BucketItem[]>(initialBucketItems);
  const [memos, setMemos] = useState<Memo[]>(initialMemos);
  const [todos, setTodos] = useState<SharedTodo[]>(initialSharedTodos);

  const closeSheet = () => setOpenSheet(null);

  const addBucketItem = (item: NewBucketItem) => {
    setBucketItems((prev) => [{ id: `b${Date.now()}`, ...item, done: false }, ...prev]);
    closeSheet();
  };

  const addMemo = ({ title, body, favorite }: NewMemo) => {
    setMemos((prev) => [
      { id: `m${Date.now()}`, title, body, date: '방금 전', favorite },
      ...prev,
    ]);
    closeSheet();
  };

  const addTodo = (todo: NewTodo) => {
    setTodos((prev) => [...prev, { id: `t${Date.now()}`, ...todo, done: false }]);
    closeSheet();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="둘이 함께 채우는 기록" title="메모" />
        <SegmentedTabs options={TABS} value={tab} onChange={setTab} />
        {tab === 'bucket' && (
          <BucketList
            items={bucketItems}
            onToggle={(id) => setBucketItems((prev) => toggleDone(prev, id))}
          />
        )}
        {tab === 'memo' && <MemoGrid memos={memos} />}
        {tab === 'todo' && (
          <SharedTodos items={todos} onToggle={(id) => setTodos((prev) => toggleDone(prev, id))} />
        )}
      </ScrollView>

      <FloatingAddButton onPress={() => setOpenSheet(tab)} accessibilityLabel={ADD_LABELS[tab]} />

      <AddBucketSheet visible={openSheet === 'bucket'} onClose={closeSheet} onSave={addBucketItem} />
      <AddMemoSheet visible={openSheet === 'memo'} onClose={closeSheet} onSave={addMemo} />
      <AddTodoSheet visible={openSheet === 'todo'} onClose={closeSheet} onSave={addTodo} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: spacing.screen,
    paddingBottom: FAB_SIZE + spacing.screen * 2,
    gap: spacing.section,
  },
});
