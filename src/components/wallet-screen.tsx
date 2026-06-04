import { ScrollView, StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MoloColors, MoloGradients, MoloRadius } from '@/constants/molo-design';
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
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + 96,
        },
      ]}>
      <View style={[styles.topGlow, MoloGradients.hero]} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={[styles.shell, { maxWidth: shellWidth }, style]}>{children}</View>
    </ScrollView>
  );
}

export function WalletHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.header}>
      <View>
        <ThemedText type="small" style={styles.eyebrow}>
          {eyebrow}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>
      </View>
      <View style={styles.headerActions}>
        <View style={styles.headerIcon}>
          <ThemedText type="smallBold" style={styles.headerIconText}>
            ?
          </ThemedText>
        </View>
        {action ? (
          <View style={styles.actionPill}>
            <ThemedText type="smallBold" style={styles.actionText}>
              {action}
            </ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function IconBubble({ label, large = false }: { label: string; large?: boolean }) {
  return (
    <View style={[styles.iconBubble, large && styles.iconBubbleLarge]}>
      <ThemedText type="smallBold" style={styles.iconBubbleText}>
        {label}
      </ThemedText>
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
    paddingHorizontal: Spacing.three,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 245,
    opacity: 0.95,
    backgroundColor: MoloColors.purple900,
  },
  glowOne: {
    position: 'absolute',
    top: 74,
    right: -56,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(208, 67, 221, 0.18)',
  },
  glowTwo: {
    position: 'absolute',
    top: 230,
    left: -70,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(244, 212, 250, 0.10)',
  },
  shell: {
    width: '100%',
    gap: Spacing.three,
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  eyebrow: {
    color: MoloColors.textMuted,
  },
  title: {
    color: MoloColors.text,
    fontSize: 17,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  headerIconText: {
    color: MoloColors.text,
  },
  actionPill: {
    minHeight: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  actionText: {
    color: MoloColors.text,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: MoloRadius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelSoft,
    borderWidth: 1,
    borderColor: MoloColors.strokeSoft,
  },
  iconBubbleLarge: {
    width: 54,
    height: 54,
    borderRadius: 20,
  },
  iconBubbleText: {
    color: MoloColors.text,
  },
});
