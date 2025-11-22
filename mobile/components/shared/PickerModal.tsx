import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";

interface PickerItem {
  _id: string;
  [key: string]: any;
}

interface PickerModalProps<T extends PickerItem> {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  keyExtractor?: (item: T) => string;
}

export default function PickerModal<T extends PickerItem>({
  visible,
  onClose,
  title,
  data,
  selectedId,
  onSelect,
  renderItem,
  keyExtractor = (item) => item._id,
}: PickerModalProps<T>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => {
              const isSelected = selectedId === item._id;
              return (
                <TouchableOpacity
                  style={[
                    styles.item,
                    isSelected && styles.itemSelected,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  {renderItem(item, isSelected)}
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

export const PickerItemText = ({
  text,
  isSelected,
  isSubtext = false
}: {
  text: string;
  isSelected: boolean;
  isSubtext?: boolean;
}) => (
  <Text
    style={[
      isSubtext ? styles.itemSubtext : styles.itemText,
      isSelected && !isSubtext && styles.itemTextSelected,
    ]}
  >
    {text}
  </Text>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    backgroundColor: "#1f1f2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: "#fff",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  itemSelected: {
    backgroundColor: "rgba(168, 85, 247, 0.1)",
  },
  itemText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#e5e7eb",
  },
  itemTextSelected: {
    color: "#a855f7",
    fontFamily: Fonts.semiBold,
  },
  itemSubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    marginTop: 4,
  },
});
