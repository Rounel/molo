import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton, MoloCard, SectionHeader } from '@/components/molo-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
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
    intent: 'create_expense',
    summary: 'Depense surprise de 25 000 FCFA ajoutee au mois courant.',
  },
  {
    id: 'freelance',
    text: "J'ai recu 100 000 FCFA d'une mission freelance.",
    intent: 'create_income',
    summary: 'Revenu freelance de 100 000 FCFA pret a etre confirme.',
  },
  {
    id: 'phone',
    text: 'Prevois un achat telephone de 300 000 FCFA en aout.',
    intent: 'create_purchase',
    summary: 'Achat telephone de 300 000 FCFA planifie pour aout.',
  },
];

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [selectedCommand, setSelectedCommand] = useState(voiceCommands[0]);
  const [confirmed, setConfirmed] = useState(false);
  const [question, setQuestion] = useState('Quand puis-je acheter un ordinateur a 800 000 FCFA ?');
  const summaries = useMemo(() => buildMonthlySummaries(initialEntries, budgetColumns), []);
  const laptopAdvice = getPurchaseAdvice(plannedPurchases[0], summaries);
  const isTablet = width >= 720;
  const contentHorizontalPadding = width >= 720 ? Spacing.four : Spacing.three;

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + 92,
          paddingHorizontal: contentHorizontalPadding,
        },
      ]}>
      <ThemedView style={[styles.shell, { maxWidth: isTablet ? 680 : 430 }]}>
        <View style={styles.appBar}>
          <View>
            <ThemedText type="small" themeColor="textSecondary">
              Assistant IA
            </ThemedText>
            <ThemedText type="smallBold">Commande vocale</ThemedText>
          </View>
          <View style={styles.statusPill}>
            <ThemedText type="smallBold" style={styles.statusPillText}>
              Validation
            </ThemedText>
          </View>
        </View>

        <MoloCard tone="ink" style={styles.recorderCard}>
          <View style={styles.recorder}>
            <View style={styles.micCircle}>
              <ThemedText type="subtitle" style={styles.micText}>
                AI
              </ThemedText>
            </View>
            <View style={styles.recorderText}>
              <ThemedText type="subtitle" style={styles.recorderTitle}>
                Parle, Molo prepare l&apos;action.
              </ThemedText>
              <ThemedText type="small" style={styles.softInvertedText}>
                La modification reste en attente tant que tu ne confirmes pas.
              </ThemedText>
            </View>
          </View>
          <ActionButton
            label="Simuler une transcription"
            variant="secondary"
            onPress={() => setConfirmed(false)}
          />
        </MoloCard>

        <SectionHeader title="Commandes vocales" detail="Aucune modification sans validation." />
        <ScrollView horizontal={!isTablet} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.commandList}>
          {voiceCommands.map((command) => (
            <Pressable
              key={command.id}
              onPress={() => {
                setSelectedCommand(command);
                setConfirmed(false);
              }}
              style={[
                styles.commandChip,
                selectedCommand.id === command.id && styles.commandChipActive,
              ]}>
              <ThemedText
                type="smallBold"
                style={selectedCommand.id === command.id ? styles.activeText : styles.inactiveText}>
                {command.intent}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <MoloCard style={styles.transcriptionCard}>
          <ThemedText type="small" themeColor="textSecondary">
            Transcription
          </ThemedText>
          <ThemedText>{selectedCommand.text}</ThemedText>
          <View style={styles.proposalBox}>
            <ThemedText type="smallBold" style={styles.invertedText}>
              Action proposee
            </ThemedText>
            <ThemedText type="small" style={styles.softInvertedText}>
              {selectedCommand.summary}
            </ThemedText>
          </View>
          {confirmed ? (
            <ThemedText type="smallBold" style={styles.confirmedText}>
              Action confirmee. Dans la version API, elle sera appliquee au budget.
            </ThemedText>
          ) : (
            <View style={styles.actions}>
              <ActionButton label="Confirmer" onPress={() => setConfirmed(true)} />
              <ActionButton label="Modifier" variant="secondary" onPress={() => setConfirmed(false)} />
            </View>
          )}
        </MoloCard>

        <SectionHeader title="Conseil d'achat" detail="Calcul deterministe, reponse reformulee par IA." />
        <MoloCard tone="mint" style={styles.adviceCard}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            multiline
            placeholder="Pose une question budgetaire"
            placeholderTextColor="#7B8190"
            style={styles.textArea}
          />
          <View style={styles.answer}>
            <ThemedText type="smallBold" style={styles.darkText}>
              Recommandation
            </ThemedText>
            <ThemedText type="small" style={styles.darkText}>
              Tu peux viser {monthNames[laptopAdvice.recommendedMonth]} pour l&apos;ordinateur. Pour
              rester prudent, mets de cote {formatMoney(laptopAdvice.monthlySaving)} par mois et
              garde une marge de securite avant l&apos;achat.
            </ThemedText>
          </View>
        </MoloCard>

        <SectionHeader title="Architecture cible" detail="Pret a brancher sur Django Rest Framework." />
        <MoloCard>
          {[
            'POST /api/ai/transcribe/ pour convertir audio en texte',
            'POST /api/ai/interpret/ pour extraire intention et action',
            'POST /api/ai/confirm-action/ pour appliquer apres validation',
            'POST /api/planned-purchases/{id}/simulate/ pour calculer la meilleure periode',
          ].map((item) => (
            <View key={item} style={styles.endpointRow}>
              <View style={styles.dot} />
              <ThemedText type="small">{item}</ThemedText>
            </View>
          ))}
        </MoloCard>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  shell: {
    width: '100%',
    gap: Spacing.three,
    backgroundColor: 'transparent',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  statusPill: {
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#B6F2C8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  statusPillText: {
    color: '#111827',
  },
  recorderCard: {
    minHeight: 174,
    justifyContent: 'space-between',
  },
  recorder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  micCircle: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#B6F2C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micText: {
    color: '#111827',
    fontSize: 27,
  },
  recorderText: {
    flex: 1,
    gap: Spacing.one,
  },
  recorderTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
  },
  invertedText: {
    color: '#FFFFFF',
  },
  softInvertedText: {
    color: '#D9E1EF',
  },
  commandList: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  commandChip: {
    minHeight: 44,
    minWidth: 138,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDF2F7',
  },
  commandChipActive: {
    backgroundColor: '#111827',
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#111827',
  },
  darkText: {
    color: '#111827',
  },
  proposalBox: {
    borderRadius: 8,
    backgroundColor: '#121826',
    padding: Spacing.three,
    gap: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  confirmedText: {
    color: '#16824A',
  },
  textArea: {
    minHeight: 112,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7E8D7',
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 22,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  answer: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: Spacing.three,
    gap: Spacing.one,
  },
  endpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#58B579',
  },
  transcriptionCard: {
    gap: Spacing.three,
  },
  adviceCard: {
    gap: Spacing.three,
  },
});
