import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ActionButton, MoloCard } from '@/components/molo-card';
import { ThemedText } from '@/components/themed-text';
import { IconBubble, WalletHeader, WalletScreen } from '@/components/wallet-screen';
import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';
import {
  buildMonthlySummaries,
  budgetColumns,
  formatMoney,
  getPurchaseAdvice,
  initialEntries,
  monthNames,
  plannedPurchases,
} from '@/lib/budget';

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
  const summaries = useMemo(() => buildMonthlySummaries(initialEntries, budgetColumns), []);
  const laptopAdvice = getPurchaseAdvice(plannedPurchases[0], summaries);

  return (
    <WalletScreen maxTabletWidth={460}>
      <WalletHeader eyebrow="Molo IA" title="Assistant vocal" action="Validation" />

      <View style={[styles.recorderCard, MoloGradients.hero]}>
        <View style={styles.recorderTop}>
          <IconBubble label="AI" large />
          <View style={styles.recorderCopy}>
            <ThemedText type="subtitle" style={styles.recorderTitle}>
              Parle, Molo prepare l&apos;action.
            </ThemedText>
            <ThemedText type="small" style={styles.recorderDetail}>
              Rien n&apos;est applique sans confirmation.
            </ThemedText>
          </View>
        </View>
        <ActionButton label="Simuler une transcription" variant="secondary" onPress={() => setConfirmed(false)} />
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
              {command.intent}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <MoloCard style={styles.transcriptionCard}>
        <View style={styles.cardHeaderRow}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Transcription
          </ThemedText>
          <ThemedText type="small" style={styles.cardMeta}>
            audio simule
          </ThemedText>
        </View>
        <ThemedText type="smallBold" style={styles.transcriptionText}>
          {selectedCommand.text}
        </ThemedText>
        <View style={styles.proposalBox}>
          <IconBubble label="?" />
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

      <MoloCard style={styles.adviceCard}>
        <View style={styles.cardHeaderRow}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Conseil d&apos;achat
          </ThemedText>
          <ThemedText type="small" style={styles.cardMeta}>
            IA + regles
          </ThemedText>
        </View>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          multiline
          placeholder="Pose une question budgetaire"
          placeholderTextColor={MoloColors.textFaint}
          style={styles.textArea}
        />
        <View style={styles.answerBox}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Recommandation
          </ThemedText>
          <ThemedText type="small" style={styles.cardMeta}>
            Tu peux viser {monthNames[laptopAdvice.recommendedMonth]} pour l&apos;ordinateur. Mets
            de cote {formatMoney(laptopAdvice.monthlySaving)} par mois pour garder une marge.
          </ThemedText>
        </View>
      </MoloCard>

      <View style={styles.endpointPanel}>
        {[
          'Transcription audio',
          'Interpretation intention',
          'Validation utilisateur',
          'Simulation achat',
        ].map((item) => (
          <View key={item} style={styles.endpointRow}>
            <IconBubble label=">" />
            <ThemedText type="smallBold" style={styles.endpointText}>
              {item}
            </ThemedText>
          </View>
        ))}
      </View>
    </WalletScreen>
  );
}

const styles = StyleSheet.create({
  recorderCard: {
    minHeight: 202,
    borderRadius: MoloRadius.card,
    padding: Spacing.four,
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: MoloColors.purple900,
    boxShadow: MoloShadow.floating,
  },
  recorderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  recorderCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  recorderTitle: {
    color: MoloColors.text,
    fontSize: 23,
    lineHeight: 29,
  },
  recorderDetail: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  commandRail: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  commandChip: {
    minHeight: 46,
    minWidth: 112,
    borderRadius: 23,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  commandChipActive: {
    backgroundColor: MoloColors.text,
  },
  commandText: {
    color: MoloColors.textMuted,
  },
  commandTextActive: {
    color: MoloColors.canvas,
  },
  transcriptionCard: {
    gap: Spacing.three,
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
    lineHeight: 22,
  },
  proposalBox: {
    minHeight: 72,
    borderRadius: MoloRadius.tile,
    padding: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: MoloColors.canvasSoft,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
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
  textArea: {
    minHeight: 110,
    borderRadius: MoloRadius.tile,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 22,
    color: MoloColors.text,
    backgroundColor: MoloColors.canvasSoft,
    textAlignVertical: 'top',
  },
  answerBox: {
    borderRadius: MoloRadius.tile,
    backgroundColor: MoloColors.canvasSoft,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  endpointPanel: {
    borderRadius: MoloRadius.card,
    overflow: 'hidden',
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.stroke,
  },
  endpointRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: MoloColors.stroke,
  },
  endpointText: {
    color: MoloColors.text,
  },
});
