import { useState } from 'react';

import { Alert, Image, StyleSheet, View } from 'react-native';

import { Button, Card, Text, TextInput } from 'react-native-paper';

import { Controller, useForm } from 'react-hook-form';

import * as ImagePicker from 'expo-image-picker';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useVisitor } from '../context/VisitorContext';

import { createVisitor, uploadVisitorPhoto } from '../services/supabaseService';

type FormData = {
  fullName: string;
  designation: string;
  companyName: string;
  mobileNo: string;
  purpose: string;
  vehicleNo: string;
  remarks: string;
};

export default function NewVisitorScreen() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      designation: '',
      companyName: '',
      mobileNo: '',
      purpose: '',
      vehicleNo: '',
      remarks: '',
    },
  });

  const { addVisitor } = useVisitor();

  const [image, setImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickIdImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!image) {
        Alert.alert('Photo Required', 'Please capture the visitor photo.');
        return;
      }

      // Upload Visitor Photo
      const photoUrl = image ? await uploadVisitorPhoto(image) : null;

      const idCardUrl = idImage ? await uploadVisitorPhoto(idImage) : null;

      const visitorData = {
        id: Date.now().toString(),

        ...data,

        image,

        idCardImage: idImage,

        inTime: new Date().toLocaleTimeString(),

        status: 'ACTIVE' as const,
      };

      // Save to db
      await createVisitor({
        full_name: data.fullName,
        designation: data.designation,
        company_name: data.companyName,
        mobile_no: data.mobileNo,
        purpose: data.purpose,
        vehicle_no: data.vehicleNo,
        remarks: data.remarks,

        photo_url: photoUrl,
        id_card_url: idCardUrl,

        status: 'ACTIVE',
      });

      // Update local Context
      addVisitor(visitorData);

      Alert.alert('Success', 'Visitor saved successfully');

      reset({
        fullName: '',
        designation: '',
        companyName: '',
        mobileNo: '',
        purpose: '',
        vehicleNo: '',
        remarks: '',
      });

      setImage(null);
      setIdImage(null);
    } catch (error: any) {
      console.log('FULL ERROR:', error);

      Alert.alert('Error', error?.message || JSON.stringify(error));
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={80}
      keyboardShouldPersistTaps='handled'
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant='headlineSmall' style={styles.title}>
            New Visitor Entry
          </Text>

          {/* Full Name */}
          <Controller
            control={control}
            name='fullName'
            rules={{
              required: 'Name is required',
              pattern: {
                value: /^[A-Za-z ]+$/,
                message: 'Name should contain only alphabets',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Full Name'
                mode='outlined'
                value={value}
                style={styles.input}
                autoCapitalize='words'
                onChangeText={onChange}
                error={!!errors.fullName}
              />
            )}
          />

          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName.message}</Text>
          )}

          {/* Designation */}
          <Controller
            control={control}
            name='designation'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Designation'
                mode='outlined'
                style={styles.input}
                value={value}
                autoCapitalize='words'
                onChangeText={onChange}
              />
            )}
          />

          {/* Company */}
          <Controller
            control={control}
            name='companyName'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Company Name'
                mode='outlined'
                style={styles.input}
                value={value}
                autoCapitalize='words'
                onChangeText={onChange}
              />
            )}
          />

          {/* Mobile */}
          <Controller
            control={control}
            name='mobileNo'
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit mobile number',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Mobile Number'
                mode='outlined'
                keyboardType='numeric'
                maxLength={10}
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  onChange(numericText);
                }}
                error={!!errors.mobileNo}
              />
            )}
          />

          {errors.mobileNo && (
            <Text style={styles.errorText}>{errors.mobileNo.message}</Text>
          )}

          {/* Purpose */}
          <Controller
            control={control}
            name='purpose'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Purpose of Visit'
                mode='outlined'
                style={styles.input}
                value={value}
                autoCapitalize='sentences'
                onChangeText={onChange}
              />
            )}
          />

          {/* Vehicle Number */}
          <Controller
            control={control}
            name='vehicleNo'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Vehicle Number'
                mode='outlined'
                style={styles.input}
                value={value}
                autoCapitalize='characters'
                onChangeText={onChange}
              />
            )}
          />

          {/* Remarks */}
          <Controller
            control={control}
            name='remarks'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Remarks'
                mode='outlined'
                multiline
                numberOfLines={4}
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Text variant='titleMedium' style={{ marginBottom: 8 }}>
            Visitor Photo *
          </Text>

          <Button
            mode='outlined'
            onPress={pickImage}
            style={styles.photoButton}
          >
            Capture Photo
          </Button>

          {image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          )}

          <Text
            variant='titleMedium'
            style={{
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            ID Card Photo
          </Text>

          <Text
            style={{
              color: '#666',
              marginBottom: 15,
            }}
          >
            Optional for APDCL Employees
          </Text>

          <Button
            mode='outlined'
            onPress={pickIdImage}
            style={styles.photoButton}
          >
            Capture ID Card
          </Button>

          {idImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: idImage }} style={styles.image} />
            </View>
          )}

          <Button
            mode='contained'
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            Submit Entry
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },

  card: {
    borderRadius: 12,
    padding: 8,
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },

  input: {
    marginBottom: 15,
  },

  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },

  photoButton: {
    marginBottom: 20,
  },

  imageContainer: {
    alignItems: 'center',
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
