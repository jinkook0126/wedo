import { ScrollView, StyleSheet, View } from 'react-native';

import { CoupleSummary } from '@/components/home/CoupleSummary';
import { CoverPhoto } from '@/components/home/CoverPhoto';
import { TodoChecklist } from '@/components/home/TodoChecklist';
import { UpcomingDays } from '@/components/home/UpcomingDays';
import { useDays } from '@/components/home/DaysProvider';
import { COVER_PHOTO_URI, couple, initialTodos } from '@/constants/sample-data';
import { palette, spacing } from '@/constants/theme';

const SHEET_RADIUS = 28;

export default function HomeScreen() {
  const { days } = useDays();

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}>
        <CoverPhoto uri={COVER_PHOTO_URI} />
        <View style={styles.sheet}>
          <CoupleSummary names={couple.names} startDate={couple.startDate} />
          <UpcomingDays days={days} />
          <TodoChecklist initialItems={initialTodos} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    flexGrow: 1,
  },
  sheet: {
    flexGrow: 1,
    marginTop: -SHEET_RADIUS,
    paddingTop: 22,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.screen,
    gap: spacing.section,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    backgroundColor: palette.bg,
  },
});
