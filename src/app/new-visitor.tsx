import { useState } from 'react';

import { Alert, Image, StyleSheet, View } from 'react-native';

import { Button, Card, Text, TextInput, Switch } from 'react-native-paper';

import { Controller, useForm } from 'react-hook-form';

import * as ImagePicker from 'expo-image-picker';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useVisitor } from '../context/VisitorContext';

import { createVisitor, uploadVisitorPhoto, getVisitors } from '../services/supabaseService';

import { Checkbox } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

type FormData = {
  fullName: string;
  designation: string;
  companyName: string;
  mobileNo: string;
  purpose: string;
  vehicleNo: string;
  remarks: string;
  laptopBag: boolean;
  hostName: string;
};

export default function NewVisitorScreen() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      designation: '',
      companyName: '',
      mobileNo: '',
      purpose: '',
      vehicleNo: '',
      hostName: '',
      remarks: '',
      laptopBag: false,
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

      const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');

      const now = new Date();

      const year = now.getFullYear();

      const day = String(now.getDate()).padStart(2, '0');

      const month = String(now.getMonth() + 1).padStart(2, '0');

      const visitors = await getVisitors();

      const visitorNo = (visitors?.length || 0) + 1;

      const visitorId = `DC-${year}-${day}-${month}-${visitorNo}`;
      // Save to db
      await createVisitor({
        visitor_id: visitorId,

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

        created_by: user.username,

        created_by_name: user.full_name,
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
      <Text variant='headlineSmall' style={styles.pageTitle}>
        New Visitor Entry
      </Text>

      {/* PERSONAL INFORMATION */}
      <Card style={styles.sectionCard}>
        <Card.Title title='Personal Information' />

        <Card.Content>
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
                label='Full Name *'
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
            rules={{
              required: 'Designation is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Designation *'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={styles.input}
                error={!!errors.designation}
              />
            )}
          />

          {errors.designation && (
            <Text style={styles.errorText}>{errors.designation.message}</Text>
          )}

          {/* Company */}
          <Controller
            control={control}
            name='companyName'
            rules={{
              required: 'Company Name is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Company Name *'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={styles.input}
                error={!!errors.companyName}
              />
            )}
          />

          {errors.companyName && (
            <Text style={styles.errorText}>{errors.companyName.message}</Text>
          )}

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
                label='Mobile Number *'
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
        </Card.Content>
      </Card>

      {/* VISIT DETAILS */}
      <Card style={styles.sectionCard}>
        <Card.Title title='Visit Details' />

        <Card.Content>
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

          <Controller
            control={control}
            name='hostName'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Host Name'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

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

          <View style={styles.switchRow}>
            <Text variant='bodyLarge'>Laptop Bag</Text>

            <Switch
              value={watch('laptopBag')}
              onValueChange={(value) => setValue('laptopBag', value)}
            />
          </View>
        </Card.Content>
      </Card>

      {/* MEDIA */}
      <Card style={styles.sectionCard}>
        <Card.Title title='Visitor Photo' />

        <Card.Content>
          <Button
            mode='outlined'
            icon='camera'
            onPress={pickImage}
            style={styles.uploadButton}
          >
            Capture Visitor Photo
          </Button>

          {image && (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          )}

          <Text
            style={{
              marginTop: 10,
              marginBottom: 10,
              color: '#666',
            }}
          >
            ID Card Photo (Optional for APDCL Employees)
          </Text>

          <Button
            mode='outlined'
            icon='card-account-details'
            onPress={pickIdImage}
            style={styles.uploadButton}
          >
            Capture ID Card
          </Button>

          {idImage && (
            <Image source={{ uri: idImage }} style={styles.imagePreview} />
          )}
        </Card.Content>
      </Card>

      <Button
        mode='contained'
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
      >
        Save Visitor
      </Button>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F7FB',
  },

  pageTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },

  sectionCard: {
    marginBottom: 20,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    elevation: 3,
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

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  uploadButton: {
    marginBottom: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
  },

  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },

  submitButton: {
    marginBottom: 30,
    paddingVertical: 6,
    borderRadius: 14,
  },
});
