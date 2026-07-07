import type { ViewStyle } from 'react-native';

export const MoloColors = {
  canvas: '#07080F',
  canvasSoft: '#0C0D15',
  panel: '#12141F',
  panelRaised: '#191B28',
  panelSoft: '#222436',
  stroke: '#282B3A',
  strokeSoft: '#3B3D50',
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
  magenta: '#FF5BD4',
} as const;

export const MoloGradients = {
  hero: {
    experimental_backgroundImage:
      'radial-gradient(circle at 8% 0%, #D043DD 0%, rgba(208,67,221,0.18) 34%, transparent 62%), linear-gradient(135deg, #6C226D 0%, #2C1747 46%, #17111F 100%)',
  } as ViewStyle,
  heroDeep: {
    experimental_backgroundImage:
      'radial-gradient(circle at 4% 2%, #D043DD 0%, rgba(208,67,221,0.18) 34%, transparent 58%), linear-gradient(145deg, #6C226D 0%, #2B1545 50%, #161019 100%)',
  } as ViewStyle,
  glass: {
    experimental_backgroundImage:
      'linear-gradient(145deg, rgba(255,255,255,0.11), rgba(255,255,255,0.035))',
  } as ViewStyle,
  chip: {
    experimental_backgroundImage:
      'linear-gradient(145deg, rgba(208,67,221,0.58), rgba(71,10,72,0.44))',
  } as ViewStyle,
  navActive: {
    experimental_backgroundImage:
      'linear-gradient(145deg, rgba(208,67,221,0.92), rgba(71,10,72,0.88))',
  } as ViewStyle,
  purpleButton: {
    experimental_backgroundImage: 'linear-gradient(90deg, #BB35C4 0%, #D043DD 100%)',
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
  panel: '0 18px 45px rgba(0, 0, 0, 0.32)',
  floating: '0 20px 55px rgba(0, 0, 0, 0.58)',
  glow: '0 18px 50px rgba(208, 67, 221, 0.28)',
} as const;
