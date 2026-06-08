// Design tokens for Bar Compass.
// Dark, depth-driven theme accented with University of Maryland colors so the
// app feels native to College Park.

export const colors = {
  // Background gradient (deep night sky -> charcoal).
  bgTop: '#0B1020',
  bgBottom: '#161B2E',

  // Glass surfaces layered over the gradient.
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceStrong: 'rgba(255, 255, 255, 0.10)',
  border: 'rgba(255, 255, 255, 0.14)',

  // UMD palette.
  red: '#E03A3E',
  redSoft: '#FF5A5E',
  gold: '#FFD200',

  // Text.
  text: '#F5F7FB',
  textMuted: '#A7AEC4',
  textFaint: '#6F7793',

  // Compass dial.
  dialTrack: 'rgba(255, 255, 255, 0.10)',
  dialTick: 'rgba(255, 255, 255, 0.35)',
  dialTickMajor: 'rgba(255, 255, 255, 0.65)',
  north: '#FF5A5E',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
} as const;

export const radius = {
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const font = {
  display: 40,
  title: 22,
  body: 16,
  caption: 13,
} as const;
