import { Stack } from 'expo-router';

import { DaysProvider } from '@/components/home/DaysProvider';
import { palette } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HomeStack() {
  return (
    <DaysProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg },
        }}
      />
    </DaysProvider>
  );
}
