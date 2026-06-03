import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoloCard, SectionHeader } from '@/components/molo-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { formatMoney, monthNames, plannedPurchases, type PlannedPurchase } from '@/lib/budget';

const purpleGradient = {
  experimental_backgroundImage: 'linear-gradient(145deg, #C9BD80 0%, #A28F49 54%, #50412C 100%)',
} as ViewStyle;

const purchaseCategories: Record<string, string> = {
  laptop: 'Travail',
  phone: 'Mobile',
  trip: 'Voyage',
};

export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 720;
  const shellWidth = isTablet ? 560 : 390;
  const pendingPurchases = useMemo(
    () => plannedPurchases.filter((purchase) => purchase.status !== 'realise'),
    [],
  );
  const total = pendingPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const nextPurchase = pendingPurchases
    .slice()
    .sort((a, b) => a.desiredMonth - b.desiredMonth || b.amount - a.amount)[0];

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
              A planifier
            </ThemedText>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Liste de courses
            </ThemedText>
          </View>
          <View style={styles.countBadge}>
            <ThemedText type="smallBold" style={styles.countBadgeText}>
              {pendingPurchases.length}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.totalCard, purpleGradient]}>
          <View style={styles.cardShine} />
          <ThemedText type="small" style={styles.cardMuted}>
            Cout total des achats
          </ThemedText>
          <ThemedText type="title" style={styles.totalAmount}>
            {formatMoney(total)}
          </ThemedText>
          <View style={styles.totalFooter}>
            <View>
              <ThemedText type="small" style={styles.cardMuted}>
                Prochain achat
              </ThemedText>
              <ThemedText type="smallBold" style={styles.invertedText}>
                {nextPurchase.name} en {monthNames[nextPurchase.desiredMonth]}
              </ThemedText>
            </View>
            <View style={styles.totalPill}>
              <ThemedText type="smallBold" style={styles.totalPillText}>
                {formatMoney(nextPurchase.amount)}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.monthStrip}>
          {buildMonthBuckets(pendingPurchases).map((bucket) => (
            <View key={bucket.month} style={styles.monthBucket}>
              <ThemedText type="smallBold" style={styles.monthBucketMonth}>
                {monthNames[bucket.month]}
              </ThemedText>
              <ThemedText type="small" style={styles.monthBucketAmount}>
                {formatMoney(bucket.total)}
              </ThemedText>
            </View>
          ))}
        </View>

        <SectionHeader title="Articles a acheter" detail="Chaque ligne indique le mois prevu." />
        <View style={styles.listPanel}>
          {pendingPurchases.map((purchase) => (
            <PurchaseRow key={purchase.id} purchase={purchase} />
          ))}
        </View>

        <MoloCard style={styles.tipCard}>
          <ThemedText type="smallBold" style={styles.tipTitle}>
            Conseil budget
          </ThemedText>
          <ThemedText type="small" style={styles.tipText}>
            Commence par les achats haute priorite et reporte ceux qui font passer ton solde sous
            ta marge de securite.
          </ThemedText>
        </MoloCard>
      </ThemedView>
    </ScrollView>
  );
}

function PurchaseRow({ purchase }: { purchase: PlannedPurchase }) {
  const statusLabel = purchase.status === 'risque' ? 'Risque' : purchase.status === 'possible' ? 'Possible' : 'Prevu';

  return (
    <Pressable style={styles.purchaseRow}>
      <View style={styles.purchaseIcon}>
        <ThemedText type="smallBold" style={styles.purchaseIconText}>
          {purchase.name.slice(0, 1)}
        </ThemedText>
      </View>
      <View style={styles.purchaseMain}>
        <ThemedText type="smallBold" style={styles.purchaseName}>
          {purchase.name}
        </ThemedText>
        <ThemedText type="small" style={styles.purchaseMeta}>
          {purchaseCategories[purchase.id] ?? 'Achat'} - {monthNames[purchase.desiredMonth]} - priorite{' '}
          {purchase.priority}
        </ThemedText>
      </View>
      <View style={styles.purchaseSide}>
        <ThemedText type="smallBold" style={styles.purchaseAmount}>
          {formatMoney(purchase.amount)}
        </ThemedText>
        <View style={[styles.statusPill, purchase.status === 'risque' && styles.statusPillRisk]}>
          <ThemedText
            type="smallBold"
            style={[styles.statusText, purchase.status === 'risque' && styles.statusTextRisk]}>
            {statusLabel}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

function buildMonthBuckets(purchases: PlannedPurchase[]) {
  const buckets = new Map<number, number>();
  purchases.forEach((purchase) => {
    buckets.set(purchase.desiredMonth, (buckets.get(purchase.desiredMonth) ?? 0) + purchase.amount);
  });

  return Array.from(buckets.entries())
    .sort(([monthA], [monthB]) => monthA - monthB)
    .map(([month, total]) => ({ month, total }));
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
    top: 72,
    left: -54,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(238, 178, 245, 0.24)',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    top: 230,
    right: -48,
    width: 150,
    height: 150,
    borderRadius: 75,
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
  countBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EDEAD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    color: '#470A48',
  },
  totalCard: {
    minHeight: 170,
    borderRadius: 18,
    padding: Spacing.three,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardShine: {
    position: 'absolute',
    right: -36,
    bottom: -52,
    width: 154,
    height: 154,
    borderRadius: 77,
    backgroundColor: 'rgba(253, 245, 254, 0.16)',
  },
  cardMuted: {
    color: '#F8F7EE',
    opacity: 0.82,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 38,
  },
  totalFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  invertedText: {
    color: '#FFFFFF',
  },
  totalPill: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4D4FA',
  },
  totalPillText: {
    color: '#6C226D',
  },
  monthStrip: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  monthBucket: {
    flex: 1,
    minHeight: 74,
    borderRadius: 16,
    padding: Spacing.two,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEAD5',
  },
  monthBucketMonth: {
    color: '#470A48',
  },
  monthBucketAmount: {
    color: '#470A48',
    fontVariant: ['tabular-nums'],
  },
  listPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEAD5',
  },
  purchaseRow: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEAD5',
  },
  purchaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAEAFD',
  },
  purchaseIconText: {
    color: '#470A48',
  },
  purchaseMain: {
    flex: 1,
    gap: 2,
  },
  purchaseName: {
    color: '#470A48',
  },
  purchaseMeta: {
    color: '#822385',
  },
  purchaseSide: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  purchaseAmount: {
    color: '#470A48',
    fontVariant: ['tabular-nums'],
  },
  statusPill: {
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4D4FA',
  },
  statusPillRisk: {
    backgroundColor: '#EDEAD5',
  },
  statusText: {
    color: '#6C226D',
    fontSize: 12,
  },
  statusTextRisk: {
    color: '#50412C',
  },
  tipCard: {
    backgroundColor: '#FAEAFD',
    borderColor: '#F4D4FA',
  },
  tipTitle: {
    color: '#470A48',
  },
  tipText: {
    color: '#6C226D',
  },
});
