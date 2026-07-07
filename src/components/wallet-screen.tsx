import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MoloSymbol, type MoloSymbolName } from '@/components/molo-symbol';
import { MoloColors, MoloGradients, MoloShadow } from '@/constants/molo-design';
import { BottomTabInset, Spacing } from '@/constants/theme';

type WalletScreenProps = ViewProps & {
  maxTabletWidth?: number;
};

export function WalletScreen({ children, maxTabletWidth = 430, style }: WalletScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const shellWidth = width >= 720 ? maxTabletWidth : 430;

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + 112,
        },
      ]}>
      <View style={styles.topShadow} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={[styles.shell, { maxWidth: shellWidth }, style]}>{children}</View>
    </ScrollView>
  );
}

export function WalletHeader({
  title,
  actionHref,
  actionIcon = 'more',
}: {
  title: string;
  actionHref?: Href;
  actionIcon?: MoloSymbolName;
}) {
  const action = (
    <Pressable style={({ pressed }) => [styles.headerIcon, MoloGradients.chip, pressed && styles.pressed]}>
      <MoloSymbol name={actionIcon} size={18} />
    </Pressable>
  );

  return (
    <View style={styles.header}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {actionHref ? <Link href={actionHref} asChild>{action}</Link> : action}
    </View>
  );
}

export function IconBubble({
  label,
  icon,
  large = false,
  active = false,
}: {
  label?: string;
  icon?: MoloSymbolName;
  large?: boolean;
  active?: boolean;
}) {
  return (
    <View style={[styles.iconBubble, active && styles.iconBubbleActive, large && styles.iconBubbleLarge]}>
      {icon ? (
        <MoloSymbol name={icon} size={large ? 22 : 18} />
      ) : (
        <ThemedText type="smallBold" style={styles.iconBubbleText}>
          {label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: MoloColors.canvas,
  },
  content: {
    alignItems: 'center',
    minHeight: '100%',
    paddingHorizontal: 20,
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: '#0B0C14',
  },
  glowOne: {
    position: 'absolute',
    top: 108,
    right: -92,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(208, 67, 221, 0.20)',
  },
  glowTwo: {
    position: 'absolute',
    top: 420,
    left: -120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(157, 41, 162, 0.12)',
  },
  shell: {
    width: '100%',
    gap: Spacing.three,
  },
  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    color: MoloColors.text,
    fontSize: 26,
    lineHeight: 32,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.purple900,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    boxShadow: MoloShadow.glow,
  },
  pressed: {
    opacity: 0.72,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelSoft,
    borderWidth: 1,
    borderColor: MoloColors.strokeSoft,
  },
  iconBubbleActive: {
    backgroundColor: MoloColors.purple900,
    borderColor: MoloColors.purple700,
  },
  iconBubbleLarge: {
    width: 54,
    height: 54,
    borderRadius: 18,
  },
  iconBubbleText: {
    color: MoloColors.text,
  },
});
