import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MoloCard } from '@/components/molo-card';
import { MoloSymbol } from '@/components/molo-symbol';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import { monthNames, plannedPurchases, type PlannedPurchase } from '@/lib/budget';
import { useMoney } from '@/lib/currency';

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
  const money = useMoney();

  return (
    <WalletScreen maxTabletWidth={460}>
      <WalletHeader title="Molo" actionIcon="more" actionHref="/settings" />

      <View style={[styles.totalCard, MoloGradients.heroDeep]}>
        <View style={styles.totalOrb} />
        <View style={styles.cardTopRow}>
          <ThemedText type="subtitle" style={styles.cardTitleLarge}>
            Liste de courses
          </ThemedText>
          <ThemedText type="smallBold" style={styles.cardText}>
            {money(total)}
          </ThemedText>
        </View>
        <View style={styles.nextRow}>
          <View>
            <ThemedText type="small" style={styles.cardMuted}>
              {pendingPurchases.length} achats
            </ThemedText>
            <ThemedText type="smallBold" style={styles.cardText}>
              Prochain: {nextPurchase.name}
            </ThemedText>
          </View>
          <View style={styles.amountPill}>
            <ThemedText type="smallBold" style={styles.amountPillText}>
              {monthNames[nextPurchase.desiredMonth]}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.categoryRail}>
        {['Tous', 'Travail', 'Mobile', 'Voyage'].map((item, index) => (
          <Pressable key={item} style={[styles.categoryChip, index === 0 && styles.categoryChipActive]}>
            <ThemedText type="smallBold" style={index === 0 ? styles.categoryTextActive : styles.categoryText}>
              {item}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionTitleRow}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Articles
        </ThemedText>
        <ThemedText type="small" style={styles.sectionMeta}>
          {pendingPurchases.length} achats
        </ThemedText>
      </View>

      <View style={styles.listPanel}>
        {pendingPurchases.map((purchase) => (
          <PurchaseRow key={purchase.id} purchase={purchase} money={money} />
        ))}
      </View>

      <MoloCard style={styles.checkoutCard}>
        <View style={styles.checkoutTotal}>
          <ThemedText type="small" style={styles.purchaseMeta}>
            Total estime
          </ThemedText>
          <ThemedText type="smallBold" style={styles.segmentActiveText}>
            {money(total)}
          </ThemedText>
        </View>
        <Pressable style={[styles.validateButton, MoloGradients.purpleButton]}>
          <ThemedText type="smallBold" style={styles.validateText}>
            Valider la liste
          </ThemedText>
        </Pressable>
      </MoloCard>

      <MoloCard style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <IconBubble icon="ai" active />
          <View style={styles.tipCopy}>
            <ThemedText type="smallBold" style={styles.tipTitle}>
              Priorite budget
            </ThemedText>
            <ThemedText type="small" style={styles.tipText}>
              Molo recommande de garder au moins un mois de marge avant de valider un achat risque.
            </ThemedText>
          </View>
        </View>
      </MoloCard>
    </WalletScreen>
  );
}

function PurchaseRow({
  money,
  purchase,
}: {
  money: (amountXof: number) => string;
  purchase: PlannedPurchase;
}) {
  return (
    <Pressable style={styles.purchaseRow}>
      <IconBubble label={purchase.name.slice(0, 1)} active={purchase.status === 'possible'} />
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
          {money(purchase.amount)}
        </ThemedText>
        <View style={[styles.statusCircle, purchase.status === 'risque' && styles.statusCircleRisk]}>
          <MoloSymbol
            name="check"
            size={16}
            color={purchase.status === 'risque' ? MoloColors.danger : MoloColors.textMuted}
          />
        </View>
      </View>
    </Pressable>
  );
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
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
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cardTitleLarge: {
    color: MoloColors.text,
    fontSize: 28,
    lineHeight: 34,
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
  categoryRail: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  categoryChip: {
    minHeight: 40,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panelRaised,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  categoryChipActive: {
    backgroundColor: MoloColors.purple700,
    borderColor: MoloColors.purple500,
  },
  categoryText: {
    color: MoloColors.textMuted,
  },
  categoryTextActive: {
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
  segmentActiveText: {
    color: MoloColors.text,
  },
  listPanel: {
    borderRadius: MoloRadius.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(18, 20, 31, 0.88)',
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  purchaseRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
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
    flexDirection: 'row',
    gap: Spacing.two,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  purchaseAmount: {
    color: MoloColors.text,
    fontVariant: ['tabular-nums'],
  },
  statusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MoloColors.textFaint,
  },
  statusCircleRisk: {
    borderColor: MoloColors.danger,
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
  checkoutCard: {
    gap: Spacing.three,
  },
  checkoutTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  validateButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.purple700,
    boxShadow: MoloShadow.glow,
  },
  validateText: {
    color: MoloColors.text,
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
