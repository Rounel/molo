import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ActionButton, MoloCard } from '@/components/molo-card';
import { MoloSymbol } from '@/components/molo-symbol';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import {
  buildMonthlySummaries,
  budgetColumns,
  getPurchaseAdvice,
  initialEntries,
  monthNames,
  plannedPurchases,
} from '@/lib/budget';
import { useMoney } from '@/lib/currency';

const voiceCommands = [
  {
    id: 'repair',
    text: 'Ajoute une depense surprise de 25 000 FCFA pour reparation moto ce mois-ci.',
    intent: 'Depense',
    summary: 'Depense surprise de 25 000 FCFA prete a confirmer.',
  },
  {
    id: 'freelance',
    text: "J'ai recu 100 000 FCFA d'une mission freelance.",
    intent: 'Revenu',
    summary: 'Revenu freelance de 100 000 FCFA pret a confirmer.',
  },
  {
    id: 'phone',
    text: 'Prevois un achat telephone de 300 000 FCFA en aout.',
    intent: 'Achat',
    summary: 'Achat telephone de 300 000 FCFA planifie pour aout.',
  },
];

export default function AssistantScreen() {
  const [selectedCommand, setSelectedCommand] = useState(voiceCommands[0]);
  const [confirmed, setConfirmed] = useState(false);
  const [question, setQuestion] = useState('Quand puis-je acheter un ordinateur a 800 000 FCFA ?');
  const money = useMoney();
  const summaries = useMemo(() => buildMonthlySummaries(initialEntries, budgetColumns), []);
  const laptopAdvice = getPurchaseAdvice(plannedPurchases[0], summaries);

  return (
    <WalletScreen maxTabletWidth={460}>
      <WalletHeader title="Molo" actionIcon="more" actionHref="/settings" />

      <View style={[styles.recorderCard, MoloGradients.hero]}>
        <View style={styles.waveOne} />
        <View style={styles.waveTwo} />
        <ThemedText type="subtitle" style={styles.recorderTitle}>
          Assistant IA
        </ThemedText>
        <ThemedText type="smallBold" style={styles.recorderLead}>
          Parle, Molo prepare l&apos;action.
        </ThemedText>
        <ThemedText type="small" style={styles.recorderDetail}>
          La modification reste en attente tant que tu ne confirmes pas.
        </ThemedText>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="smallBold" style={styles.cardTitle}>
          Commandes vocales
        </ThemedText>
        <ThemedText type="small" style={styles.cardMeta}>
          Aucune modification sans validation.
        </ThemedText>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.commandRail}>
        {voiceCommands.map((command) => (
          <Pressable
            key={command.id}
            onPress={() => {
              setSelectedCommand(command);
              setConfirmed(false);
            }}
            style={[styles.commandChip, selectedCommand.id === command.id && styles.commandChipActive]}>
            <ThemedText
              type="smallBold"
              style={selectedCommand.id === command.id ? styles.commandTextActive : styles.commandText}>
              {command.id === 'repair'
                ? 'create_expense'
                : command.id === 'freelance'
                  ? 'create_income'
                  : 'create_purchase'}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <MoloCard style={styles.transcriptionCard}>
        <ThemedText type="small" style={styles.cardMeta}>
          Transcription
        </ThemedText>
        <ThemedText type="smallBold" style={styles.transcriptionText}>
          {selectedCommand.text}
        </ThemedText>
        <View style={[styles.proposalBox, MoloGradients.heroDeep]}>
          <View style={styles.proposalCopy}>
            <ThemedText type="smallBold" style={styles.cardTitle}>
              Action proposee
            </ThemedText>
            <ThemedText type="small" style={styles.cardMeta}>
              {selectedCommand.summary}
            </ThemedText>
          </View>
        </View>
        {confirmed ? (
          <View style={styles.confirmedBox}>
            <ThemedText type="smallBold" style={styles.confirmedText}>
              Action confirmee. Elle sera appliquee via l&apos;API.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.actions}>
            <ActionButton label="Confirmer" onPress={() => setConfirmed(true)} />
            <ActionButton label="Modifier" variant="secondary" onPress={() => setConfirmed(false)} />
          </View>
        )}
      </MoloCard>

      <MoloCard style={styles.voiceInputCard}>
        <View style={styles.waveMeter}>
          {Array.from({ length: 28 }).map((_, index) => (
            <View key={index} style={[styles.waveBar, { height: 8 + (index % 5) * 3 }]} />
          ))}
        </View>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Parle ou ecris ta commande..."
          placeholderTextColor={MoloColors.textFaint}
          style={styles.voiceInput}
        />
        <Pressable style={[styles.micButton, MoloGradients.purpleButton]} onPress={() => setConfirmed(false)}>
          <MoloSymbol name="mic" size={20} />
        </Pressable>
      </MoloCard>

      <MoloCard style={styles.adviceCard}>
        <View style={styles.cardHeaderRow}>
          <IconBubble icon="ai" active />
          <View style={styles.proposalCopy}>
            <ThemedText type="smallBold" style={styles.cardTitle}>
              Conseil d&apos;achat
            </ThemedText>
            <ThemedText type="small" style={styles.cardMeta}>
              Tu peux viser {monthNames[laptopAdvice.recommendedMonth]} pour l&apos;ordinateur. Mets de cote{' '}
              {money(laptopAdvice.monthlySaving)} par mois pour garder une marge.
            </ThemedText>
          </View>
        </View>
      </MoloCard>
    </WalletScreen>
  );
}

const styles = StyleSheet.create({
  recorderCard: {
    minHeight: 204,
    borderRadius: MoloRadius.card,
    padding: Spacing.four,
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: MoloColors.purple900,
    boxShadow: MoloShadow.floating,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  recorderTitle: {
    color: MoloColors.text,
    fontSize: 29,
    lineHeight: 36,
  },
  recorderLead: {
    color: MoloColors.text,
  },
  recorderDetail: {
    color: 'rgba(255, 255, 255, 0.75)',
    maxWidth: 250,
    lineHeight: 21,
  },
  waveOne: {
    position: 'absolute',
    right: -10,
    bottom: 28,
    width: 180,
    height: 74,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    transform: [{ rotate: '-16deg' }],
  },
  waveTwo: {
    position: 'absolute',
    right: -20,
    bottom: 20,
    width: 210,
    height: 54,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(208, 67, 221, 0.42)',
    transform: [{ rotate: '-12deg' }],
  },
  sectionHeader: {
    gap: Spacing.half,
  },
  commandRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  commandChip: {
    minHeight: 46,
    minWidth: 120,
    borderRadius: 23,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  commandChipActive: {
    backgroundColor: MoloColors.purple700,
    borderColor: MoloColors.purple500,
  },
  commandText: {
    color: MoloColors.textMuted,
  },
  commandTextActive: {
    color: MoloColors.text,
  },
  transcriptionCard: {
    gap: Spacing.three,
    backgroundColor: 'rgba(18, 20, 31, 0.90)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cardTitle: {
    color: MoloColors.text,
  },
  cardMeta: {
    color: MoloColors.textMuted,
  },
  transcriptionText: {
    color: MoloColors.text,
    lineHeight: 23,
    fontSize: 16,
  },
  proposalBox: {
    minHeight: 156,
    borderRadius: MoloRadius.tile,
    padding: Spacing.three,
    justifyContent: 'space-between',
    backgroundColor: MoloColors.purple950,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  proposalCopy: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  confirmedBox: {
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#162A27',
    borderWidth: 1,
    borderColor: '#21463D',
    paddingHorizontal: Spacing.three,
  },
  confirmedText: {
    color: MoloColors.success,
  },
  adviceCard: {
    gap: Spacing.three,
  },
  voiceInputCard: {
    minHeight: 76,
    borderRadius: MoloRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(18, 20, 31, 0.92)',
  },
  waveMeter: {
    width: 104,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  waveBar: {
    width: 2,
    borderRadius: 2,
    backgroundColor: MoloColors.purple700,
    opacity: 0.75,
  },
  voiceInput: {
    flex: 1,
    color: MoloColors.text,
    fontSize: 14,
  },
  micButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.purple700,
    boxShadow: MoloShadow.glow,
  },
  endpointText: {
    color: MoloColors.text,
  },
});
