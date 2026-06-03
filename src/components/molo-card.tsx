import { Pressable, StyleSheet, type PressableProps, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type CardProps = ViewProps & {
  tone?: 'plain' | 'mint' | 'ink' | 'coral';
};

const toneStyles = {
  plain: {
    lightColor: '#FFFFFF',
    darkColor: '#16181D',
    borderColor: '#ECEEF2',
  },
  mint: {
    lightColor: '#EAF8F1',
    darkColor: '#123229',
    borderColor: '#BFE9D2',
  },
  ink: {
    lightColor: '#121826',
    darkColor: '#0D111B',
    borderColor: '#273047',
  },
  coral: {
    lightColor: '#FFF0E8',
    darkColor: '#3A2018',
    borderColor: '#FFD2BC',
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
        variant === 'primary' && styles.primaryButton,
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
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
    gap: Spacing.two,
    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
  },
  button: {
    minHeight: 50,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#111827',
  },
  secondaryButton: {
    backgroundColor: '#EDF2F7',
  },
  dangerButton: {
    backgroundColor: '#FFE4DC',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#111827',
  },
  pressed: {
    opacity: 0.72,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    gap: Spacing.half,
  },
});
