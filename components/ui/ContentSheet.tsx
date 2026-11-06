import { BottomSheet } from '@expo/ui';
import type { ReactNode } from 'react';
import type { ColorValue } from 'react-native';

export type ContentSheetProps = {
  isPresented: boolean;
  onDismiss: () => void;
  containerColor?: ColorValue;
  contentPadding?: { top?: number; bottom?: number; left?: number; right?: number };
  children: ReactNode;
};

/** Bottom sheet that rises only as tall as its content. */
export function ContentSheet({ isPresented, onDismiss, containerColor, contentPadding, children }: ContentSheetProps) {
  return (
    <BottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      containerColor={containerColor}
      contentPadding={contentPadding}>
      {children}
    </BottomSheet>
  );
}
