import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

export default function CreaeteEventModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContainer}>
            <View style={{display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems: "center"}}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onClose()}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Plan An Event</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Event Name"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Event Date (e.g. 2025-12-31)"
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Event Description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => onClose()}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    // alignSelf: "flex-start",
  },
  createButton: {
    marginTop: 20,
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
});
