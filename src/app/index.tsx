import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ActionButton, MoloCard } from '@/components/molo-card';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import {
  budgetColumns,
  buildMonthlySummaries,
  formatMoney,
  getPurchaseAdvice,
  initialEntries,
  monthNames,
  plannedPurchases,
  type BudgetEntry,
} from '@/lib/budget';

export default function DashboardScreen() {
  const [entries, setEntries] = useState(initialEntries);
  const [activeMonth, setActiveMonth] = useState(5);
  const [entryName, setEntryName] = useState('Gombo');
  const [entryAmount, setEntryAmount] = useState('75000');
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');

  const summaries = useMemo(() => buildMonthlySummaries(entries, budgetColumns), [entries]);
  const current = summaries[activeMonth];
  const advice = getPurchaseAdvice(plannedPurchases[0], summaries);
  const savingsRate = current.income > 0 ? Math.round((current.savings / current.income) * 100) : 0;
  const monthEntries = entries.filter(
    (entry) => entry.month === activeMonth || entry.recurrence === 'monthly',
  );

  function addEntry() {
    const amount = Number(entryAmount.replace(/\D/g, ''));
    if (!entryName.trim() || amount <= 0) {
      return;
    }

    const newEntry: BudgetEntry = {
      id: `${Date.now()}`,
      month: activeMonth,
      columnId: entryType === 'income' ? 'freelance' : 'variable',
      name: entryName.trim(),
      amount,
      category: entryType === 'income' ? 'Revenu ponctuel' : 'Depense variable',
      recurrence: 'none',
      status: entryType === 'income' ? 'recu' : 'realise',
    };
    setEntries((value) => [newEntry, ...value]);
    setEntryName('');
    setEntryAmount('');
  }

  return (
    <WalletScreen>
      <WalletHeader eyebrow="Molo" title={`Budget de ${monthNames[activeMonth]}`} action="Profil" />

      <View style={[styles.heroCard, MoloGradients.hero]}>
        <View style={styles.heroOrb} />
        <ThemedText type="small" style={styles.heroMuted}>
          Solde mensuel
        </ThemedText>
        <ThemedText type="title" style={styles.heroAmount}>
          {formatMoney(current.balance)}
        </ThemedText>
        <View style={styles.heroMetaRow}>
          <View style={styles.heroMeta}>
            <ThemedText type="small" style={styles.heroMuted}>
              Epargne prevue
            </ThemedText>
            <ThemedText type="smallBold" style={styles.heroText}>
              {formatMoney(current.savings)}
            </ThemedText>
          </View>
          <View style={styles.growthPill}>
            <ThemedText type="smallBold" style={styles.growthText}>
              +{savingsRate}%
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.actionGrid}>
        <QuickAction label="Revenu" icon="+" onPress={() => setEntryType('income')} />
        <QuickAction label="Depense" icon="-" onPress={() => setEntryType('expense')} />
        <QuickAction label="Epargne" icon="%" onPress={() => setActiveMonth(8)} />
        <QuickAction label="Mois" icon="v" onPress={() => setActiveMonth((value) => (value + 1) % 12)} />
      </View>

      <View style={styles.infoStrip}>
        <IconBubble label="AI" />
        <View style={styles.infoCopy}>
          <ThemedText type="smallBold" style={styles.infoTitle}>
            Assistant budget
          </ThemedText>
          <ThemedText type="small" style={styles.infoDetail}>
            Achat confortable en {monthNames[advice.recommendedMonth]}
          </ThemedText>
        </View>
        <ThemedText type="smallBold" style={styles.chevron}>
          &gt;
        </ThemedText>
      </View>

      <View style={styles.segmented}>
        <Pressable style={styles.segmentActive}>
          <ThemedText type="smallBold" style={styles.segmentActiveText}>
            Budget
          </ThemedText>
        </Pressable>
        <Pressable style={styles.segment}>
          <ThemedText type="smallBold" style={styles.segmentText}>
            Achats
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.balanceList}>
        <MetricRow icon="+" title="Revenus" detail="Total du mois" amount={formatMoney(current.income)} positive />
        <MetricRow icon="-" title="Depenses" detail="Fixes, variables, surprises" amount={formatMoney(current.expenses)} />
        <MetricRow icon="%" title="Epargne" detail="Objectif securite" amount={formatMoney(current.savings)} positive />
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
            <ThemedText
              type="small"
              style={activeMonth === summary.month ? styles.monthValueActive : styles.monthValue}>
              {formatMoney(summary.balance)}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <MoloCard style={styles.quickAddCard}>
        <View style={styles.formTabs}>
          <Pressable
            onPress={() => setEntryType('income')}
            style={[styles.formTab, entryType === 'income' && styles.formTabActive]}>
            <ThemedText
              type="smallBold"
              style={entryType === 'income' ? styles.formTabTextActive : styles.formTabText}>
              Revenu
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setEntryType('expense')}
            style={[styles.formTab, entryType === 'expense' && styles.formTabActive]}>
            <ThemedText
              type="smallBold"
              style={entryType === 'expense' ? styles.formTabTextActive : styles.formTabText}>
              Depense
            </ThemedText>
          </Pressable>
        </View>
        <TextInput
          value={entryName}
          onChangeText={setEntryName}
          placeholder="Nom"
          placeholderTextColor={MoloColors.textFaint}
          style={styles.input}
        />
        <TextInput
          value={entryAmount}
          onChangeText={setEntryAmount}
          placeholder="Montant FCFA"
          placeholderTextColor={MoloColors.textFaint}
          inputMode="numeric"
          style={styles.input}
        />
        <ActionButton label="Ajouter au budget" onPress={addEntry} />
      </MoloCard>

      <View style={styles.balanceList}>
        {monthEntries.slice(0, 4).map((entry) => {
          const column = budgetColumns.find((item) => item.id === entry.columnId);
          const isExpense = column?.impact === 'negative';
          return (
            <MetricRow
              key={entry.id}
              icon={isExpense ? '-' : '+'}
              title={entry.name}
              detail={column?.name ?? 'Budget'}
              amount={`${isExpense ? '-' : '+'}${formatMoney(entry.amount)}`}
              positive={!isExpense}
            />
          );
        })}
      </View>
    </WalletScreen>
  );
}

