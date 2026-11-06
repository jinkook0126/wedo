import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddPostSheet, type NewPost } from '@/components/story/AddPostSheet';
import { StoryHighlights } from '@/components/story/StoryHighlights';
import { StoryPostCard } from '@/components/story/StoryPostCard';
import { AppIcon } from '@/components/ui/AppIcon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { COVER_PHOTO_URI } from '@/constants/sample-data';
import { CURRENT_USER, highlights, initialPosts, type StoryPost } from '@/constants/story-data';
import { palette, radius, shadow, spacing, typography } from '@/constants/theme';

export default function StoryScreen() {
  const [posts, setPosts] = useState<StoryPost[]>(initialPosts);
  const [sheetOpen, setSheetOpen] = useState(false);

  const addPost = ({ photos, place, caption }: NewPost) => {
    setPosts((prev) => [
      {
        id: `p${Date.now()}`,
        author: CURRENT_USER,
        avatar: COVER_PHOTO_URI,
        place,
        when: '방금 전',
        photos,
        caption,
        comments: [],
      },
      ...prev,
    ]);
    setSheetOpen(false);
  };

  const addComment = (postId: string, text: string) =>
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { id: `c${Date.now()}`, author: CURRENT_USER, text }],
            }
          : post,
      ),
    );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <ScreenHeader
          eyebrow="우리의 순간을 차곡차곡"
          title="스토리"
          right={
            <Pressable
              onPress={() => setSheetOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="새 글 작성"
              style={({ pressed }) => [styles.cameraButton, pressed && { opacity: 0.6 }]}>
              <AppIcon name="camera" color={palette.accent} size={20} />
            </Pressable>
          }
        />
        <StoryHighlights highlights={highlights} />
        {posts.map((post) => (
          <StoryPostCard key={post.id} post={post} onComment={addComment} />
        ))}
        <Text style={styles.footer}>오늘도 우리의 이야기는 계속돼요.</Text>
      </ScrollView>
      <AddPostSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onSave={addPost} />
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
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
