import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoloSymbol, type MoloSymbolName } from '@/components/molo-symbol';
import { ThemedText } from '@/components/themed-text';
import { MoloColors, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import { budgetColumns, buildMonthlySummaries, initialEntries, monthNames, plannedPurchases, type BudgetColumn } from '@/lib/budget';
import { useMoney } from '@/lib/currency';

const currentMonth = new Date().getMonth();

const defaultRows: { id: string; label: string; icon: MoloSymbolName }[] = [
  { id: 'salary', label: 'Salaire mensuel professionnel', icon: 'income' },
  { id: 'passive', label: 'Revenus passifs attendus', icon: 'income' },
  { id: 'fixed', label: 'Dépenses fixes', icon: 'expense' },
  { id: 'variable', label: 'Dépenses variables', icon: 'expense' },
  { id: 'surprise', label: 'Dépenses surprises', icon: 'expense' },
  { id: 'savings', label: 'Épargne prévue', icon: 'saving' },
  { id: 'balance', label: 'Solde mensuel', icon: 'budget' },
  { id: 'annualBalance', label: 'Solde annuel', icon: 'calendar' },
  { id: 'cumulativeBalance', label: 'Solde total cumulé', icon: 'saving' },
  { id: 'plannedPurchases', label: 'Achats planifiés', icon: 'cart' },
];

export default function DashboardScreen() {
  const [activeMonth, setActiveMonth] = useState(currentMonth);
  const money = useMoney();
  const insets = useSafeAreaInsets();
  const summaries = useMemo(() => buildMonthlySummaries(initialEntries, budgetColumns), []);
  const current = summaries[activeMonth];
  const monthEntries = useMemo(
    () => initialEntries.filter((entry) => entry.month === activeMonth || entry.recurrence === 'monthly'),
    [activeMonth],
  );
  const customColumns = budgetColumns.filter((column) => !column.isDefault);

  function amountForColumn(column: BudgetColumn) {
    return monthEntries.filter((entry) => entry.columnId === column.id).reduce((total, entry) => total + entry.amount, 0);
  }

  function amountForRow(id: string) {
    if (id === 'balance') return current.balance;
    if (id === 'annualBalance') return current.annualBalance;
    if (id === 'cumulativeBalance') return current.cumulativeBalance;
    if (id === 'plannedPurchases') {
      return plannedPurchases.filter((purchase) => purchase.desiredMonth === activeMonth).reduce((total, purchase) => total + purchase.amount, 0);
    }
    const column = budgetColumns.find((item) => item.id === id);
    return column ? amountForColumn(column) : 0;
  }

  const savingsNow = summaries[currentMonth]?.cumulativeBalance ?? 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.three }]}>
          <View style={styles.heroGlow} />
          <View style={styles.header}>
            <View>
              <ThemedText type="small" style={styles.greeting}>Bonjour,</ThemedText>
              <ThemedText type="subtitle" style={styles.userName}>Bienvenue sur Molo</ThemedText>
            </View>
            <View style={styles.headerActions}>
              <HeaderAction icon="search" />
              <HeaderAction icon="bell" />
            </View>
          </View>

          <View style={styles.savingsBlock}>
            <ThemedText type="small" style={styles.savingsLabel}>Épargne actuelle</ThemedText>
            <ThemedText selectable type="title" style={styles.savingsAmount}>{money(savingsNow)}</ThemedText>
            <View style={styles.savingsHint}>
              <View style={styles.savingsHintDot} />
              <ThemedText type="smallBold" style={styles.savingsHintText}>Votre réserve financière</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.contentSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <ThemedText type="subtitle" style={styles.sheetTitle}>Vue {monthNames[activeMonth]}</ThemedText>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthRail}>
            {summaries.map((summary) => {
              const isActive = activeMonth === summary.month;
              return (
                <Pressable key={summary.month} accessibilityRole="button" accessibilityState={{ selected: isActive }} onPress={() => setActiveMonth(summary.month)} style={({ pressed }) => [styles.monthChip, isActive && styles.monthChipActive, pressed && styles.pressed]}>
                  <ThemedText type="smallBold" style={isActive ? styles.monthTextActive : styles.monthText}>{monthNames[summary.month]}</ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.metricList}>
            {defaultRows.map((row) => (
              <BudgetRow key={row.id} icon={row.icon} title={row.label} value={money(amountForRow(row.id))} tone={row.id === 'balance' || row.id === 'annualBalance' || row.id === 'cumulativeBalance' ? 'highlight' : 'default'} />
            ))}
            {customColumns.map((column) => (
              <BudgetRow key={column.id} icon={column.impact === 'negative' ? 'expense' : 'income'} title={column.name} value={money(amountForColumn(column))} tone="custom" />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function HeaderAction({ icon }: { icon: MoloSymbolName }) {
  return <Pressable accessibilityRole="button" style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}><MoloSymbol name={icon} size={20} color={MoloColors.jagger50} /></Pressable>;
}

function BudgetRow({ icon, title, value, tone }: { icon: MoloSymbolName; title: string; value: string; tone: 'default' | 'highlight' | 'custom' }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Voir le détail de ${title}`} style={({ pressed }) => [styles.metricRow, pressed && styles.pressed]}>
      <View style={[styles.rowIcon, tone === 'highlight' && styles.rowIconHighlight, tone === 'custom' && styles.rowIconCustom]}><MoloSymbol name={icon} size={19} color={tone === 'highlight' ? MoloColors.jagger700 : MoloColors.jagger800} /></View>
      <ThemedText type="smallBold" style={styles.rowTitle} numberOfLines={1}>{title}</ThemedText>
      <ThemedText selectable type="smallBold" style={[styles.rowValue, tone === 'highlight' && styles.rowValueHighlight]}>{value}</ThemedText>
      <MoloSymbol name="chevronRight" size={20} color={MoloColors.jagger300} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: MoloColors.jagger950 },
  scrollContent: { backgroundColor: MoloColors.jagger950 },
  hero: { minHeight: 318, paddingHorizontal: 20, paddingBottom: 64, backgroundColor: MoloColors.jagger950, overflow: 'hidden' },
  heroGlow: { position: 'absolute', width: 310, height: 310, right: -115, bottom: -118, borderRadius: 155, backgroundColor: MoloColors.jagger700, opacity: 0.56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  greeting: { color: MoloColors.jagger200 }, userName: { color: MoloColors.jagger50, fontSize: 22, lineHeight: 28 }, headerActions: { flexDirection: 'row', gap: 10 },
  headerAction: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.16)' },
  savingsBlock: { marginTop: 47, gap: Spacing.one }, savingsLabel: { color: MoloColors.jagger200, fontSize: 16 },
  savingsAmount: { color: MoloColors.jagger50, fontSize: 42, lineHeight: 50, fontVariant: ['tabular-nums'] },
  savingsHint: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 7 }, savingsHintDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8DE6C2' }, savingsHintText: { color: MoloColors.jagger100 },
  contentSheet: { marginTop: -31, minHeight: 680, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 145, backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetHandle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 2, backgroundColor: MoloColors.jagger200 },
  sheetHeader: { marginTop: 22, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.two }, sheetTitle: { color: MoloColors.jagger950, fontSize: 24, lineHeight: 30 }, sheetSubtitle: { marginTop: 2, color: '#7A7185' },
  monthBadge: { paddingHorizontal: 12, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: MoloColors.jagger100 }, monthBadgeText: { color: MoloColors.jagger700 },
  monthRail: { gap: 8, paddingVertical: 24, paddingRight: 18 }, monthChip: { minWidth: 54, height: 38, paddingHorizontal: 12, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: MoloColors.jagger50 }, monthChipActive: { backgroundColor: MoloColors.jagger700, boxShadow: MoloShadow.glow }, monthText: { color: MoloColors.jagger700 }, monthTextActive: { color: MoloColors.jagger50 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }, listHeaderText: { color: '#8D8497', fontSize: 11, letterSpacing: 0.7 }, listHeaderCount: { color: '#8D8497' },
  metricList: { borderRadius: MoloRadius.card, overflow: 'hidden' },
  metricRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 0, borderBottomWidth: 1, borderBottomColor: MoloColors.jagger100 },
  rowIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: MoloColors.jagger50 }, rowIconHighlight: { backgroundColor: MoloColors.jagger100 }, rowIconCustom: { backgroundColor: '#F7F0FF' }, rowTitle: { flex: 1, color: MoloColors.jagger950, fontSize: 13 }, rowValue: { color: '#5D5369', fontSize: 12, fontVariant: ['tabular-nums'] }, rowValueHighlight: { color: MoloColors.jagger700 }, pressed: { opacity: 0.68 },
});
