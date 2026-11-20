import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { useDays } from '@/components/home/DaysProvider';
import { AppIcon } from '@/components/ui/AppIcon';
import { FormSheet } from '@/components/ui/FormSheet';
import type { UpcomingDay } from '@/constants/sample-data';
import { palette, radius, toneColors, type Tone } from '@/constants/theme';
import { daysBetween, formatFullDate } from '@/lib/date';

const THEMES: Tone[] = ['accent', 'green', 'blue'];

type Props = {
  day: UpcomingDay | null;
  onClose: () => void;
};

export function DdayEditSheet({ day, onClose }: Props) {
  return (
    <FormSheet visible={day != null} onClose={onClose}>
      {day && <DdayForm key={day.id} day={day} onClose={onClose} />}
    </FormSheet>
  );
}

function DdayForm({ day, onClose }: { day: UpcomingDay; onClose: () => void }) {
  const { days, removeDay, updateDay } = useDays();
  const [title, setTitle] = useState(day.title);
  const [date, setDate] = useState(day.date);
  const [tone, setTone] = useState<Tone>(day.tone);
  const [pinned, setPinned] = useState(!!day.pinned);
  const canSave = title.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const patch: Partial<UpcomingDay> = {
      title: title.trim(),
      date,
      tone,
      pinned,
    };
    const other = days.find((item) => item.pinned && item.id !== day.id);
    if (pinned && other) {
      Alert.alert(
        '고정을 바꿀까요?',
        `지금은 "${other.title}"이 고정되어 있어요.\n바꿀 날: ${patch.title}`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '바꾸기',
            onPress: () => {
              updateDay(day.id, patch);
              onClose();
            },
          },
        ],
      );
      return;
    }
    updateDay(day.id, patch);
    onClose();
  };

  const release = () => {
    Alert.alert('디데이를 해제할까요?', day.title, [
      { text: '취소', style: 'cancel' },
      {
        text: '해제',
        style: 'destructive',
        onPress: () => {
          removeDay(day.id);
          onClose();
        },
      },
    ]);
  };

  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="취소"
          hitSlop={8}
          style={styles.headerSide}>
          <Text style={styles.cancel}>취소</Text>
        </Pressable>
        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave }}
          hitSlop={8}
          style={[styles.headerSide, styles.headerSideEnd]}>
          <Text style={[styles.save, !canSave && styles.saveDisabled]}>저장</Text>
        </Pressable>
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="디데이 이름"
        placeholderTextColor={palette.muted}
        maxLength={40}
        returnKeyType="done"
        style={styles.titleInput}
      />

      <DateField value={date} tone={tone} onChange={setDate} />

      <View style={styles.row}>
        <Text style={styles.rowLabel}>테마</Text>
        <View style={styles.themes} accessibilityRole="radiogroup">
          {THEMES.map((option) => {
            const selected = option === tone;
            return (
              <Pressable
                key={option}
                onPress={() => setTone(option)}
                accessibilityRole="radio"
                accessibilityLabel={`${option === 'accent' ? '코랄' : option === 'green' ? '초록' : '파랑'} 테마`}
                accessibilityState={{ selected }}
                style={[styles.swatch, { backgroundColor: toneColors[option].fg }]}>
                {selected && <AppIcon name="check" color="#FFFFFF" size={14} />}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>홈에 고정</Text>
          <Text style={styles.rowHint}>홈 큰 카드에 항상 보여요</Text>
        </View>
        <Switch
          value={pinned}
          onValueChange={setPinned}
          trackColor={{ false: palette.line, true: palette.accent }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={palette.line}
          accessibilityLabel="홈에 고정"
        />
      </View>

      <Pressable
        onPress={release}
        accessibilityRole="button"
        accessibilityLabel="디데이 해제"
        style={styles.release}>
        <Text style={styles.releaseLabel}>디데이 해제</Text>
      </Pressable>
    </View>
  );
}

function DateField({ value, tone, onChange }: { value: Date; tone: Tone; onChange: (date: Date) => void }) {
  const [open, setOpen] = useState(false);
  const { fg, bg } = toneColors[tone];
  const countdown = formatCountdown(daysBetween(new Date(), value));

  return (
    <View>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        disabled={Platform.OS === 'web'}
        accessibilityRole="button"
        accessibilityLabel={`날짜, ${formatFullDate(value)}, ${countdown}`}
        style={styles.dateRow}>
        <Text style={styles.dateText}>{formatFullDate(value)}</Text>
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeText, { color: fg }]}>{countdown}</Text>
        </View>
      </Pressable>
      {open && Platform.OS === 'ios' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          locale="ko_KR"
          accentColor={palette.accent}
          onValueChange={(_, next) => onChange(next)}
        />
      )}
      {open && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode="date"
          accentColor={palette.accent}
          positiveButton={{ label: '확인' }}
          negativeButton={{ label: '취소' }}
          onValueChange={(_, next) => {
            setOpen(false);
            onChange(next);
          }}
          onDismiss={() => setOpen(false)}
        />
      )}
    </View>
  );
}

function formatCountdown(daysLeft: number) {
  if (daysLeft === 0) return 'D-Day';
  const count = Math.abs(daysLeft).toLocaleString('ko-KR');
  return daysLeft > 0 ? `D-${count}` : `D+${count}`;
}

const styles = StyleSheet.create({
  sheet: {
    gap: 14,
  },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    minWidth: 48,
    paddingVertical: 6,
  },
  headerSideEnd: {
    alignItems: 'flex-end',
  },
  cancel: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: palette.muted,
  },
  save: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: palette.accent,
  },
  saveDisabled: {
    color: palette.muted,
  },
  titleInput: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: palette.bg,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: palette.ink,
  },
  dateRow: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: palette.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  rowHint: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: palette.muted,
  },
  themes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  release: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  releaseLabel: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: palette.accent,
  },
});
