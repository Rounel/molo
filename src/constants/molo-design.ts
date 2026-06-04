import type { ViewStyle } from 'react-native';

export const MoloColors = {
  canvas: '#101018',
  canvasSoft: '#15151F',
  panel: '#1B1B25',
  panelRaised: '#22232E',
  panelSoft: '#2A2B36',
  stroke: '#30313E',
  strokeSoft: '#3A394A',
  text: '#FFFFFF',
  textMuted: '#A7A6B7',
  textFaint: '#706F81',
  purple50: '#FDF5FE',
  purple200: '#F4D4FA',
  purple500: '#D043DD',
  purple700: '#9D29A2',
  purple900: '#6C226D',
  purple950: '#470A48',
  gold100: '#EDEAD5',
  gold300: '#C9BD80',
  success: '#6EE7A8',
  danger: '#FF7A90',
} as const;

export const MoloGradients = {
  hero: {
    experimental_backgroundImage:
      'linear-gradient(135deg, #6C226D 0%, #8C5AF6 48%, #F4D4FA 100%)',
  } as ViewStyle,
  heroDeep: {
    experimental_backgroundImage:
      'linear-gradient(145deg, #470A48 0%, #6C226D 48%, #9D29A2 100%)',
  } as ViewStyle,
  glass: {
    experimental_backgroundImage:
      'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
  } as ViewStyle,
  chip: {
    experimental_backgroundImage:
      'linear-gradient(145deg, rgba(253,245,254,0.22), rgba(253,245,254,0.06))',
  } as ViewStyle,
} as const;

export const MoloRadius = {
  screen: 30,
  card: 22,
  tile: 18,
  chip: 24,
  icon: 16,
} as const;

export const MoloShadow = {
  panel: '0 18px 45px rgba(0, 0, 0, 0.30)',
  floating: '0 18px 45px rgba(0, 0, 0, 0.45)',
} as const;
