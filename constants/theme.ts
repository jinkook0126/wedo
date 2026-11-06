import type { TextStyle } from 'react-native';

export const palette = {
  bg: '#FAF9F7',
  surface: '#FFFFFF',
  ink: '#293236',
  muted: '#939998',
  line: '#EFEFEA',
  track: '#ECECE6',
  accent: '#E78372',
  soft: '#FCEDE8',
  green: '#618B79',
  greenSoft: '#EDF4EE',
  blue: '#779BAE',
  blueSoft: '#EEF3F7',
} as const;

function textStyle(fontSize: number, fontWeight: TextStyle['fontWeight']): TextStyle {
  return {
    fontSize,
    fontWeight,
    lineHeight: Math.round(fontSize * 1.35),
    letterSpacing: fontSize * -0.02,
    color: palette.ink,
  };
}

export const typography = {
  display: textStyle(36, '800'),
  title: textStyle(28, '800'),
  heading: textStyle(19, '800'),
  body: textStyle(14, '600'),
  caption: textStyle(12, '600'),
  micro: textStyle(10, '700'),
} as const;

export const radius = {
  sm: 7,
  md: 14,
  lg: 22,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  screen: 24,
  section: 22,
} as const;

export const shadow = {
  card: '0px 3px 16px 0px rgba(35, 45, 40, 0.04)',
} as const;

export type Tone = 'accent' | 'green' | 'blue';

export const toneColors: Record<Tone, { fg: string; bg: string }> = {
  accent: { fg: palette.accent, bg: palette.soft },
  green: { fg: palette.green, bg: palette.greenSoft },
  blue: { fg: palette.blue, bg: palette.blueSoft },
};
