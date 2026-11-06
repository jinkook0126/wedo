import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import {
  ChoiceChips,
  FormSheet,
  SheetField,
  SheetInput,
  SheetLayout,
} from '@/components/ui/FormSheet';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { BUCKET_TAGS, MEMBERS } from '@/constants/memo-data';
import { palette, radius, typography } from '@/constants/theme';

type SheetProps<T> = {
  visible: boolean;
  onClose: () => void;
  onSave: (value: T) => void;
};

type FormProps<T> = Omit<SheetProps<T>, 'visible'>;

export type NewBucketItem = { title: string; tag: string; note: string };

export function AddBucketSheet({ visible, onClose, onSave }: SheetProps<NewBucketItem>) {
  return (
    <FormSheet visible={visible} onClose={onClose}>
      <BucketForm onClose={onClose} onSave={onSave} />
    </FormSheet>
  );
}

function BucketForm({ onClose, onSave }: FormProps<NewBucketItem>) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<string>(BUCKET_TAGS[0]);
  const [note, setNote] = useState('');
  const canSave = title.trim().length > 0;

  return (
    <SheetLayout
      title="버킷리스트 추가"
      onClose={onClose}
      canSave={canSave}
      onSave={() => onSave({ title: title.trim(), tag, note: note.trim() })}>
      <SheetField label="함께 이루고 싶은 일">
        <SheetInput
          value={title}
          onChangeText={setTitle}
          placeholder="예: 제주에서 한 달 살아보기"
          maxLength={40}
          returnKeyType="done"
        />
      </SheetField>
      <SheetField label="카테고리">
        <ChoiceChips options={BUCKET_TAGS} value={tag} onChange={setTag} />
      </SheetField>
      <SheetField label="진행 메모">
        <SheetInput
          value={note}
          onChangeText={setNote}
          placeholder="예: 여행 경비 40% 모았어요"
          maxLength={40}
          returnKeyType="done"
        />
      </SheetField>
    </SheetLayout>
  );
}

export type NewMemo = { title: string; body: string; favorite: boolean };

export function AddMemoSheet({ visible, onClose, onSave }: SheetProps<NewMemo>) {
  return (
    <FormSheet visible={visible} onClose={onClose}>
      <MemoForm onClose={onClose} onSave={onSave} />
    </FormSheet>
  );
}

function MemoForm({ onClose, onSave }: FormProps<NewMemo>) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [favorite, setFavorite] = useState(false);
  const canSave = title.trim().length > 0;

  return (
    <SheetLayout
      title="메모 추가"
      onClose={onClose}
      canSave={canSave}
      onSave={() => onSave({ title: title.trim(), body: body.trim(), favorite })}>
      <SheetField label="제목">
        <SheetInput
          value={title}
          onChangeText={setTitle}
          placeholder="예: 다음 데이트는 여기"
          maxLength={30}
          returnKeyType="done"
        />
      </SheetField>
      <SheetField label="내용">
        <SheetInput
          value={body}
          onChangeText={setBody}
          placeholder="잊고 싶지 않은 이야기를 적어주세요"
          maxLength={300}
          multiline
        />
      </SheetField>
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={typography.body}>즐겨찾기</Text>
          <Text style={styles.switchHint}>하트와 함께 강조해서 보여줘요</Text>
        </View>
        <Switch
          value={favorite}
          onValueChange={setFavorite}
          trackColor={{ false: palette.line, true: palette.accent }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={palette.line}
          accessibilityLabel="즐겨찾기"
        />
      </View>
    </SheetLayout>
  );
}

export type NewTodo = { title: string; shared: boolean; assignee: string };

const TODO_KINDS = [
  { value: 'shared', label: '함께할 일' },
  { value: 'each', label: '서로할 일' },
] as const;

export function AddTodoSheet({ visible, onClose, onSave }: SheetProps<NewTodo>) {
  return (
    <FormSheet visible={visible} onClose={onClose}>
      <TodoForm onClose={onClose} onSave={onSave} />
    </FormSheet>
  );
}

function TodoForm({ onClose, onSave }: FormProps<NewTodo>) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<(typeof TODO_KINDS)[number]['value']>('shared');
  const [assignee, setAssignee] = useState<string>(MEMBERS[0]);
  const shared = kind === 'shared';
  const canSave = title.trim().length > 0;

  return (
    <SheetLayout
      title="할 일 추가"
      onClose={onClose}
      canSave={canSave}
      onSave={() => onSave({ title: title.trim(), shared, assignee: shared ? '함께' : assignee })}>
      <SheetField label="할 일">
        <SheetInput
          value={title}
          onChangeText={setTitle}
          placeholder="예: 주말 장보기"
          maxLength={40}
          returnKeyType="done"
        />
      </SheetField>
      <SheetField label="구분">
        <SegmentedTabs options={TODO_KINDS} value={kind} onChange={setKind} />
      </SheetField>
      {!shared && (
        <SheetField label="담당자">
          <ChoiceChips options={MEMBERS} value={assignee} onChange={setAssignee} />
        </SheetField>
      )}
    </SheetLayout>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: palette.bg,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  switchHint: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
  },
});
