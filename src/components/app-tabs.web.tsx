import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';

import { MoloColors, MoloRadius, MoloShadow } from '@/constants/molo-design';
import { Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Budget</TabButton>
          </TabTrigger>
          <TabTrigger name="shopping-list" href="/shopping-list" asChild>
            <TabButton>Liste de courses</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>IA</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.tabButtonView, isFocused && styles.tabButtonActive]}>
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
        <ThemedText type="smallBold" style={styles.brandText}>
          Molo
        </ThemedText>

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
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: MoloRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: 520,
    minHeight: 58,
    backgroundColor: MoloColors.panel,
    borderWidth: 1,
    borderColor: MoloColors.strokeSoft,
    boxShadow: MoloShadow.floating,
  },
  brandText: {
    marginRight: 'auto',
    color: MoloColors.text,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    minHeight: 42,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: MoloColors.text,
  },
  tabText: {
    color: MoloColors.textMuted,
  },
  tabTextActive: {
    color: MoloColors.canvas,
  },
});
