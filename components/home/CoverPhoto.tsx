import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { radius, typography } from '@/constants/theme';

type Props = {
  uri: string;
  tagline: string;
  title: string;
};

export function CoverPhoto({ uri, tagline, title }: Props) {
  return (
    <ImageBackground
      source={{ uri }}
      style={styles.photo}
      imageStyle={styles.image}
      accessibilityRole="image"
      accessibilityLabel={`${title} 대문 사진`}>
      <View style={styles.gradient} />
      <Text style={styles.tagline}>{tagline}</Text>
      <Text style={styles.title}>{title}</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  photo: {
    height: 248,
    padding: 20,
    justifyContent: 'flex-end',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  image: {
    borderRadius: radius.xl,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(13,28,25,0.65) 100%)',
  },
  tagline: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.88)',
    letterSpacing: 1.3,
  },
  title: {
    ...typography.title,
    color: '#FFFFFF',
  },
});
