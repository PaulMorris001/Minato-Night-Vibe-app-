import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Colors } from "@/constants/colors";
import { fetchCities, fetchAllVendorTypes } from "@/libs/api";
import { BASE_URL } from "@/constants/constants";
import { City, VendorType } from "@/libs/interfaces";
import { useRouter } from "expo-router";
import {
  BottomSheetModal,
  FormInput,
  PrimaryButton,
  PickerModal,
  PickerItemText,
  ImagePickerButton,
} from "@/components/common";

interface BecomeVendorModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BecomeVendorModal({
  visible,
  onClose,
}: BecomeVendorModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([]);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [businessPicture, setBusinessPicture] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    vendorType: "",
    vendorTypeName: "",
    city: "",
    cityName: "",
    address: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    if (visible) {
      loadCitiesAndTypes();
    }
  }, [visible]);

  const loadCitiesAndTypes = async () => {
    try {
      const citiesData = await fetchCities();
      setCities(citiesData);
      const typesData = await fetchAllVendorTypes();
      setVendorTypes(typesData);
    } catch (error) {
      console.error("Error loading cities/types:", error);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.businessName.trim()) {
      Alert.alert("Error", "Please enter your business name");
      return;
    }
    if (!formData.vendorTypeName) {
      Alert.alert("Error", "Please select a vendor type");
      return;
    }
    if (!formData.cityName) {
      Alert.alert("Error", "Please select a city");
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");

      await axios.post(
        `${BASE_URL}/become-vendor`,
        {
          businessName: formData.businessName.trim(),
          businessDescription: formData.businessDescription.trim(),
          businessPicture: businessPicture,
          vendorType: formData.vendorTypeName,
          location: {
            city: formData.cityName,
            address: formData.address.trim(),
          },
          contactInfo: {
            phone: formData.phone.trim(),
            website: formData.website.trim(),
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert(
        "Success!",
        "Welcome to NightVibe vendors! You can now manage your business.",
        [
          {
            text: "Go to Dashboard",
            onPress: () => {
              onClose();
              router.push("/(vendor)/dashboard");
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to register as vendor";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectCity = (city: City) => {
    setFormData({
      ...formData,
      city: city._id,
      cityName: city.name,
    });
    setShowCityPicker(false);
  };

  const selectVendorType = (type: VendorType) => {
    setFormData({
      ...formData,
      vendorType: type._id,
      vendorTypeName: type.name,
    });
    setShowTypePicker(false);
  };

  return (
    <>
      <BottomSheetModal
        visible={visible}
        onClose={onClose}
        title="Become a Vendor"
        maxHeight="90%"
      >
        <View style={styles.intro}>
          <Ionicons name="briefcase" size={48} color={Colors.primary} />
          <Text style={styles.introTitle}>Start Your Business</Text>
          <Text style={styles.introText}>
            Fill in your business details to join NightVibe as a vendor
          </Text>
        </View>

        <ImagePickerButton
          imageUri={businessPicture}
          onImageSelected={setBusinessPicture}
          label="Business Photo"
          size={160}
          shape="square"
        />

        <FormInput
          label="Business Name"
          required
          value={formData.businessName}
          onChangeText={(text) =>
            setFormData({ ...formData, businessName: text })
          }
          placeholder="Enter your business name"
        />

        <View style={styles.field}>
          <Text style={styles.label}>
            Business Type <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowTypePicker(true)}
          >
            <Text
              style={[
                styles.pickerText,
                !formData.vendorTypeName && styles.pickerPlaceholder,
              ]}
            >
              {formData.vendorTypeName || "Select vendor type"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <FormInput
          label="Description"
          value={formData.businessDescription}
          onChangeText={(text) =>
            setFormData({ ...formData, businessDescription: text })
          }
          placeholder="Describe your business..."
          multiline
          containerStyle={styles.textAreaContainer}
        />

        <View style={styles.field}>
          <Text style={styles.label}>
            City <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowCityPicker(true)}
          >
            <Text
              style={[
                styles.pickerText,
                !formData.cityName && styles.pickerPlaceholder,
              ]}
            >
              {formData.cityName || "Select city"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <FormInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter full address"
        />

        <FormInput
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <FormInput
          label="Website"
          value={formData.website}
          onChangeText={(text) => setFormData({ ...formData, website: text })}
          placeholder="Enter website URL"
          autoCapitalize="none"
          keyboardType="url"
        />

        <PrimaryButton onPress={handleSubmit} loading={loading}>
          Become a Vendor
        </PrimaryButton>

        <View style={styles.bottomPadding} />
      </BottomSheetModal>

      {/* City Picker Modal */}
      <PickerModal
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        title="Select City"
        data={cities}
        selectedId={formData.city}
        onSelect={selectCity}
        renderItem={(item, isSelected) => (
          <>
            <PickerItemText text={item.name} isSelected={isSelected} />
            <PickerItemText text={item.state} isSelected={isSelected} isSubtext />
          </>
        )}
      />

      {/* Vendor Type Picker Modal */}
      <PickerModal
        visible={showTypePicker}
        onClose={() => setShowTypePicker(false)}
        title="Select Vendor Type"
        data={vendorTypes}
        selectedId={formData.vendorType}
        onSelect={selectVendorType}
        renderItem={(item, isSelected) => (
          <View style={styles.typeItemRow}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color={isSelected ? Colors.primary : "#9ca3af"}
              style={styles.typeIcon}
            />
            <PickerItemText text={item.name} isSelected={isSelected} />
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  picker: {
    backgroundColor: "#1f1f2e",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#374151",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#fff",
  },
  pickerPlaceholder: {
    color: "#6b7280",
  },
  textAreaContainer: {
    marginBottom: 20,
  },
  bottomPadding: {
    height: 40,
  },
  typeItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    marginRight: 12,
  },
});
