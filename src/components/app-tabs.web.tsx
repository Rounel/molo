import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { MoloSymbol, type MoloSymbolName } from './molo-symbol';
import { ThemedText } from './themed-text';

import { MoloColors, MoloGradients, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="home">Molo</TabButton>
          </TabTrigger>
          <TabTrigger name="budget" href="/budget" asChild>
            <TabButton icon="budget">Budget</TabButton>
          </TabTrigger>
          <TabTrigger name="shopping-list" href="/shopping-list" asChild>
            <TabButton icon="calendar">Liste de courses</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="ai">Assistant IA</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton icon="more">Parametres</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  icon,
  isFocused,
  ...props
}: TabTriggerSlotProps & { icon: MoloSymbolName }) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={styles.tabButtonView}>
        <View style={[styles.tabIcon, isFocused && styles.tabIconActive, isFocused && MoloGradients.navActive]}>
          <MoloSymbol name={icon} size={20} color={isFocused ? MoloColors.text : MoloColors.textMuted} />
        </View>
        <ThemedText type="smallBold" style={isFocused ? styles.tabTextActive : styles.tabText}>
          {children}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: MoloRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 430,
    minHeight: 76,
    backgroundColor: 'rgba(18, 20, 31, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    boxShadow: MoloShadow.floating,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    minHeight: 56,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 2,
    backgroundColor: 'transparent',
  },
  tabIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabIconActive: {
    backgroundColor: MoloColors.purple900,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  tabText: {
    color: MoloColors.textMuted,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
  },
  tabTextActive: {
    color: MoloColors.purple200,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
  },
});
