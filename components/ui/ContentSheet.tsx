import { BottomSheet } from '@expo/ui';
import type { ReactNode } from 'react';
import { Platform, type ColorValue } from 'react-native';

export type ContentSheetProps = {
  isPresented: boolean;
  onDismiss: () => void;
  containerColor?: ColorValue;
  contentPadding?: { top?: number; bottom?: number; left?: number; right?: number };
  children: ReactNode;
};

/**
 * Material's drag handle sits above the content: 22dp padding, a 4dp bar, 22dp padding.
 * iOS draws its grabber over the content, so the same `contentPadding.top` leaves the
 * title flush with the sheet edge. Add the handle height on iOS only.
 */
const IOS_DRAG_HANDLE_HEIGHT = 48;

/** Bottom sheet that rises only as tall as its content. */
export function ContentSheet({ isPresented, onDismiss, containerColor, contentPadding, children }: ContentSheetProps) {
  const padding =
    Platform.OS === 'ios' && contentPadding
      ? { ...contentPadding, top: (contentPadding.top ?? 0) + IOS_DRAG_HANDLE_HEIGHT }
      : contentPadding;

  return (
    <BottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      containerColor={containerColor}
      contentPadding={padding}>
      {children}
    </BottomSheet>
  );
}
