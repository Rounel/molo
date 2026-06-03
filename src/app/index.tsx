import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton, MoloCard, SectionHeader } from '@/components/molo-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
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

const purpleGradient = {
  experimental_backgroundImage: 'linear-gradient(145deg, #C9BD80 0%, #A28F49 52%, #50412C 100%)',
} as ViewStyle;

const goldGradient = {
  experimental_backgroundImage: 'linear-gradient(135deg, rgba(250,234,253,0.95), rgba(157,41,162,0.18))',
} as ViewStyle;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [entries, setEntries] = useState(initialEntries);
  const [activeMonth, setActiveMonth] = useState(5);
  const [entryName, setEntryName] = useState('Gombo');
  const [entryAmount, setEntryAmount] = useState('75000');
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');

  const summaries = useMemo(() => buildMonthlySummaries(entries, budgetColumns), [entries]);
  const current = summaries[activeMonth];
  const laptopAdvice = getPurchaseAdvice(plannedPurchases[0], summaries);
  const savingsRate = current.income > 0 ? Math.round((current.savings / current.income) * 100) : 0;
  const isTablet = width >= 720;
  const shellWidth = isTablet ? 520 : 390;
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
      <View style={styles.backgroundTop} />
      <View style={styles.backgroundGlowOne} />
      <View style={styles.backgroundGlowTwo} />

      <ThemedView style={[styles.phoneSurface, { maxWidth: shellWidth }]}>
        <View style={styles.header}>
          <View>
            <ThemedText type="small" style={styles.headerMuted}>
              Salut,
            </ThemedText>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Paul!
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.avatar}>
              <ThemedText type="smallBold" style={styles.avatarText}>
                P
              </ThemedText>
            </View>
            <Pressable style={styles.settingsButton}>
              <ThemedText type="smallBold" style={styles.settingsText}>
                :
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={[styles.portfolioCard, purpleGradient]}>
          <View style={styles.cardShine} />
          <View style={styles.portfolioHeader}>
            <ThemedText type="small" style={styles.cardMuted}>
              Ton budget
            </ThemedText>
            <ThemedText type="small" style={styles.cardMuted}>
              {monthNames[activeMonth]} 2026
            </ThemedText>
          </View>
          <ThemedText type="small" style={styles.cardMuted}>
            Solde mensuel
          </ThemedText>
          <ThemedText type="title" style={styles.balance}>
            {formatMoney(current.balance)}
          </ThemedText>
          <View style={styles.monthBadge}>
            <ThemedText type="smallBold" style={styles.monthBadgeText}>
              +{savingsRate}% epargne
            </ThemedText>
          </View>
        </View>

        <View style={styles.quickActions}>
          <RoundAction label="Revenu" icon="+" onPress={() => setEntryType('income')} />
          <RoundAction label="Depense" icon="-" onPress={() => setEntryType('expense')} />
          <RoundAction label="Objectif" icon="%" onPress={() => setActiveMonth(8)} />
          <RoundAction label="Plus" icon="v" onPress={() => setActiveMonth((value) => (value + 1) % 12)} />
        </View>

        <View style={[styles.assistantBanner, purpleGradient]}>
          <View style={styles.assistantIcon}>
            <ThemedText type="smallBold" style={styles.assistantIconText}>
              AI
            </ThemedText>
          </View>
          <View style={styles.assistantCopy}>
            <ThemedText type="smallBold" style={styles.invertedText}>
              Assistant Molo
            </ThemedText>
            <ThemedText type="small" style={styles.bannerMuted}>
              Achat confortable en {monthNames[laptopAdvice.recommendedMonth]}
            </ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.bannerArrow}>
            &gt;
          </ThemedText>
        </View>

        <View style={styles.menuPanel}>
          <MenuRow title="Revenus du mois" detail={formatMoney(current.income)} icon="+" />
          <MenuRow title="Depenses suivies" detail={formatMoney(current.expenses)} icon="-" />
          <MenuRow title="Epargne prevue" detail={formatMoney(current.savings)} icon="%" />
        </View>

        <SectionHeader title="Mois budgetaire" detail="Apercu rapide du tableau." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthRail}>
          {summaries.map((summary) => (
            <Pressable
              key={summary.month}
              onPress={() => setActiveMonth(summary.month)}
              style={[styles.monthChip, activeMonth === summary.month && styles.monthChipActive]}>
              <ThemedText
                type="smallBold"
                style={activeMonth === summary.month ? styles.activeMonthText : styles.inactiveText}>
                {monthNames[summary.month]}
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.mono, activeMonth === summary.month ? styles.activeMonthText : styles.inactiveText]}>
                {formatMoney(summary.balance)}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <MoloCard style={styles.quickAddCard}>
          <View style={styles.segmented}>
            <Pressable
              onPress={() => setEntryType('income')}
              style={[styles.segment, entryType === 'income' && styles.segmentActive]}>
              <ThemedText
                type="smallBold"
                style={entryType === 'income' ? styles.activeMonthText : styles.inactiveText}>
                Revenu
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setEntryType('expense')}
              style={[styles.segment, entryType === 'expense' && styles.segmentActive]}>
              <ThemedText
                type="smallBold"
                style={entryType === 'expense' ? styles.activeMonthText : styles.inactiveText}>
                Depense
              </ThemedText>
            </Pressable>
          </View>
          <View style={isTablet ? styles.formRow : styles.formStack}>
            <TextInput
              value={entryName}
              onChangeText={setEntryName}
              placeholder="Nom"
              placeholderTextColor="#9D29A2"
              style={[styles.input, isTablet && styles.inputFlex]}
            />
            <TextInput
              value={entryAmount}
              onChangeText={setEntryAmount}
              placeholder="Montant FCFA"
              placeholderTextColor="#9D29A2"
              inputMode="numeric"
              style={[styles.input, isTablet && styles.inputFlex]}
            />
          </View>
          <ActionButton label="Ajouter au budget" onPress={addEntry} />
        </MoloCard>

        <SectionHeader title="Derniers mouvements" detail={`${monthEntries.length} lignes actives`} />
        <View style={styles.menuPanel}>
          {monthEntries.slice(0, 4).map((entry) => {
            const column = budgetColumns.find((item) => item.id === entry.columnId);
            const isExpense = column?.impact === 'negative';
            return (
              <MenuRow
                key={entry.id}
                title={entry.name}
                detail={`${isExpense ? '-' : '+'}${formatMoney(entry.amount)}`}
                icon={isExpense ? '-' : '+'}
              />
            );
          })}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

