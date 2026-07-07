import { Pressable, StyleSheet, type PressableProps, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';

type CardProps = ViewProps & {
  tone?: 'plain' | 'mint' | 'ink' | 'coral';
};

const toneStyles = {
  plain: {
    lightColor: MoloColors.panel,
    darkColor: MoloColors.panel,
    borderColor: MoloColors.stroke,
  },
  mint: {
    lightColor: '#162A27',
    darkColor: '#162A27',
    borderColor: '#21463D',
  },
  ink: {
    lightColor: MoloColors.panelRaised,
    darkColor: MoloColors.panelRaised,
    borderColor: MoloColors.strokeSoft,
  },
  coral: {
    lightColor: '#2D1D25',
    darkColor: '#2D1D25',
    borderColor: '#563143',
  },
};

export function MoloCard({ style, tone = 'plain', ...props }: CardProps) {
  const toneStyle = toneStyles[tone];

  return (
    <ThemedView
      lightColor={toneStyle.lightColor}
      darkColor={toneStyle.darkColor}
      style={[styles.card, { borderColor: toneStyle.borderColor }, style]}
      {...props}
    />
  );
}

type ActionButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function ActionButton({ label, variant = 'primary', style, ...props }: ActionButtonProps) {
  return (
    <Pressable
      {...props}
      style={(state) => [
        styles.button,
        variant === 'primary' && [styles.primaryButton, MoloGradients.purpleButton],
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}>
      <ThemedText
        type="smallBold"
        style={variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function SectionHeader({ title, detail }: { title: string; detail?: string }) {
  return (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText type="smallBold">{title}</ThemedText>
      {detail ? (
        <ThemedText type="small" themeColor="textSecondary">
          {detail}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: MoloRadius.card,
    borderWidth: 1,
    padding: 16,
    gap: Spacing.two,
    boxShadow: MoloShadow.panel,
  },
  button: {
    minHeight: 50,
    borderRadius: 25,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: MoloColors.purple700,
    boxShadow: MoloShadow.glow,
  },
  secondaryButton: {
    backgroundColor: MoloColors.panelSoft,
  },
  dangerButton: {
    backgroundColor: '#3A1D29',
  },
  primaryButtonText: {
    color: MoloColors.text,
  },
  secondaryButtonText: {
    color: MoloColors.text,
  },
  pressed: {
    opacity: 0.72,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    gap: Spacing.half,
  },
});
