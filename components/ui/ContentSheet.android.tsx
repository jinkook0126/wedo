import { Column, Host, ModalBottomSheet, type ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import type { ContentSheetProps } from './ContentSheet';

/**
 * The universal BottomSheet either allows Material's half-height partial state or fills the
 * screen, so Android uses ModalBottomSheet directly: no partial state, intrinsic content height.
 */
export function ContentSheet({ isPresented, onDismiss, containerColor, contentPadding, children }: ContentSheetProps) {
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const [mounted, setMounted] = useState(isPresented);
  if (isPresented && !mounted) setMounted(true);

  useEffect(() => {
    if (isPresented || !mounted) return;
    let cancelled = false;
    Promise.resolve(sheetRef.current?.hide()).then(() => {
      if (!cancelled) setMounted(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isPresented, mounted]);

  if (!mounted) return null;

  const { top = 0, bottom = 0, left = 16, right = 16 } = contentPadding ?? {};

  return (
    <Host style={StyleSheet.absoluteFill} pointerEvents="none">
      <ModalBottomSheet
        ref={sheetRef}
        onDismissRequest={onDismiss}
        skipPartiallyExpanded
        containerColor={containerColor}>
        <Column modifiers={[padding(left, top, right, bottom)]}>{children}</Column>
      </ModalBottomSheet>
    </Host>
  );
}
