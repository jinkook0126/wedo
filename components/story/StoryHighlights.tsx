import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { StoryHighlight } from '@/constants/story-data';
import { palette, radius, spacing, typography } from '@/constants/theme';

type Props = {
  highlights: StoryHighlight[];
};

export function StoryHighlights({ highlights }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
      contentContainerStyle={styles.row}>
      {highlights.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}>
          <View style={styles.ring}>
            <Image source={{ uri: item.photo }} style={styles.photo} />
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const RING = 66;

const styles = StyleSheet.create({
  scroller: {
    marginHorizontal: -spacing.screen,
    flexGrow: 0,
  },
  row: {
    paddingHorizontal: spacing.screen,
    gap: 14,
  },
  item: {
    width: RING + 6,
    alignItems: 'center',
    gap: 8,
  },
  ring: {
    width: RING,
    height: RING,
    padding: 3,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: palette.accent,
  },
  photo: {
    flex: 1,
    borderRadius: radius.pill,
    backgroundColor: palette.line,
  },
  label: {
    ...typography.micro,
    color: palette.ink,
  },
});
