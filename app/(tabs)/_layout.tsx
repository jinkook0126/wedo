import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { palette } from '@/constants/theme';

const TABS: { name: string; label: string; icon: AppIconName }[] = [
  { name: 'index', label: '홈', icon: 'home' },
  { name: 'calendar', label: '캘린더', icon: 'calendar' },
  { name: 'memo', label: '메모', icon: 'photo' },
  { name: 'story', label: '스토리', icon: 'heart' },
  { name: 'mypage', label: '마이페이지', icon: 'person' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.line,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        sceneStyle: { backgroundColor: palette.bg },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarAccessibilityLabel: tab.label,
            tabBarIcon: ({ color }) => <AppIcon name={tab.icon} color={color} size={23} />,
          }}
        />
      ))}
    </Tabs>
  );
}
