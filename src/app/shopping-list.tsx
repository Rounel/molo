import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MoloCard } from '@/components/molo-card';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import { formatMoney, monthNames, plannedPurchases, type PlannedPurchase } from '@/lib/budget';

const purchaseCategories: Record<string, string> = {
  laptop: 'Travail',
  phone: 'Mobile',
  trip: 'Voyage',
};

export default function ShoppingListScreen() {
  const pendingPurchases = useMemo(
    () => plannedPurchases.filter((purchase) => purchase.status !== 'realise'),
    [],
  );
  const total = pendingPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const nextPurchase = pendingPurchases
    .slice()
    .sort((a, b) => a.desiredMonth - b.desiredMonth || b.amount - a.amount)[0];
  const buckets = buildMonthBuckets(pendingPurchases);

  return (
    <WalletScreen maxTabletWidth={460}>
      <WalletHeader eyebrow="Molo" title="Liste de courses" action={`${pendingPurchases.length} achats`} />

      <View style={[styles.totalCard, MoloGradients.heroDeep]}>
        <View style={styles.totalOrb} />
        <ThemedText type="small" style={styles.cardMuted}>
          Cout total des achats
        </ThemedText>
        <ThemedText type="title" style={styles.totalAmount}>
          {formatMoney(total)}
        </ThemedText>
        <View style={styles.nextRow}>
          <View>
            <ThemedText type="small" style={styles.cardMuted}>
              Prochain achat
            </ThemedText>
            <ThemedText type="smallBold" style={styles.cardText}>
              {nextPurchase.name} en {monthNames[nextPurchase.desiredMonth]}
            </ThemedText>
          </View>
          <View style={styles.amountPill}>
            <ThemedText type="smallBold" style={styles.amountPillText}>
              {formatMoney(nextPurchase.amount)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.monthGrid}>
        {buckets.map((bucket) => (
          <View key={bucket.month} style={styles.monthTile}>
            <ThemedText type="smallBold" style={styles.monthTitle}>
              {monthNames[bucket.month]}
            </ThemedText>
            <ThemedText type="small" style={styles.monthTotal}>
              {formatMoney(bucket.total)}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.segmented}>
        <Pressable style={styles.segmentActive}>
          <ThemedText type="smallBold" style={styles.segmentActiveText}>
            A acheter
          </ThemedText>
        </Pressable>
        <Pressable style={styles.segment}>
          <ThemedText type="smallBold" style={styles.segmentText}>
            Realises
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.listPanel}>
        {pendingPurchases.map((purchase) => (
          <PurchaseRow key={purchase.id} purchase={purchase} />
        ))}
      </View>

      <MoloCard style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <IconBubble label="!" />
          <View style={styles.tipCopy}>
            <ThemedText type="smallBold" style={styles.tipTitle}>
              Priorite budget
            </ThemedText>
            <ThemedText type="small" style={styles.tipText}>
              Achats haute priorite d&apos;abord. Repousse ceux qui descendent sous ta marge de securite.
            </ThemedText>
          </View>
        </View>
      </MoloCard>
    </WalletScreen>
  );
}

function PurchaseRow({ purchase }: { purchase: PlannedPurchase }) {
  const statusLabel = purchase.status === 'risque' ? 'Risque' : purchase.status === 'possible' ? 'Possible' : 'Prevu';

  return (
    <Pressable style={styles.purchaseRow}>
      <IconBubble label={purchase.name.slice(0, 1)} />
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
        <View style={[styles.statusPill, purchase.status === 'risque' && styles.statusRisk]}>
          <ThemedText type="smallBold" style={[styles.statusText, purchase.status === 'risque' && styles.statusTextRisk]}>
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
  totalCard: {
    minHeight: 190,
    borderRadius: MoloRadius.card,
    padding: Spacing.four,
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor: MoloColors.purple900,
    boxShadow: MoloShadow.floating,
  },
  totalOrb: {
    position: 'absolute',
    right: -48,
    bottom: -62,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardMuted: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  cardText: {
    color: MoloColors.text,
  },
  totalAmount: {
    color: MoloColors.text,
    fontSize: 38,
    lineHeight: 46,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  amountPill: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  amountPillText: {
    color: MoloColors.text,
  },
  monthGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  monthTile: {
    flex: 1,
    minHeight: 74,
    borderRadius: MoloRadius.tile,
    padding: Spacing.two,
    justifyContent: 'space-between',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  monthTitle: {
    color: MoloColors.text,
  },
  monthTotal: {
    color: MoloColors.textMuted,
    fontVariant: ['tabular-nums'],
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
  listPanel: {
    borderRadius: MoloRadius.card,
    overflow: 'hidden',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  purchaseRow: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: MoloColors.stroke,
  },
  purchaseMain: {
    flex: 1,
    gap: 2,
  },
  purchaseName: {
    color: MoloColors.text,
  },
  purchaseMeta: {
    color: MoloColors.textMuted,
  },
  purchaseSide: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  purchaseAmount: {
    color: MoloColors.text,
    fontVariant: ['tabular-nums'],
  },
  statusPill: {
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelSoft,
  },
  statusRisk: {
    backgroundColor: '#3A1D29',
  },
  statusText: {
    color: MoloColors.textMuted,
    fontSize: 12,
  },
  statusTextRisk: {
    color: MoloColors.danger,
  },
  tipCard: {
    gap: Spacing.three,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: MoloColors.text,
  },
  tipText: {
    color: MoloColors.textMuted,
  },
});
