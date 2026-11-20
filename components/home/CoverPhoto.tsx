import { ImageBackground, StyleSheet, View } from "react-native";

const COVER_HEIGHT = 240;
const TOP_SHADOW_HEIGHT = 90;

type Props = {
  uri: string;
};

export function CoverPhoto({ uri }: Props) {
  return (
    <ImageBackground
      source={{ uri }}
      style={styles.photo}
      accessibilityRole="image"
      accessibilityLabel="대문 사진"
    >
      <View pointerEvents="none" style={styles.topShadow} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  photo: {
    height: COVER_HEIGHT,
    justifyContent: "flex-start",
  },
  topShadow: {
    height: TOP_SHADOW_HEIGHT,
    backgroundImage:
      "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%)",
  },
});