function QuickAction({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.quickAction}>
      <View style={[styles.quickActionIcon, MoloGradients.chip]}>
        <ThemedText type="smallBold" style={styles.quickActionIconText}>
          {icon}
        </ThemedText>
      </View>
      <ThemedText type="small" style={styles.quickActionLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function MetricRow({
  icon,
  title,
  detail,
  amount,
  positive,
}: {
  icon: string;
  title: string;
  detail: string;
  amount: string;
  positive?: boolean;
}) {
  return (
    <Pressable style={styles.metricRow}>
      <IconBubble label={icon} />
      <View style={styles.metricText}>
        <ThemedText type="smallBold" style={styles.metricTitle}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={styles.metricDetail}>
          {detail}
        </ThemedText>
      </View>
      <ThemedText type="smallBold" style={[styles.metricAmount, positive && styles.metricAmountPositive]}>
        {amount}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    minHeight: 190,
    borderRadius: MoloRadius.card,
    padding: Spacing.four,
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor: MoloColors.purple900,
    boxShadow: MoloShadow.floating,
  },
  heroOrb: {
    position: 'absolute',
    right: -46,
    bottom: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  heroMuted: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  heroText: {
    color: MoloColors.text,
  },
  heroAmount: {
    color: MoloColors.text,
    fontSize: 38,
    lineHeight: 46,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  heroMeta: {
    gap: Spacing.half,
  },
  growthPill: {
    minHeight: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  growthText: {
    color: MoloColors.text,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.two,
  },
  quickActionIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelRaised,
    borderWidth: 1,
    borderColor: MoloColors.strokeSoft,
  },
  quickActionIconText: {
    color: MoloColors.text,
    fontSize: 18,
  },
  quickActionLabel: {
    color: MoloColors.textMuted,
    textAlign: 'center',
  },
  infoStrip: {
    minHeight: 64,
    borderRadius: MoloRadius.tile,
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    color: MoloColors.text,
  },
  infoDetail: {
    color: MoloColors.textMuted,
  },
  chevron: {
    color: MoloColors.textMuted,
    fontSize: 18,
  },
  segmented: {
    minHeight: 48,
    padding: Spacing.one,
    borderRadius: 24,
    flexDirection: 'row',
    gap: Spacing.one,
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  segment: {
    flex: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    flex: 1,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.text,
  },
  segmentText: {
    color: MoloColors.textMuted,
  },
  segmentActiveText: {
    color: MoloColors.canvas,
  },
  balanceList: {
    borderRadius: MoloRadius.card,
    overflow: 'hidden',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  metricRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: MoloColors.stroke,
  },
  metricText: {
    flex: 1,
    gap: 2,
  },
  metricTitle: {
    color: MoloColors.text,
  },
  metricDetail: {
    color: MoloColors.textMuted,
  },
  metricAmount: {
    color: MoloColors.text,
    fontVariant: ['tabular-nums'],
  },
  metricAmountPositive: {
    color: MoloColors.success,
  },
  monthRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  monthChip: {
    width: 120,
    minHeight: 70,
    borderRadius: MoloRadius.tile,
    padding: Spacing.two,
    justifyContent: 'space-between',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  monthChipActive: {
    backgroundColor: MoloColors.text,
  },
  monthText: {
    color: MoloColors.textMuted,
  },
  monthTextActive: {
    color: MoloColors.canvas,
  },
  monthValue: {
    color: MoloColors.text,
    fontVariant: ['tabular-nums'],
  },
  monthValueActive: {
    color: MoloColors.canvas,
    fontVariant: ['tabular-nums'],
  },
  quickAddCard: {
    gap: Spacing.three,
  },
  formTabs: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  formTab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelSoft,
  },
  formTabActive: {
    backgroundColor: MoloColors.text,
  },
  formTabText: {
    color: MoloColors.textMuted,
  },
  formTabTextActive: {
    color: MoloColors.canvas,
  },
  input: {
    minHeight: 54,
    borderRadius: MoloRadius.tile,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: MoloColors.text,
    backgroundColor: MoloColors.canvasSoft,
  },
});
