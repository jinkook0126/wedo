import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import type { StoryPost } from '@/constants/story-data';
import { palette, radius, shadow, typography } from '@/constants/theme';

type Props = {
  post: StoryPost;
  onComment: (postId: string, text: string) => void;
};

export function StoryPostCard({ post, onComment }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    onComment(post.id, text);
    setDraft('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={typography.body}>{post.author}</Text>
          <Text style={styles.meta}>{[post.place, post.when].filter(Boolean).join(' · ')}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="게시물 옵션" hitSlop={8}>
          <AppIcon name="more" color={palette.muted} size={18} />
        </Pressable>
      </View>

      <PhotoCarousel photos={post.photos} />

      <View style={styles.actions}>
        <ActionButton
          icon={liked ? 'heartFill' : 'heart'}
          color={liked ? palette.accent : palette.ink}
          label={liked ? '공감 취소' : '공감'}
          onPress={() => setLiked((v) => !v)}
        />
        <ActionButton icon="comment" color={palette.ink} label="댓글" />
        <ActionButton icon="send" color={palette.ink} label="공유" />
        <View style={styles.spacer} />
        <ActionButton
          icon={saved ? 'bookmarkFill' : 'bookmark'}
          color={saved ? palette.accent : palette.ink}
          label={saved ? '저장 취소' : '저장'}
          onPress={() => setSaved((v) => !v)}
        />
      </View>

      <Text style={styles.moment}>서로의 마음이 닿은 순간</Text>

      {post.caption.length > 0 && (
        <View style={styles.captionBlock}>
          <Text style={styles.caption} numberOfLines={expanded ? undefined : 2}>
            <Text style={styles.author}>{post.author} </Text>
            {post.caption}
          </Text>
          {!expanded && (
            <Pressable onPress={() => setExpanded(true)} accessibilityRole="button" hitSlop={6}>
              <Text style={styles.more}>더보기</Text>
            </Pressable>
          )}
        </View>
      )}

      {post.comments.map((comment) => (
        <Text key={comment.id} style={styles.comment}>
          <Text style={styles.commentAuthor}>{comment.author} </Text> {comment.text}
        </Text>
      ))}

      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={submitComment}
        placeholder="따뜻한 한마디 남기기"
        placeholderTextColor={palette.muted}
        returnKeyType="send"
        maxLength={100}
        style={styles.input}
      />
    </View>
  );
}

function PhotoCarousel({ photos }: { photos: string[] }) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={styles.carouselBlock}>
      <View style={styles.carousel} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}>
          {photos.map((uri, i) => (
            <Image
              key={`${uri}-${i}`}
              source={{ uri }}
              style={[styles.photo, { width }]}
              accessibilityLabel={`사진 ${i + 1}`}
            />
          ))}
        </ScrollView>
        {photos.length > 1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>
              {index + 1} / {photos.length}
            </Text>
          </View>
        )}
      </View>

      {photos.length > 1 && (
        <View style={styles.dots}>
          {photos.map((uri, i) => (
            <View key={`${uri}-${i}`} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

type ActionButtonProps = {
  icon: AppIconName;
  color: string;
  label: string;
  onPress?: () => void;
};

function ActionButton({ icon, color, label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => pressed && { opacity: 0.5 }}>
      <AppIcon name={icon} color={color} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: palette.line,
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  meta: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
  },
  carouselBlock: {
    gap: 10,
  },
  carousel: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.line,
  },
  photo: {
    aspectRatio: 1,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  badgeLabel: {
    ...typography.micro,
    color: palette.ink,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: palette.line,
  },
  dotActive: {
    width: 12,
    backgroundColor: palette.accent,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  spacer: {
    flex: 1,
  },
  moment: {
    ...typography.micro,
    color: palette.accent,
  },
  captionBlock: {
    gap: 4,
  },
  caption: {
    ...typography.body,
    fontWeight: '500',
    lineHeight: 21,
  },
  author: {
    fontWeight: '800',
  },
  more: {
    ...typography.micro,
    fontWeight: '600',
    color: palette.muted,
  },
  comment: {
    ...typography.caption,
    color: palette.muted,
  },
  commentAuthor: {
    fontWeight: '800',
    color: palette.ink,
  },
  input: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.bg,
    fontSize: typography.caption.fontSize,
    color: palette.ink,
  },
});
