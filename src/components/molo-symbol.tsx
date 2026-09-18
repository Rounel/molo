import { StyleSheet, type TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MoloColors } from '@/constants/molo-design';

export type MoloSymbolName =
  | 'ai'
  | 'bell'
  | 'budget'
  | 'calendar'
  | 'cart'
  | 'chevronRight'
  | 'check'
  | 'down'
  | 'expense'
  | 'home'
  | 'income'
  | 'mic'
  | 'more'
  | 'search'
  | 'saving';

const glyphs: Record<MoloSymbolName, string> = {
  ai: '✦',
  bell: '♧',
  budget: '▤',
  calendar: '▣',
  cart: '▱',
  chevronRight: '›',
  check: '○',
  down: '⌄',
  expense: '−',
  home: '⌂',
  income: '+',
  mic: '●',
  more: '••',
  search: '⌕',
  saving: '%',
};

export function MoloSymbol({
  name,
  color = MoloColors.text,
  size = 18,
  style,
}: {
  name: MoloSymbolName;
  color?: string;
  size?: number;
  style?: TextStyle;
}) {
  return (
    <ThemedText
      type="smallBold"
      style={[styles.symbol, { color, fontSize: size, lineHeight: size + 4 }, style]}>
      {glyphs[name]}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  symbol: {
    textAlign: 'center',
  },
});
