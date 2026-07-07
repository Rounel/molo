import { Pressable, StyleSheet, View } from 'react-native';

import { MoloCard } from '@/components/molo-card';
import { MoloSymbol } from '@/components/molo-symbol';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import { currencyOptions, useCurrency, type DisplayCurrency } from '@/lib/currency';

const sampleAmount = 250000;

export default function SettingsScreen() {
  const { currency, formatMoney, selectedOption, setCurrency } = useCurrency();

  return (
    <WalletScreen maxTabletWidth={460}>
      <WalletHeader title="Parametres" actionIcon="home" actionHref="/" />

      <View style={[styles.heroCard, MoloGradients.heroDeep]}>
        <View style={styles.heroOrb} />
        <ThemedText type="small" style={styles.heroMuted}>
          Devise d&apos;affichage
        </ThemedText>
        <ThemedText type="title" style={styles.heroAmount}>
          {selectedOption.code}
        </ThemedText>
        <View style={styles.heroMeta}>
          <ThemedText type="smallBold" style={styles.heroText}>
            Tous les montants saisis en FCFA sont affiches en {selectedOption.label}.
          </ThemedText>
        </View>
      </View>

      <MoloCard style={styles.previewCard}>
        <View style={styles.previewRow}>
          <IconBubble icon="budget" active />
          <View style={styles.previewCopy}>
            <ThemedText type="small" style={styles.previewMeta}>
              Exemple
            </ThemedText>
            <ThemedText type="smallBold" style={styles.previewTitle}>
              250 000 FCFA → {formatMoney(sampleAmount)}
            </ThemedText>
          </View>
        </View>
      </MoloCard>

      <View style={styles.sectionTitleRow}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Choisir une devise
        </ThemedText>
        <ThemedText type="small" style={styles.sectionMeta}>
          Base FCFA
        </ThemedText>
      </View>

      <View style={styles.currencyPanel}>
        {currencyOptions.map((option) => (
          <CurrencyRow
            key={option.code}
            active={currency === option.code}
            code={option.code}
            hint={option.hint}
            label={option.label}
            onPress={() => setCurrency(option.code)}
          />
        ))}
      </View>

      <MoloCard style={styles.noteCard}>
        <View style={styles.noteRow}>
          <IconBubble icon="ai" />
          <View style={styles.previewCopy}>
            <ThemedText type="smallBold" style={styles.previewTitle}>
              Taux indicatifs MVP
            </ThemedText>
            <ThemedText type="small" style={styles.previewMeta}>
              Les calculs restent stockes en FCFA. En production, ces taux devront venir du backend ou
              d&apos;un service de change fiable.
            </ThemedText>
          </View>
        </View>
      </MoloCard>
    </WalletScreen>
  );
}

function CurrencyRow({
  active,
  code,
  hint,
  label,
  onPress,
}: {
  active: boolean;
  code: DisplayCurrency;
  hint: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.currencyRow, active && styles.currencyRowActive]}>
      <View style={[styles.codeBadge, active && MoloGradients.navActive]}>
        <ThemedText type="smallBold" style={styles.codeText}>
          {code}
        </ThemedText>
      </View>
      <View style={styles.currencyCopy}>
        <ThemedText type="smallBold" style={styles.currencyLabel}>
          {label}
        </ThemedText>
        <ThemedText type="small" style={styles.currencyHint}>
          {hint}
        </ThemedText>
      </View>
      {active ? <MoloSymbol name="check" size={18} color={MoloColors.purple200} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    minHeight: 174,
    borderRadius: MoloRadius.card,
    padding: Spacing.four,
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: MoloColors.purple900,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: MoloShadow.floating,
  },
  heroOrb: {
    position: 'absolute',
    right: -52,
    bottom: -62,
    width: 178,
    height: 178,
    borderRadius: 89,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
  },
  heroMuted: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  heroText: {
    color: MoloColors.text,
    lineHeight: 22,
  },
  heroAmount: {
    color: MoloColors.text,
    fontSize: 40,
    lineHeight: 46,
  },
  heroMeta: {
    maxWidth: 300,
  },
  previewCard: {
    gap: Spacing.two,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  previewCopy: {
    flex: 1,
    gap: 2,
  },
  previewTitle: {
    color: MoloColors.text,
  },
  previewMeta: {
    color: MoloColors.textMuted,
    lineHeight: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: MoloColors.text,
    fontSize: 17,
  },
  sectionMeta: {
    color: MoloColors.textMuted,
  },
  currencyPanel: {
    borderRadius: MoloRadius.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(18, 20, 31, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
  },
  currencyRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  currencyRowActive: {
    backgroundColor: 'rgba(208, 67, 221, 0.10)',
  },
  codeBadge: {
    width: 52,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelSoft,
    borderWidth: 1,
    borderColor: MoloColors.strokeSoft,
  },
  codeText: {
    color: MoloColors.text,
  },
  currencyCopy: {
    flex: 1,
    gap: 2,
  },
  currencyLabel: {
    color: MoloColors.text,
  },
  currencyHint: {
    color: MoloColors.textMuted,
  },
  noteCard: {
    gap: Spacing.two,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
