import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { FormSheet, SheetField, SheetInput, SheetLayout } from '@/components/ui/FormSheet';
import { palette, radius, typography } from '@/constants/theme';

const MAX_PHOTOS = 10;

export type NewPost = { photos: string[]; place: string; caption: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (post: NewPost) => void;
};

export function AddPostSheet({ visible, onClose, onSave }: Props) {
  return (
    <FormSheet visible={visible} onClose={onClose}>
      <PostForm onClose={onClose} onSave={onSave} />
    </FormSheet>
  );
}

function PostForm({ onClose, onSave }: Omit<Props, 'visible'>) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [place, setPlace] = useState('');
  const [caption, setCaption] = useState('');
  const canSave = photos.length > 0;
  const remaining = MAX_PHOTOS - photos.length;

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      orderedSelection: true,
      quality: 0.8,
    });
    if (result.canceled) return;
    setPhotos((prev) => [...prev, ...result.assets.map((asset) => asset.uri)].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  return (
    <SheetLayout
      title="새 스토리"
      onClose={onClose}
      canSave={canSave}
      onSave={() => onSave({ photos, place: place.trim(), caption: caption.trim() })}>
      <SheetField label={`사진 ${photos.length}/${MAX_PHOTOS}`}>
        <View style={styles.photos}>
          {photos.map((uri, i) => (
            <View key={`${uri}-${i}`} style={styles.tile}>
              <Image source={{ uri }} style={styles.thumb} />
              <Pressable
                onPress={() => removePhoto(i)}
                accessibilityRole="button"
                accessibilityLabel={`사진 ${i + 1} 삭제`}
                hitSlop={6}
                style={styles.remove}>
                <AppIcon name="close" color="#FFFFFF" size={10} />
              </Pressable>
            </View>
          ))}
          {remaining > 0 && (
            <Pressable
              onPress={pickPhotos}
              accessibilityRole="button"
              accessibilityLabel="사진 추가"
              style={({ pressed }) => [styles.tile, styles.addTile, pressed && { opacity: 0.6 }]}>
              <AppIcon name="camera" color={palette.accent} size={20} />
              <Text style={styles.addLabel}>사진 추가</Text>
            </Pressable>
          )}
        </View>
      </SheetField>
      <SheetField label="장소">
        <SheetInput
          value={place}
          onChangeText={setPlace}
          placeholder="예: 성수동 카페"
          maxLength={30}
          returnKeyType="done"
        />
      </SheetField>
      <SheetField label="이야기">
        <SheetInput
          value={caption}
          onChangeText={setCaption}
          placeholder="오늘의 순간을 기록해 주세요"
          maxLength={500}
          multiline
        />
      </SheetField>
    </SheetLayout>
  );
}

const TILE = 72;

const styles = StyleSheet.create({
  photos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  thumb: {
    flex: 1,
    backgroundColor: palette.line,
  },
  remove: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(41, 50, 54, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.accent,
    backgroundColor: palette.soft,
  },
  addLabel: {
    ...typography.micro,
    color: palette.accent,
  },
});
