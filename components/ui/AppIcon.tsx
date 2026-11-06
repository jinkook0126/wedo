import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

const ICONS = {
  home: { ios: 'house', android: 'home', web: 'home' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  photo: { ios: 'photo', android: 'image', web: 'image' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
  heartFill: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  camera: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  more: { ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' },
  comment: { ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' },
  send: { ios: 'paperplane', android: 'send', web: 'send' },
  bookmark: { ios: 'bookmark', android: 'bookmark', web: 'bookmark' },
  bookmarkFill: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
  person: { ios: 'person', android: 'person', web: 'person' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  chevronLeft: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
} satisfies Record<string, SymbolViewProps['name']>;

export type AppIconName = keyof typeof ICONS;

type Props = {
  name: AppIconName;
  color: ColorValue;
  size?: number;
};

export function AppIcon({ name, color, size = 22 }: Props) {
  return <SymbolView name={ICONS[name]} tintColor={color} size={size} />;
}
