import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/AppIcon";
import { Checkbox } from "@/components/ui/Checkbox";
import type { TodoItem } from "@/constants/sample-data";
import { palette, radius, shadow, toneColors } from "@/constants/theme";

const assigneeColors: Record<string, { fg: string; bg: string }> = {
  지현: toneColors.green,
  진국: toneColors.blue,
};

type Props = {
  initialItems: TodoItem[];
};

export function TodoChecklist({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [doneOpen, setDoneOpen] = useState(false);
  const accordionLockedUntil = useRef(0);
  const openItems = items.filter((item) => !item.done);
  const doneItems = items.filter((item) => item.done);

  const armAccordionLock = () => {
    accordionLockedUntil.current = Date.now() + 700;
  };

  const toggle = (id: string) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );
    setItems(next);
    if (!next.some((item) => item.done)) setDoneOpen(false);
  };

  const toggleDoneList = () => {
    if (Date.now() < accordionLockedUntil.current) return;
    setDoneOpen((open) => !open);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>함께하는 작은 일들</Text>

      <View style={styles.card}>
        {openItems.map((item, index) => (
          <TodoRow
            key={item.id}
            item={item}
            divider={index > 0}
            onToggle={toggle}
            onPressIn={armAccordionLock}
          />
        ))}

        {doneItems.length > 0 && (
          <>
            <Pressable
              onPress={toggleDoneList}
              accessibilityRole="button"
              accessibilityState={{ expanded: doneOpen }}
              accessibilityLabel={`완료 ${doneItems.length}개, ${doneOpen ? "펼쳐짐" : "접힘"}`}
              style={({ pressed }) => [
                styles.doneToggle,
                openItems.length > 0 && styles.divider,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.doneToggleLabel}>
                완료 {doneItems.length}개
              </Text>
              <AppIcon
                name={doneOpen ? "chevronUp" : "chevronDown"}
                color={palette.muted}
                size={16}
              />
            </Pressable>
            {doneOpen &&
              doneItems.map((item) => (
                <TodoRow
                  key={item.id}
                  item={item}
                  divider
                  onToggle={toggle}
                  onPressIn={armAccordionLock}
                />
              ))}
          </>
        )}
      </View>
    </View>
  );
}

function StruckTitle({ title, done }: { title: string; done: boolean }) {
  return (
    <View style={styles.titleWrap}>
      <View style={styles.titleStrikeHost}>
        <Text style={[styles.title, done && styles.doneText]}>{title}</Text>
        {done ? (
          <View
            pointerEvents="none"
            collapsable={false}
            style={styles.strike}
          />
        ) : null}
      </View>
    </View>
  );
}

function TodoRow({
  item,
  divider,
  onToggle,
  onPressIn,
}: {
  item: TodoItem;
  divider: boolean;
  onToggle: (id: string) => void;
  onPressIn: () => void;
}) {
  const together = item.assignee === "함께";
  const person = assigneeColors[item.assignee] ?? toneColors.blue;
  return (
    <Pressable
      onPressIn={onPressIn}
      onPress={() => {
        // Let this tap finish before the row leaves the layout.
        // Otherwise the accordion that slides into its place receives the same press.
        setTimeout(() => onToggle(item.id), 0);
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.done }}
      accessibilityLabel={`${item.title}, ${item.assignee}`}
      style={({ pressed }) => [
        styles.row,
        divider && styles.divider,
        pressed && styles.pressed,
      ]}
    >
      <Checkbox checked={item.done} round checkedColor={palette.muted} />
      <StruckTitle title={item.title} done={item.done} />
      <View
        style={[
          styles.pill,
          { backgroundColor: together ? palette.soft : person.bg },
        ]}
      >
        <Text
          style={[
            styles.pillLabel,
            { color: together ? palette.accent : person.fg },
          ]}
        >
          {item.assignee}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 13,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    letterSpacing: -0.3,
    color: palette.ink,
  },
  card: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    boxShadow: shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
  },
  pressed: {
    opacity: 0.6,
  },
  titleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  titleStrikeHost: {
    flexShrink: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.2,
    color: palette.ink,
  },
  doneText: {
    color: palette.muted,
  },
  strike: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    marginTop: -0.5,
    backgroundColor: palette.muted,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
    letterSpacing: -0.1,
  },
  doneToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  doneToggleLabel: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    letterSpacing: -0.2,
    color: palette.muted,
  },
});
