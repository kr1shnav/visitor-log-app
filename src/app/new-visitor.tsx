import React, { useState } from "react";

import {
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  View,
} from "react-native";

import {
  TextInput,
  Button,
  Text,
  Card,
} from "react-native-paper";

import { useForm, Controller } from "react-hook-form";

import * as ImagePicker from "expo-image-picker";

type FormData = {
  fullName: string;
  designation: string;
  companyName: string;
  mobileNo: string;
  purpose: string;
  verticalNo: string;
  remarks: string;
};

export default function NewVisitorScreen() {
  const { control, handleSubmit, reset } =
    useForm<FormData>();

  const [image, setImage] =
    useState<string | null>(null);

  // Capture Photo
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed."
      );
      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Submit Form
  const onSubmit = (data: FormData) => {
    const visitorData = {
      ...data,
      image,
      inTime: new Date().toISOString(),
    };

    console.log(visitorData);

    Alert.alert(
      "Success",
      "Visitor entry submitted successfully."
    );

    reset();
    setImage(null);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={styles.title}
          >
            New Visitor Entry
          </Text>

          {/* Full Name */}
          <Controller
            control={control}
            name="fullName"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Full Name"
                mode="outlined"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Designation */}
          <Controller
            control={control}
            name="designation"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Designation"
                mode="outlined"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Company Name */}
          <Controller
            control={control}
            name="companyName"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Company Name"
                mode="outlined"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Mobile Number */}
          <Controller
            control={control}
            name="mobileNo"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Mobile Number"
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Purpose */}
          <Controller
            control={control}
            name="purpose"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Purpose of Visit"
                mode="outlined"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Vertical Number */}
          <Controller
            control={control}
            name="verticalNo"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Vertical Number"
                mode="outlined"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Remarks */}
          <Controller
            control={control}
            name="remarks"
            render={({
              field: { onChange, value },
            }) => (
              <TextInput
                label="Remarks"
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Capture Photo */}
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.photoButton}
          >
            Capture Photo
          </Button>

          {/* Image Preview */}
          {image && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.image}
              />
            </View>
          )}

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            Submit Entry
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },

  card: {
    borderRadius: 12,
    padding: 8,
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },

  input: {
    marginBottom: 15,
  },

  photoButton: {
    marginBottom: 20,
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
  },

  button: {
    paddingVertical: 6,
    marginTop: 10,
  },
});