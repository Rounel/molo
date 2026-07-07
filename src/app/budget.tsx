import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MoloCard } from '@/components/molo-card';
import { MoloSymbol, type MoloSymbolName } from '@/components/molo-symbol';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import {
  budgetColumns,
  buildMonthlySummaries,
  initialEntries,
  monthNames,
} from '@/lib/budget';
import { useMoney } from '@/lib/currency';

export default function BudgetScreen() {
  const summaries = useMemo(() => buildMonthlySummaries(initialEntries, budgetColumns), []);
  const [activeMonth, setActiveMonth] = useState(5);
  const money = useMoney();
  const current = summaries[activeMonth];
  const annualSavings = summaries.reduce((total, item) => total + item.savings, 0);

  return (
    <WalletScreen maxTabletWidth={460}>
      <WalletHeader title="Molo" actionIcon="more" actionHref="/settings" />

      <View style={[styles.summaryCard, MoloGradients.hero]}>
        <View style={styles.summaryOrb} />
        <ThemedText type="small" style={styles.cardMuted}>
          Budget de {monthNames[activeMonth]}
        </ThemedText>
        <ThemedText type="title" style={styles.summaryAmount}>
          {money(current.balance)}
        </ThemedText>
        <View style={styles.summaryGrid}>
          <MiniStat label="Revenus" value={money(current.income)} />
          <MiniStat label="Depenses" value={money(current.expenses)} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthRail}>
        {summaries.map((summary) => (
          <Pressable
            key={summary.month}
            onPress={() => setActiveMonth(summary.month)}
            style={[styles.monthChip, activeMonth === summary.month && styles.monthChipActive]}>
            <ThemedText
              type="smallBold"
              style={activeMonth === summary.month ? styles.monthTextActive : styles.monthText}>
              {monthNames[summary.month]}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.sectionTitleRow}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Tableau budgetaire
        </ThemedText>
        <ThemedText type="small" style={styles.sectionMeta}>
          {monthNames[activeMonth]}
        </ThemedText>
      </View>

      <View style={styles.listPanel}>
        <BudgetLine icon="income" label="Salaire pro" value={current.income - 85000} money={money} positive />
        <BudgetLine icon="income" label="Revenus passifs" value={85000} money={money} positive />
        <BudgetLine icon="expense" label="Depenses fixes" value={255000} money={money} />
        <BudgetLine icon="expense" label="Depenses variables" value={current.expenses - 255000} money={money} />
        <BudgetLine icon="saving" label="Epargne prevue" value={current.savings} money={money} positive />
      </View>

      <MoloCard style={styles.bottomCard}>
        <View style={styles.bottomRow}>
          <IconBubble icon="saving" active />
          <View style={styles.bottomCopy}>
            <ThemedText type="smallBold" style={styles.bottomTitle}>
              Projection annuelle
            </ThemedText>
            <ThemedText type="small" style={styles.bottomMeta}>
              Epargne estimee: {money(annualSavings)}
            </ThemedText>
          </View>
          <MoloSymbol name="down" size={18} color={MoloColors.textMuted} />
        </View>
      </MoloCard>
    </WalletScreen>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniStat}>
      <ThemedText type="small" style={styles.cardMuted}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.cardText}>
        {value}
      </ThemedText>
    </View>
  );
}

function BudgetLine({
  icon,
  label,
  value,
  positive,
  money,
}: {
  icon: MoloSymbolName;
  label: string;
  money: (amountXof: number) => string;
  value: number;
  positive?: boolean;
}) {
  return (
    <Pressable style={styles.budgetLine}>
      <IconBubble icon={icon} />
      <View style={styles.lineCopy}>
        <ThemedText type="smallBold" style={styles.lineTitle}>
          {label}
        </ThemedText>
        <ThemedText type="small" style={styles.lineMeta}>
          {positive ? 'Impact positif' : 'Impact negatif'}
        </ThemedText>
      </View>
      <ThemedText type="smallBold" style={[styles.lineAmount, positive && styles.lineAmountPositive]}>
        {positive ? '+' : '-'}
        {money(value)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    minHeight: 190,
    borderRadius: MoloRadius.card,
    padding: Spacing.four,
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: MoloColors.purple900,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: MoloShadow.floating,
  },
  summaryOrb: {
    position: 'absolute',
    right: -42,
    bottom: -54,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  cardMuted: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  cardText: {
    color: MoloColors.text,
    fontVariant: ['tabular-nums'],
  },
  summaryAmount: {
    color: MoloColors.text,
    fontSize: 38,
    lineHeight: 46,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  miniStat: {
    flex: 1,
    gap: Spacing.half,
  },
  monthRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  monthChip: {
    minHeight: 42,
    minWidth: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelRaised,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  monthChipActive: {
    backgroundColor: MoloColors.purple700,
    borderColor: MoloColors.purple500,
  },
  monthText: {
    color: MoloColors.textMuted,
  },
  monthTextActive: {
    color: MoloColors.text,
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
  listPanel: {
    borderRadius: MoloRadius.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(18, 20, 31, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
  },
  budgetLine: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  lineCopy: {
    flex: 1,
    gap: 2,
  },
  lineTitle: {
    color: MoloColors.text,
  },
  lineMeta: {
    color: MoloColors.textMuted,
  },
  lineAmount: {
    color: MoloColors.magenta,
    fontVariant: ['tabular-nums'],
  },
  lineAmountPositive: {
    color: MoloColors.success,
  },
  bottomCard: {
    gap: Spacing.three,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  bottomCopy: {
    flex: 1,
  },
  bottomTitle: {
    color: MoloColors.text,
  },
  bottomMeta: {
    color: MoloColors.textMuted,
  },
});
