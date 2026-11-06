import { useState, type ReactNode } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { DateTimeField } from '@/components/calendar/DateTimeField';
import { FormSheet, SheetField, SheetInput, SheetLayout } from '@/components/ui/FormSheet';
import { palette, radius, typography } from '@/constants/theme';
import { daysBetween } from '@/lib/date';

export type NewEvent = {
  title: string;
  memo?: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

const HOUR_MS = 60 * 60 * 1000;

function withDate(base: Date, date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), base.getHours(), base.getMinutes());
}

function withTime(base: Date, time: Date) {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), time.getHours(), time.getMinutes());
}

type Props = {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSave: (event: NewEvent) => void;
};

export function AddEventSheet({ visible, initialDate, onClose, onSave }: Props) {
  return (
    <FormSheet visible={visible} onClose={onClose}>
      <SheetForm initialDate={initialDate} onClose={onClose} onSave={onSave} />
    </FormSheet>
  );
}

type SheetFormProps = Omit<Props, 'visible'>;

function SheetForm({ initialDate, onClose, onSave }: SheetFormProps) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [range, setRange] = useState(() => {
    const nextHour = (new Date().getHours() + 1) % 24;
    const start = new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      initialDate.getDate(),
      nextHour,
    );
    return { start, end: new Date(start.getTime() + HOUR_MS) };
  });
  const { start, end } = range;
  const endBeforeStart = allDay ? daysBetween(start, end) < 0 : end < start;
  const canSave = title.trim().length > 0 && !endBeforeStart;

  const updateStart = (next: Date) =>
    setRange((prev) => ({
      start: next,
      end: new Date(next.getTime() + (prev.end.getTime() - prev.start.getTime())),
    }));
  const updateEnd = (next: Date) => setRange((prev) => ({ ...prev, end: next }));

  const save = () => {
    if (!canSave) return;
    onSave({ title: title.trim(), memo: memo.trim() || undefined, start, end, allDay });
  };

  return (
    <SheetLayout title="일정 추가" onClose={onClose} canSave={canSave} onSave={save}>
      <SheetField label="일정 이름">
        <SheetInput
          value={title}
          onChangeText={setTitle}
          placeholder="어떤 일정인가요?"
          maxLength={40}
          returnKeyType="done"
        />
      </SheetField>

      <SheetField label="메모">
        <SheetInput
          value={memo}
          onChangeText={setMemo}
          placeholder="함께 기억할 내용을 적어주세요"
          maxLength={200}
          multiline
        />
      </SheetField>

      <SheetField label="날짜와 시간">
        <View style={styles.group}>
          <Row label="하루 종일">
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              trackColor={{ false: palette.line, true: palette.accent }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={palette.line}
              accessibilityLabel="하루 종일"
            />
          </Row>
          <Row label="시작" divider>
            <View style={styles.pickers}>
              <DateTimeField
                mode="date"
                value={start}
                onChange={(d) => updateStart(withDate(start, d))}
                accessibilityLabel="시작 날짜"
              />
              {!allDay && (
                <DateTimeField
                  mode="time"
                  value={start}
                  onChange={(t) => updateStart(withTime(start, t))}
                  accessibilityLabel="시작 시간"
                />
              )}
            </View>
          </Row>
          <Row label="종료" divider>
            <View style={styles.pickers}>
              <DateTimeField
                mode="date"
                value={end}
                onChange={(d) => updateEnd(withDate(end, d))}
                accessibilityLabel="종료 날짜"
                invalid={endBeforeStart}
              />
              {!allDay && (
                <DateTimeField
                  mode="time"
                  value={end}
                  onChange={(t) => updateEnd(withTime(end, t))}
                  accessibilityLabel="종료 시간"
                  invalid={endBeforeStart}
                />
              )}
            </View>
          </Row>
        </View>
        {endBeforeStart && (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            종료가 시작보다 빠를 수 없어요
          </Text>
        )}
      </SheetField>
    </SheetLayout>
  );
}

function Row({ label, divider, children }: { label: string; divider?: boolean; children: ReactNode }) {
  return (
    <View style={[styles.row, divider && styles.rowDivider]}>
      <Text style={typography.body}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: palette.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 52,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  pickers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  error: {
    ...typography.caption,
    color: palette.accent,
  },
});
