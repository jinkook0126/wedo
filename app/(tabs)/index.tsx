import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoverPhoto } from '@/components/home/CoverPhoto';
import { DDayCard } from '@/components/home/DDayCard';
import { TodoChecklist } from '@/components/home/TodoChecklist';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { COVER_PHOTO_URI, couple, initialTodos } from '@/constants/sample-data';
import { palette, spacing } from '@/constants/theme';
import { formatKoreanDate } from '@/lib/date';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow={formatKoreanDate(new Date())} title="우리의 소소한 일상" />
        <CoverPhoto uri={COVER_PHOTO_URI} tagline={couple.tagline} title={couple.names} />
        <DDayCard startDate={couple.startDate} anniversary={couple.anniversary} />
        <TodoChecklist initialItems={initialTodos} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
    gap: spacing.section,
  },
});
