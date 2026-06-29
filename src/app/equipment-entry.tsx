import React, { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  TextInput,
  Button,
  Text,
  Card,
} from 'react-native-paper';

import { Controller, useForm } from 'react-hook-form';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createEquipmentLog } from '../services/supabaseService';

import { supabase } from '../lib/supabase';

import * as ImagePicker from 'expo-image-picker';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface FormData {
  borrowerName: string;
  phoneNo: string;
  itemName: string;
  serialNo: string;
  quantity: string;
  remarks: string;
}

export default function EquipmentEntryScreen() {
  const [photo, setPhoto] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      borrowerName: '',
      phoneNo: '',
      itemName: '',
      serialNo: '',
      quantity: '1',
      remarks: '',
    },
  });

  const pickPhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Camera permission is required',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return null;

    try {
      const response = await fetch(photo);

      const blob = await response.blob();

      const fileName = `equipment_${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from('equipment-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from('equipment-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    const user = JSON.parse(
      (await AsyncStorage.getItem('user')) || '{}',
    );

    try {
      const photoUrl = await uploadPhoto();

      await createEquipmentLog({
        borrower_name: data.borrowerName,
        phone_no: data.phoneNo,
        item_name: data.itemName,
        serial_no: data.serialNo,
        quantity: Number(data.quantity),
        remarks: data.remarks,

        photo_url: photoUrl,

        status: 'OUT',

        created_by: user.username,
        created_by_name: user.full_name,
      });

      Alert.alert(
        'Success',
        'Equipment entry saved successfully',
      );

      setPhoto(null);

      reset();
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Failed to save equipment',
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text
        variant='headlineSmall'
        style={styles.pageTitle}
      >
        Equipment Register
      </Text>

      {/* Borrower Information */}

      <Card style={styles.sectionCard}>
        <Card.Title title='Borrower Information' />

        <Card.Content>
          <Controller
            control={control}
            name='borrowerName'
            rules={{
              required: 'Borrower Name is required',
              pattern: {
                value: /^[A-Za-z ]+$/,
                message: 'Only alphabets allowed',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Borrower Name *'
                mode='outlined'
                value={value}
                onChangeText={(text) =>
                  onChange(
                    text.replace(/[^A-Za-z ]/g, ''),
                  )
                }
                style={styles.input}
                error={!!errors.borrowerName}
              />
            )}
          />

          {errors.borrowerName && (
            <Text style={styles.errorText}>
              {errors.borrowerName.message}
            </Text>
          )}

          <Controller
            control={control}
            name='phoneNo'
            rules={{
              required: 'Phone Number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message:
                  'Enter a valid 10-digit phone number',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Phone Number *'
                mode='outlined'
                keyboardType='phone-pad'
                maxLength={10}
                value={value}
                onChangeText={(text) =>
                  onChange(
                    text.replace(/[^0-9]/g, ''),
                  )
                }
                style={styles.input}
                error={!!errors.phoneNo}
              />
            )}
          />

          {errors.phoneNo && (
            <Text style={styles.errorText}>
              {errors.phoneNo.message}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Equipment Details */}

      <Card style={styles.sectionCard}>
        <Card.Title title='Equipment Details' />

        <Card.Content>
          <Controller
            control={control}
            name='itemName'
            rules={{
              required: 'Item Name is required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Item Name *'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={styles.input}
                error={!!errors.itemName}
              />
            )}
          />

          {errors.itemName && (
            <Text style={styles.errorText}>
              {errors.itemName.message}
            </Text>
          )}

          <Controller
            control={control}
            name='serialNo'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Serial Number'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          <Controller
            control={control}
            name='quantity'
            rules={{
              required: 'Quantity is required',
              pattern: {
                value: /^[1-9][0-9]*$/,
                message: 'Enter a valid quantity',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Quantity *'
                mode='outlined'
                keyboardType='numeric'
                value={value}
                onChangeText={(text) =>
                  onChange(
                    text.replace(/[^0-9]/g, ''),
                  )
                }
                style={styles.input}
                error={!!errors.quantity}
              />
            )}
          />

          {errors.quantity && (
            <Text style={styles.errorText}>
              {errors.quantity.message}
            </Text>
          )}

          <Controller
            control={control}
            name='remarks'
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Remarks'
                mode='outlined'
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Photo */}

      <Card style={styles.sectionCard}>
        <Card.Title title='Equipment Photo' />

        <Card.Content>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={pickPhoto}
          >
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialCommunityIcons
                  name='camera'
                  size={50}
                  color='#64748B'
                />

                <Text style={{ marginTop: 10 }}>
                  Capture Equipment Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Button
        mode='contained'
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
      >
        Issue Equipment
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F7FB',
    flexGrow: 1,
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

  photoContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 220,
    overflow: 'hidden',
  },

  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  submitButton: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 14,
    paddingVertical: 6,
  },
});