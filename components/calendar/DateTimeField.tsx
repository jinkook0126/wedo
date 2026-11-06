import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, typography } from '@/constants/theme';
import { formatKoreanTime, formatShortDate } from '@/lib/date';

type Props = {
  mode: 'date' | 'time';
  value: Date;
  onChange: (date: Date) => void;
  accessibilityLabel: string;
  invalid?: boolean;
};

export function DateTimeField({ mode, value, onChange, accessibilityLabel, invalid }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="compact"
        locale="ko_KR"
        accentColor={invalid ? palette.accent : palette.ink}
        onValueChange={(_, date) => onChange(date)}
      />
    );
  }

  const label =
    mode === 'date'
      ? formatShortDate(value)
      : formatKoreanTime(`${value.getHours()}:${value.getMinutes()}`);

  return (
    <View>
      <Pressable
        onPress={() => setDialogOpen(true)}
        disabled={Platform.OS === 'web'}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}, ${label}`}
        style={({ pressed }) => [styles.chip, pressed && { opacity: 0.6 }]}>
        <Text style={[styles.chipLabel, invalid && styles.invalid]}>{label}</Text>
      </Pressable>
      {dialogOpen && (
        <DateTimePicker
          value={value}
          mode={mode}
          accentColor={palette.accent}
          positiveButton={{ label: '확인' }}
          negativeButton={{ label: '취소' }}
          style={styles.dialogHost}
          onValueChange={(_, date) => {
            setDialogOpen(false);
            onChange(date);
          }}
          onDismiss={() => setDialogOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: palette.surface,
  },
  chipLabel: {
    ...typography.body,
    color: palette.ink,
  },
  invalid: {
    color: palette.accent,
    textDecorationLine: 'line-through',
  },
  dialogHost: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