function RoundAction({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.roundAction}>
      <View style={[styles.roundActionIcon, goldGradient]}>
        <ThemedText type="smallBold" style={styles.roundActionIconText}>
          {icon}
        </ThemedText>
      </View>
      <ThemedText type="small" style={styles.roundActionLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function MenuRow({ title, detail, icon }: { title: string; detail: string; icon: string }) {
  return (
    <Pressable style={styles.menuRow}>
      <View style={styles.menuIcon}>
        <ThemedText type="smallBold" style={styles.menuIconText}>
          {icon}
        </ThemedText>
      </View>
      <View style={styles.menuText}>
        <ThemedText type="smallBold" style={styles.menuTitle}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={styles.menuDetail}>
          {detail}
        </ThemedText>
      </View>
      <ThemedText type="smallBold" style={styles.menuArrow}>
        &gt;
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#A28F49',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    minHeight: '100%',
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 310,
    backgroundColor: '#DCD6AF',
  },
  backgroundGlowOne: {
    position: 'absolute',
    top: 88,
    right: -48,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(238, 178, 245, 0.26)',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    top: 220,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(220, 214, 175, 0.18)',
  },
  phoneSurface: {
    width: '100%',
    borderRadius: 30,
    padding: Spacing.three,
    gap: Spacing.three,
    backgroundColor: '#F8F7EE',
    boxShadow: '0 24px 60px rgba(71, 10, 72, 0.24)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerMuted: {
    color: '#6C226D',
  },
  headerTitle: {
    color: '#470A48',
    fontSize: 25,
    lineHeight: 30,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDEAD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#470A48',
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F4D4FA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  settingsText: {
    color: '#470A48',
    transform: [{ rotate: '90deg' }],
  },
  portfolioCard: {
    minHeight: 148,
    borderRadius: 18,
    padding: Spacing.three,
    overflow: 'hidden',
    gap: Spacing.one,
  },
  cardShine: {
    position: 'absolute',
    right: -28,
    bottom: -54,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(253, 245, 254, 0.16)',
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cardMuted: {
    color: '#F8F7EE',
    opacity: 0.82,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
  },
  monthBadge: {
    alignSelf: 'flex-end',
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4D4FA',
  },
  monthBadgeText: {
    color: '#6C226D',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  roundAction: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.two,
  },
  roundActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEAD5',
  },
  roundActionIconText: {
    color: '#470A48',
    fontSize: 18,
  },
  roundActionLabel: {
    color: '#470A48',
    textAlign: 'center',
  },
  assistantBanner: {
    minHeight: 76,
    borderRadius: 16,
    padding: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  assistantIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAEAFD',
  },
  assistantIconText: {
    color: '#470A48',
  },
  assistantCopy: {
    flex: 1,
  },
  invertedText: {
    color: '#FFFFFF',
  },
  bannerMuted: {
    color: '#F8F7EE',
    opacity: 0.82,
  },
  bannerArrow: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  menuPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEAD5',
  },
  menuRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEAD5',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAEAFD',
  },
  menuIconText: {
    color: '#470A48',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    color: '#470A48',
  },
  menuDetail: {
    color: '#822385',
  },
  menuArrow: {
    color: '#6C226D',
  },
  monthRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  monthChip: {
    width: 118,
    minHeight: 68,
    borderRadius: 16,
    padding: Spacing.two,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEAD5',
  },
  monthChipActive: {
    backgroundColor: '#50412C',
    borderColor: '#50412C',
  },
  activeMonthText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#470A48',
  },
  mono: {
    fontVariant: ['tabular-nums'],
  },
  quickAddCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EDEAD5',
    gap: Spacing.three,
  },
  segmented: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  segment: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAEAFD',
  },
  segmentActive: {
    backgroundColor: '#50412C',
  },
  formStack: {
    gap: Spacing.two,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F4D4FA',
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: '#470A48',
    backgroundColor: '#FAEAFD',
  },
  inputFlex: {
    flex: 1,
  },
});
