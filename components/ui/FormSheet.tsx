import { RNHostView } from '@expo/ui';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { ContentSheet } from '@/components/ui/ContentSheet';
import { palette, radius, typography } from '@/constants/theme';

type FormSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

/** Content-height bottom sheet whose children remount (and reset their state) on every open. */
export function FormSheet({ visible, onClose, children }: FormSheetProps) {
  const [session, setSession] = useState(0);
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setSession((s) => s + 1);
  }

  return (
    <ContentSheet
      isPresented={visible}
      onDismiss={onClose}
      containerColor={palette.surface}
      contentPadding={{ top: 8, left: 24, right: 24, bottom: 16 }}>
      <RNHostView matchContents={{ horizontal: false, vertical: true }}>
        <View key={session}>{children}</View>
      </RNHostView>
    </ContentSheet>
  );
}

type SheetLayoutProps = {
  title: string;
  onClose: () => void;
  canSave: boolean;
  onSave: () => void;
  children: ReactNode;
};

export function SheetLayout({ title, onClose, canSave, onSave, children }: SheetLayoutProps) {
  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <Text style={typography.heading}>{title}</Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="닫기"
          hitSlop={8}
          style={styles.closeButton}>
          <AppIcon name="close" color={palette.muted} size={14} />
        </Pressable>
      </View>

      <View style={styles.form}>{children}</View>

      <Pressable
        onPress={onSave}
        disabled={!canSave}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSave }}
        style={({ pressed }) => [
          styles.saveButton,
          !canSave && styles.saveButtonDisabled,
          pressed && { opacity: 0.8 },
        ]}>
        <Text style={styles.saveLabel}>저장하기</Text>
      </Pressable>
    </View>
  );
}

export function SheetField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function SheetInput({ multiline, style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={palette.muted}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[styles.input, multiline && styles.multiline, style]}
      {...props}
    />
  );
}

type ChoiceChipsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function ChoiceChips<T extends string>({ options, value, onChange }: ChoiceChipsProps<T>) {
  return (
    <View style={styles.chips} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.chip, selected && styles.chipSelected]}>
            <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.muted,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: palette.bg,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    letterSpacing: typography.body.letterSpacing,
    color: palette.ink,
  },
  multiline: {
    minHeight: 88,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: palette.bg,
    backgroundColor: palette.bg,
  },
  chipSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.soft,
  },
  chipLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: palette.muted,
  },
  chipLabelSelected: {
    color: palette.accent,
  },
  saveButton: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: palette.line,
  },
  saveLabel: {
    ...typography.body,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
